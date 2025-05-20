import csv
import json
from datetime import datetime
from collections import defaultdict, Counter, deque

data = []

with open('activity.csv', newline='') as f:
    reader = csv.DictReader(f)
    for row in reader:
        timestamp = datetime.fromisoformat(row['timestamp'])
        user_id = row['user_id']
        action = row['action']
        data.append({'timestamp': timestamp, 'user_id': user_id, 'action': action})


user_counter = Counter()

for row in data:
    user_counter[row['user_id']] += 1

top_5 = user_counter.most_common(5)

print("\n📊 Top 5 users by action count:")
for user, count in top_5:
    print(f"{user}: {count} actions")


# Group by (user_id, action)
user_action_map = defaultdict(list)

for row in data:
    key = (row['user_id'], row['action'])
    user_action_map[key].append(row['timestamp'])

# Sliding window check
print("\n⚠️ Users with >10 same actions in any 5-minute window:")
for (user_id, action), timestamps in user_action_map.items():
    timestamps.sort()
    window = deque()
    for time in timestamps:
        window.append(time)
        # Remove timestamps older than 5 minutes
        while (time - window[0]).total_seconds() > 300:
            window.popleft()
        if len(window) > 10:
            print(f"{user_id} did '{action}' {len(window)} times in 5 minutes")
            break  # Report once per user-action combo

output = {
    'top_users': top_5,
    'frequent_actions': []
}

for (user_id, action), timestamps in user_action_map.items():
    timestamps.sort()
    window = deque()
    for time in timestamps:
        window.append(time)
        while (time - window[0]).total_seconds() > 300:
            window.popleft()
        if len(window) > 10:
            output['frequent_actions'].append({
                'user_id': user_id,
                'action': action,
                'count': len(window),
                'start_time': window[0].isoformat(),
                'end_time': window[-1].isoformat()
            })
            break

with open('results.json', 'w') as f:
    json.dump(output, f, indent=2)

print("\n✅ Exported results to results.json")
