import csv
import json
import argparse

def parse_csv_to_json(csv_path, json_path):
    """
    Parse a CSV file with headers [name, lat, lon, type, tags, adresse, website]
    into a JSON array of objects with the structure:
    [
      {
        "name": <name>,
        "coords": [<lat>, <lon>],
        "type": <type>,
        "tags": [<tag1>, <tag2>, ...]
      },
      ...
    ]
    """
    data = []
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Parse and clean fields
            name = row.get('name', '').strip()
            try:
                coords = row.get('coords', ', ').split(', ')
                lat = float(coords[0])
                lon = float(coords[1])
            except ValueError as e:
                print(f"error at {name=} {e=}")
                continue
            type_ = row.get('type', '').strip()
            category = row.get('category', 'einkaufen').strip().lower()
            # Split tags by comma and strip whitespace, ignore empty
            tags = [tag.strip() for tag in row.get('tags', '').split(',') if tag.strip()]

            address = row.get('address', '').strip()

            website = row.get('website', '').strip()

            entry = {
                "name": name,
                "coords": [lat, lon],
                "type": type_,
                "category": category,
                "tags": tags,
                "address": address,
                "website": website
            }
            data.append(entry)

    # Write to JSON file
    with open(json_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Convert CSV of locations to JSON schema.'
    )
    parser.add_argument('csv_input', help='Path to input CSV file')
    parser.add_argument('json_output', help='Path to output JSON file')
    args = parser.parse_args()
    parse_csv_to_json(args.csv_input, args.json_output)
    print(f"Converted '{args.csv_input}' to '{args.json_output}'.")

