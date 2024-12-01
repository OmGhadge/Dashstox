import streamlit as st
import praw
import re
from groq import Groq

reddit = praw.Reddit(
    client_id='uJnAa-hHe2xQ_70RCKBwkQ',
    client_secret='M75CMFrEiM5u6p-vjvJtVBC5rzoxrQ',
    user_agent="dashboard_sentiment_analysis /u/Om__g"
)

def fetch_recent_posts(subreddit_name, limit=5):
    subreddit = reddit.subreddit(subreddit_name)
    posts = subreddit.new(limit=limit)
    return [{"title": post.title, "url": post.url} for post in posts]

def fetch_daily_discussion_comments(subreddit_name, thread_title_keyword):
    subreddit = reddit.subreddit(subreddit_name)
    threads = subreddit.search(thread_title_keyword, limit=1, sort='new')
    comments = []
    for thread in threads:
        comments.extend([comment.body for comment in thread.comments if isinstance(comment, praw.models.Comment)])
    return comments

def preprocess_comments(comments):
    cleaned_comments = []
    for comment in comments:
        comment = re.sub(r'http\S+', '', comment)
        comment = re.sub(r'[^A-Za-z0-9\s]+', '', comment).strip()
        cleaned_comments.append(comment)
    return cleaned_comments

def display_reddit_posts():
    st.header("Recent Posts from 'stocks' Subreddit")
    try:
        recent_posts = fetch_recent_posts("stocks", limit=5)
        for post in recent_posts:
            st.markdown(f"- [{post['title']}]({post['url']})")
    except Exception as e:
        st.error(f"Failed to fetch recent posts: {e}")

def summarize_with_groq(text):
    client = Groq(api_key="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")
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": f"Summarize: {text}"}],
        model="llama3-8b-8192"
    )
    return response.choices[0].message.content

def display_daily_discussion_summary():
    st.subheader("Daily Discussion Summary")
    try:
        comments = fetch_daily_discussion_comments("stocks", "Daily Discussion")
        cleaned_comments = preprocess_comments(comments)
        input_text = " ".join(cleaned_comments[:500])
        summary = summarize_with_groq(input_text)
        st.write(summary)
    except Exception as e:
        st.error(f"Failed to fetch or summarize Reddit data: {e}")
