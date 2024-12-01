# Dashstox - Stock Dashboard Project

## Overview
Dashstox is a real-time stock dashboard built using **Streamlit** for visualization, **Yahoo Finance API** for fetching stock data, **Reddit API** for sentiment analysis, and **Groq** for AI-based assistance. The dashboard displays various stock market metrics, charts, financial news, and Reddit discussions to help investors make informed decisions.

## Features
- **Real-Time Stock Data**: Display stock price, volume, and other relevant metrics from Yahoo Finance.
- **Interactive Charts**: Choose from various chart types (Candlestick, Line) to visualize stock data over different time frames.
- **Reddit Integration**: Fetch and display daily stock discussions from Reddit's r/stocks subreddit and provide a summarized view using Groq AI.
- **Chat Assistant**: Chat with Groq to get insights and answers related to stock data and news.
- **News Integration**: Display the latest financial news using the NewsAPI.

## Technologies Used
- **Streamlit**: Used for building the interactive web dashboard.
- **Yahoo Finance API**: Used for fetching stock data.
- **Reddit API**: Used for fetching Reddit discussions.
- **Groq AI**: Used to summarize Reddit discussions and provide a conversational assistant.
- **PostgreSQL** (AWS RDS): Used for storing stock data.

## Setup Instructions

### Prerequisites
1. **Python**: Make sure you have Python 3.x installed.
2. **Dependencies**: You need to install the required dependencies. You can do this by running:

   ```bash
   pip install -r requirements.txt
