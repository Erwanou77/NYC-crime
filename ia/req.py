import torch
import joblib
import numpy as np
from datetime import datetime
from model_def import CrimePredictor

# Load trained model

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load full model (saved with torch.save(model, ...))
model = torch.load("./model/crime_predictor_full.pth", map_location=device)
model.eval()

scaler = joblib.load("./model/scaler.pkl")  # Make sure you saved it during training

# Example input — just a date and time
test_datetime = "2025-12-01 14:30:00"  # May 7, 2025 at 2:30 PM

# Extract features
dt = datetime.strptime(test_datetime, "%Y-%m-%d %H:%M:%S")
hour = dt.hour
day_of_week = dt.weekday()
day_of_month = dt.day
month = dt.month

# Create input feature vector
features = np.array([[hour, day_of_week, day_of_month, month]])
scaled = scaler.transform(features)

# Convert to tensor
x = torch.tensor(scaled, dtype=torch.float32).to(device)

# Run prediction
with torch.no_grad():
    risk_score = model(x).item()

print(f"📍 Predicted Crime Risk Score: {risk_score:.4f}")

if risk_score > 0.7:
    print("⚠️  High likelihood of crime.")
elif risk_score > 0.4:
    print("🔶 Moderate likelihood of crime.")
else:
    print("✅ Low likelihood of crime.")
