import requests
import streamlit as st

def fetch_financial_news(api_key, query="finance OR stock market OR trading", page_size=10):
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": page_size,
        "apiKey": api_key,
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json().get("articles", [])
    else:
        st.error(f"Error fetching news: {response.status_code}")
        return []
