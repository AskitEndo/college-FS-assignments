import csv
from datetime import datetime, timedelta
import random

# Create mock CSV file: timestamp, user_id, action
users = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6']
actions = ['login', 'logout', 'click', 'scroll', 'view']
base_time = datetime.now()

with open('activity.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['timestamp', 'user_id', 'action'])
    for _ in range(500):
        timestamp = (base_time + timedelta(seconds=random.randint(0, 3600))).isoformat()
        writer.writerow([timestamp, random.choice(users), random.choice(actions)])
