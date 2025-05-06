import requests
import time
from pymongo import MongoClient
from pymongo.errors import BulkWriteError

URL = "https://data.cityofnewyork.us/resource/5uac-w243.json?$limit=1"

def fetch_and_store():
    print("⏳ Fetching data...")
    response = requests.get(URL)
    if response.status_code != 200:
        print(f"❌ Error fetching data: {response.status_code}")
        return

    data = response.json()
    print(data)
    return

    if not isinstance(data, list):
        print("❌ Unexpected response format")
        return

    client = MongoClient("mongodb://root:example@mongo:27017/?authSource=admin")
    db = client["nyc_crime"]
    collection = db["incidents"]

    for record in data:
        cmplnt_num = record.get('cmplnt_num')
        if cmplnt_num:
            collection.replace_one({'cmplnt_num': cmplnt_num}, record, upsert=True)

    print(f"✅ {len(data)} record(s) inserted into MongoDB")

if __name__ == "__main__":
    while True:
        fetch_and_store()
        print("🕒 Waiting 10 minutes...")
        time.sleep(600)  # 10 minutes
