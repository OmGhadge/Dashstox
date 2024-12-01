import psycopg2
import pandas as pd

def fetch_data():
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="YT0SBQ6ml8GeKwjZ3KOx",
            host="database-1.cj6oo42usa1e.eu-north-1.rds.amazonaws.com",
            port=5432
        )
        cursor = conn.cursor()
        query = "SELECT * FROM stock_data;"
        cursor.execute(query)
        data = cursor.fetchall()
        df = pd.DataFrame(data, columns=['Date', 'Open', 'High', 'Low', 'Close', 'Volume'])
        conn.close()
        return df
    except Exception as e:
        print(f"Error: {e}")
        return None

stock_data = fetch_data()
print(stock_data)
