import yfinance as yf
import pandas as pd

def fetch_stock_data():
    ticker = "AAPL"
    start_date = "2023-01-01"
    end_date = "2023-12-31"
    output_path = "C:/Users/OM/OneDrive/Desktop/kestra/stock_data.csv"

    stock_data = yf.download(ticker, start=start_date, end=end_date)
    stock_data.reset_index(inplace=True)
    stock_data.to_csv(output_path, index=False)
    print(f"Stock data saved to {output_path}")

fetch_stock_data()
