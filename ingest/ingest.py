import requests
import time
from pymongo import MongoClient

BASE_URL = "https://data.cityofnewyork.us/resource/5uac-w243.json"
LIMIT = 1000  # Max limit Socrata API usually allows
SLEEP_INTERVAL = 600  # 10 minutes

def fetch_data(offset):
    params = {
        "$limit": LIMIT,
        "$offset": offset
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code != 200:
        print(f"❌ Error fetching data at offset {offset}: {response.status_code}")
        return []
    return response.json()

def store_data(data, collection):
    count = 0
    for record in data:
        cmplnt_num = record.get('cmplnt_num')
        if cmplnt_num:
            collection.replace_one({'cmplnt_num': cmplnt_num}, record, upsert=True)
            count += 1
    return count

def fetch_and_store_all():
    print("⏳ Starting full data fetch...")
    client = MongoClient("mongodb://root:example@mongo:27017/?authSource=admin")
    db = client["nyc_crime"]
    collection = db["incidents"]

    offset = 0
    total_inserted = 0

    while True:
        print(f"📦 Fetching batch with offset {offset}")
        data = fetch_data(offset)
        if not data:
            print("✅ No more data to fetch.")
            break
        inserted = store_data(data, collection)
        total_inserted += inserted
        offset += LIMIT

    print(f"✅ {total_inserted} total record(s) inserted/updated.")

if __name__ == "__main__":
    while True:
        print("🚀 Job started")
        fetch_and_store_all()
        print("🕒 Waiting 10 minutes...\n")
        time.sleep(SLEEP_INTERVAL)
