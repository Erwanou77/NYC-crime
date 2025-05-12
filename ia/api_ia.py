from flask import Flask, request, jsonify
from flask_cors import CORS
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import MinMaxScaler
import joblib, datetime
import pandas as pd
import requests
import torch
import torch.nn as nn
import numpy as np
from datetime import datetime


app = Flask(__name__)
CORS(app)


model = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
scaler = None


class CrimePredictor(nn.Module):
    def __init__(self, input_dim):
        super(CrimePredictor, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1)
        )
    def forward(self, x):
        return self.model(x)


def load_model():
    global model
    global scaler
    try:
        print("train")
        model = torch.load("./model/crime_predictor_full.pth", map_location=device, weights_only=False)
        scaler = joblib.load("./model/scaler.pkl")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None


def is_valid_date(row):
    try:
        dt = pd.to_datetime(row['cmplnt_fr_dt'] + ' ' + row['cmplnt_fr_tm'], errors='raise')
        return 2000 <= dt.year <= 2100
    except:
        return False
    


@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("🛠 Received request at /train")
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        data = request.get_json()
        # Convert input data to DataFrame
        dt = datetime.strptime(data['date'], "%Y-%m-%d %H:%M:%S")
        hour = dt.hour
        day_of_week = dt.weekday()
        day_of_month = dt.day
        month = dt.month
        features = np.array([[hour, day_of_week, day_of_month, month]])
        scaled = scaler.transform(features)

        x = torch.tensor(scaled, dtype=torch.float32).to(device)

        with torch.no_grad():
            risk_score = model(x).item()

            print(f"📍 Predicted Crime Risk Score: {risk_score:.4f}")
        predict=None
        if risk_score > 0.7:
            predict="⚠️  High likelihood of crime."
        elif risk_score > 0.4:
            predict="🔶 Moderate likelihood of crime."
        else:
            predict="✅ Low likelihood of crime."
        
        return jsonify({'prediction': predict})
    except Exception as e:
        return jsonify({'error': str(e)}), 400



@app.route('/train', methods=['GET'])
def train():
    try:
        url = "http://localhost:4000/graphql"

        query = """
          query {
          crimes {
            cmplnt_num
            addr_pct_cd
            boro_nm
            cmplnt_fr_dt
            cmplnt_fr_tm
            cmplnt_to_dt
            cmplnt_to_tm
            crm_atpt_cptd_cd
            jurisdiction_code
            juris_desc
            ofns_desc
            pd_desc
            latitude
            longitude
          }
        }
        """

        payload = {
            'query': query
        }

        headers = {
            'Content-Type': 'application/json',
        }

        response = requests.post(url, json=payload, headers=headers)
        data=[]

        if response.status_code == 200:
            data_json = response.json()
            data=data_json['data']['crimes']
            print(len(data))
        else:
            print(f"Erreur: {response.status_code}")
        df = pd.DataFrame(data)
        df = df[df.apply(is_valid_date, axis=1)].copy()

        df['datetime'] = pd.to_datetime(df['cmplnt_fr_dt'] + ' ' + df['cmplnt_fr_tm'], errors='raise')

        df['hour'] = df['datetime'].dt.hour
        df['day_of_week'] = df['datetime'].dt.weekday
        df['day_of_month'] = df['datetime'].dt.day
        df['month'] = df['datetime'].dt.month

        scaler = MinMaxScaler()
        time_features = ['hour', 'day_of_week', 'day_of_month', 'month']
        df[time_features] = scaler.fit_transform(df[time_features])

        X = torch.tensor(df[time_features].values, dtype=torch.float32)
        y = torch.tensor([[1.0]] * len(df), dtype=torch.float32)

        dataset = TensorDataset(X, y)
        loader = DataLoader(dataset, batch_size=64, shuffle=True)
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = CrimePredictor(X.shape[1]).to(device)
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

        num_epochs = 10
        for epoch in range(num_epochs):
            model.train()
            running_loss = 0.0
            for xb, yb in loader:
                xb, yb = xb.to(device), yb.to(device)

                optimizer.zero_grad()
                preds = model(xb)
                loss = criterion(preds, yb)
                loss.backward()
                optimizer.step()

                running_loss += loss.item()

            print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {running_loss / len(loader)}")

        joblib.dump(scaler, "./model/scaler.pkl")

        torch.save(model, "./model/crime_predictor_full.pth")

        model = torch.load("./model/crime_predictor_full.pth", map_location=device)
        model.eval()
        load_model()
        
        return jsonify({'message': 'Model trained and reloaded successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    load_model()
    app.run(debug=True, port=5000, host='0.0.0.0')