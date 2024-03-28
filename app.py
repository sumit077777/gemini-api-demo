from flask import Flask, render_template, jsonify, request
from database import sign_in, add_user
import openai
import re

openai.api_key = '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'
app = Flask(__name__)


def gpt(text, conversation_history=[]):
  messages = [{"role": "system", "content": "chatting"}]

  # Append the conversation history to the messages
  messages.extend(conversation_history)

  message = text
  if message:
    messages.append({"role": "user", "content": message})

  chat = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)

  reply = chat.choices[0].message.content
  content = {"you said": text, "reply": reply}

  # Append the user's message and the chatbot's reply to the conversation history
  conversation_history.append({"role": "user", "content": text})
  conversation_history.append({"role": "assistant", "content": reply})

  return reply, conversation_history


def extract_code_snippets(response_text):
  code_pattern = r'```.*?```'
  code_snippets = re.findall(code_pattern, response_text, re.DOTALL)
  return code_snippets


@app.route("/home")
def home_page():
  return render_template('home.html')


@app.route("/grammar", methods=['POST', 'GET'])
def grammar_page():
  return render_template("grammar.html")


@app.route("/code")
def code_page():
  return render_template("codexplainer.html")


@app.route("/debug")
def debug_page():
  return render_template("debug.html")


@app.route('/code-debug', methods=['POST', 'GET'])
def debug():
  user_message = request.json['code']
  debugged_code = gpt(
    "find the errors in this code ,make the corrections and put the corrected code inside ``` ``` do not include other thing than code inside these seperators :"
    + user_message)
  print(type(debugged_code))

  return jsonify({'debugged': debugged_code})


@app.route('/api/chat', methods=['POST', 'GET'])
def chat():
  user_message = request.json['message']
  print(user_message)
  chatbot_response = gpt("answert the Following Question" + user_message)
  return jsonify({'message': chatbot_response})


@app.route('/api/start', methods=['POST', 'GET'])
def start():
  chatbot_response = gpt(
    "lets have a conversation and remember we are having voice chat so  Do not check capitalization, commas, punctuation, etc. focus on  checking the grammar   within 40 words, and do not forget to ask me the follow-up question in the end."
  )
  return jsonify({'message': chatbot_response})


@app.route('/explain-program', methods=['POST'])
def explain_program():
  program_code = request.json['code']
  explanation = gpt("please explain this code step by step :" + program_code)
  return jsonify({'explanation': explanation})


@app.route('/services', methods=['POST', 'GET'])
def services_page():
  return render_template("services.html")


@app.route('/faq', methods=['POST', 'GET'])
def faq_page():
  return render_template("faq.html")


@app.route('/contact', methods=['GET', 'POST'])
def contact_page():
  return render_template("contact.html")


@app.route('/about-us', methods=['GET', 'POST'])
def about_page():
  return render_template("about.html")


@app.route('/')
def login_page():
  return render_template('sign.html')


@app.route('/signup', methods=['POST'])
def signup_page():
  data = request.form
  if (add_user(data)):
    return render_template('sign.html')
  else:
    s = "user_name or email already exist"
    return render_template('sign.html', s=s)


@app.route('/authenticate', methods=['POST'])
def authenticate():
  data = request.form
  print(data)
  if (sign_in(data)):
    return render_template('home.html')
  else:
    s = "invalid username or password"
    return render_template('sign.html', s=s)


if __name__ == "__main__":
  app.run(host='0.0.0.0', debug=True)
