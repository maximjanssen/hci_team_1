import json

with open("./distances.txt", "r") as f:
	data = json.loads(f.read())

datalist = {}

for element in data:
	if element["From"] not in datalist:
		datalist[element["From"]] = {}
	datalist[element["From"]][element["To"]] = element["Distance"]

print(json.dumps(datalist, indent=2, sort_keys=True))
