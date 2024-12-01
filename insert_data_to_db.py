import psycopg2
import os

def insert_data_to_db(data):
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="YT0SBQ6ml8GeKwjZ3KOx",
            host="database-1.cj6oo42usa1e.eu-north-1.rds.amazonaws.com",
            port=5432
        )
        cursor = conn.cursor()
        for index, row in data.iterrows():
            cursor.execute(
                """
                INSERT INTO stock_data (date, open, high, low, close, volume)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (row['Date'], row['Open'], row['High'], row['Low'], row['Close'], row['Volume'])
            )
        conn.commit()
        conn.close()
        print("Data inserted successfully.")
    except Exception as e:
        print(f"Error inserting data: {e}")
