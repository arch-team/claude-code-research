# Python script to generate the CSV file
# Save this as generate_sample_data.py and run it

import csv
import random


def generate_sample_data(filename="sample_data.csv", rows=1000):
    """Generate sample CSV data for the exercise"""

    # Ensure data directory exists
    import os

    os.makedirs("data", exist_ok=True)

    with open(filename, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)

        # Write header
        writer.writerow(["id", "value", "category", "score"])

        # Generate data with some duplicates and patterns
        categories = ["A", "B", "C", "D", "E"]

        for i in range(rows):
            row_id = i + 1
            # Create some duplicate values
            value = random.randint(1, rows // 2)
            category = random.choice(categories)
            score = random.randint(0, 100)

            writer.writerow([row_id, value, category, score])

    print(f"Generated {filename} with {rows} rows")


if __name__ == "__main__":
    generate_sample_data()
