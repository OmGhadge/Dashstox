import streamlit as st
from groq import Groq

groq_client = Groq(api_key="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")

def display_chat_with_groq():
    st.header("Chat with Groq")
    user_input = st.text_input("Ask the AI assistant:", placeholder="Type your question here...")
    if st.button("Get Response"):
        if user_input.strip() == "":
            st.warning("Please enter a message to get a response.")
        else:
            with st.spinner("Generating response..."):
                try:
                    response = groq_client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": "You are a helpful assistant."},
                            {"role": "user", "content": user_input},
                        ],
                        model="llama3-8b-8192",
                        temperature=0.7,
                        max_tokens=256
                    ).choices[0].message.content
                    st.success("Response:")
                    st.write(response)
                except Exception as e:
                    st.error(f"An error occurred: {e}")
