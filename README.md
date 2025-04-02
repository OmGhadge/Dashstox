# Dashstox - Stock Dashboard Project

## Note to HackFrost Reviewers

This project originally aimed to include advanced functionalities such as **workflow automation using Kestra** and **database integration with AWS RDS**. However, due to time constraints and challenges during implementation, the following adjustments were made: 

1. **Kestra Integration**:  
   We attempted to integrate Kestra to automate workflows, such as fetching stock data from Yahoo Finance, storing it in a PostgreSQL RDS instance, and triggering subsequent tasks. While the YAML flow configuration was created, we could not successfully execute it due to unresolved configuration and environment issues.

2. **Database Connectivity**:  
   While a script to store data into AWS RDS was developed and tested locally, the integration was not fully implemented into the workflow. As a result, the project currently runs without a connected database.

3. **Current Functionality**:  
   The dashboard leverages APIs and local data processing to provide insights. The stock data is fetched from Yahoo Finance directly during runtime, while other modules like Reddit integration and AI-powered stock analysis operate seamlessly. 

 Future enhancements could include revisiting these integrations to fully realize the project's potential.


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

---

## Setup Instructions

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/OmGhadge/Dashstox.git
cd Dashstox
```

---

### 2. Set Up a Virtual Environment

To keep dependencies isolated, it's recommended to use a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

- On **Windows**:
  ```bash
  venv\Scripts\activate
  ```

- On **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

---

### 3. Install Dependencies

Install the required Python libraries using `pip`:

```bash
pip install -r requirements.txt
```

---

### 4. Set Up API Keys

To fetch data and interact with APIs, you'll need the following API keys:

#### a. **Yahoo Finance API (yfinance)**

- The Yahoo Finance data can be fetched without an API key. The required `yfinance` package is already included in `requirements.txt`.

#### b. **Reddit API**

- Create a Reddit app to get the **Client ID**, **Secret**, and **User Agent**:
  1. Go to [Reddit Apps](https://www.reddit.com/prefs/apps).
  2. Create a new developer application.
  3. Note down the **Client ID**, **Client Secret**, and **User Agent**.

- Set these as environment variables:

  - `REDDIT_CLIENT_ID`
  - `REDDIT_SECRET`
  - `REDDIT_USER_AGENT`

  **Example (Windows):**
  ```bash
  set REDDIT_CLIENT_ID="your_client_id"
  set REDDIT_SECRET="your_client_secret"
  set REDDIT_USER_AGENT="your_user_agent"
  ```

  **Example (macOS/Linux):**
  ```bash
  export REDDIT_CLIENT_ID="your_client_id"
  export REDDIT_SECRET="your_client_secret"
  export REDDIT_USER_AGENT="your_user_agent"
  ```

#### c. **Groq API**

- Obtain an API key from [Groq](https://www.groq.com/) for use in `groq_chat.py`.

- Set it as an environment variable:

  **Example (macOS/Linux):**
  ```bash
  export GROQ_API_KEY="your_groq_api_key"
  ```

  **Example (Windows):**
  ```bash
  set GROQ_API_KEY="your_groq_api_key"
  ```

---

### 5. Running the Project

Once the setup is complete, you can run the dashboard using Streamlit:

```bash
streamlit run main_dashboard.py
```

This will open up a local web server at [http://localhost:8501](http://localhost:8501), where you can view your stock dashboard.

