import streamlit as st
import yfinance as yf
import plotly.graph_objects as go
import pandas as pd

def display_charts(selected_tickers, time_frame, chart_type="Candlestick", indicators=[]):
    st.title('Stock Market Charts')

    interval_options = {
        '1d': '1m',
        '5d': '5m',
        '1mo': '1h',
        '3mo': '1d',
        '1y': '1wk'
    }
    interval = interval_options[time_frame]

    tickers = selected_tickers.split(',')
    ticker = tickers[0]

    try:
        data = yf.Ticker(ticker).history(period=time_frame, interval=interval)

        if "SMA 20" in indicators:
            data['SMA_20'] = data['Close'].rolling(window=20).mean()

        if "EMA 20" in indicators:
            data['EMA_20'] = data['Close'].ewm(span=20, adjust=False).mean()

        fig = go.Figure()

        if chart_type == "Candlestick":
            fig.add_trace(go.Candlestick(x=data.index,
                                         open=data['Open'],
                                         high=data['High'],
                                         low=data['Low'],
                                         close=data['Close'], name='Candlestick'))
        else:
            fig.add_trace(go.Scatter(x=data.index, y=data['Close'], mode='lines', name='Close Price'))

        if "SMA 20" in indicators:
            fig.add_trace(go.Scatter(x=data.index, y=data['SMA_20'], mode='lines', name='SMA 20'))

        if "EMA 20" in indicators:
            fig.add_trace(go.Scatter(x=data.index, y=data['EMA_20'], mode='lines', name='EMA 20'))

        fig.update_layout(
            title=f'{ticker} Stock Price ({time_frame})',
            xaxis_title='Date',
            yaxis_title='Price (USD)',
            height=600,
            margin=dict(t=20, b=40, l=20, r=20),
            xaxis_rangeslider_visible=False,
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)'
        )

        st.plotly_chart(fig, use_container_width=True)

    except Exception as e:
        st.error(f"Failed to fetch data for {ticker}: {e}")
