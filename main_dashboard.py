import streamlit as st
from charts import display_charts
from reddit_integration import fetch_daily_discussion_comments, fetch_recent_posts, preprocess_comments, summarize_with_groq, display_reddit_posts, display_daily_discussion_summary
from groq_chat import display_chat_with_groq
from newss import fetch_financial_news
import yfinance as yf

reddit_client_id = 'uJnAa-hHe2xQ_70RCKBwkQ'
reddit_client_secret = 'M75CMFrEiM5u6p-vjvJtVBC5rzoxrQ'
reddit_user_agent = "dashboard_sentiment_analysis /u/Om__g"
groq_api_key = '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'

def main():
    st.set_page_config(layout="wide", page_title="Dashstox", page_icon="📊")
    st.markdown("<h1 style='text-align: center; font-size: 48px; color: #1e90ff;'>Dashstox</h1>", unsafe_allow_html=True)
    st.markdown("<h4 style='text-align: center; color: #888;'>Your personalized stock dashboard</h4>", unsafe_allow_html=True)
    st.markdown("---")

    popular_tickers = ["AAPL", "GOOGL", "AMZN", "MSFT"]
    kpi_columns = st.columns(len(popular_tickers))
    for i, symbol in enumerate(popular_tickers):
        with kpi_columns[i]:
            try:
                stock_data = yf.Ticker(symbol).history(period="1d", interval="1m")
                if not stock_data.empty:
                    last_price = stock_data["Close"].iloc[-1]
                    change = last_price - stock_data["Open"].iloc[0]
                    pct_change = (change / stock_data["Open"].iloc[0]) * 100
                    st.metric(f"{symbol}", f"${last_price:.2f}", f"{change:+.2f} ({pct_change:+.2f}%)")
            except Exception:
                st.warning(f"Could not fetch data for {symbol}")

    st.markdown("---")

    st.sidebar.header("Dashboard Settings")
    st.sidebar.markdown("<p style='font-size: 14px;'>Customize your dashboard below</p>", unsafe_allow_html=True)
    selected_tickers = st.sidebar.text_input("Enter Stock Tickers (comma-separated)", "MSFT,AAPL")
    time_frame = st.sidebar.selectbox("Select Time Frame", ['1d', '5d', '1mo', '3mo', '1y'])
    chart_type = st.sidebar.radio("Select Chart Type", ["Candlestick", "Line"], index=0)
    indicators = st.sidebar.multiselect("Add Technical Indicators", ["SMA 20", "EMA 20"])

    tabs = st.tabs(["📈 Charts", "📢 Reddit", "🤖 Chat Assistant", "📰 News"])

    with tabs[0]:
        st.header("📈 Charts Dashboard", anchor="charts")
        try:
            display_charts(selected_tickers, time_frame, chart_type, indicators)
        except Exception as e:
            st.error(f"An error occurred while displaying charts: {e}")

    with tabs[1]:
        st.header("📢 Reddit Daily Discussion Summary", anchor="reddit")
        subreddit_name = "stocks"
        thread_title_keyword = "Daily Discussion"
        try:
            comments = fetch_daily_discussion_comments(subreddit_name, thread_title_keyword)
            cleaned_comments = preprocess_comments(comments)
            summary = summarize_with_groq(" ".join(cleaned_comments))
            st.subheader("Summary of Daily Discussion:")
            st.write(summary)
            st.subheader("Recent Posts:")
            display_reddit_posts()
        except Exception as e:
            st.error(f"Failed to fetch or summarize Reddit data: {e}")

    with tabs[2]:
        st.header("🤖 Chat with Groq", anchor="chat")
        try:
            display_chat_with_groq()
        except Exception as e:
            st.error(f"Failed to load Chat Assistant: {e}")

    with tabs[3]:
        st.header("📰 Latest Financial News", anchor="news")
        api_key = "abf097a705a449de8de30649adc71f6a"
        try:
            news_articles = fetch_financial_news(api_key)
            if news_articles:
                for article in news_articles:
                    st.markdown(f"### {article['title']}")
                    st.markdown(f"**Source:** {article['source']['name']}")
                    st.write(article.get("description", "No description available."))
                    st.markdown(f"[Read more]({article['url']})")
                    st.markdown("---")
            else:
                st.write("No news articles available at the moment.")
        except Exception as e:
            st.error(f"Failed to fetch financial news: {e}")

if __name__ == "__main__":
    main()
