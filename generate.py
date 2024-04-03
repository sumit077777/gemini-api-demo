import re
import pathlib
import textwrap
from generate import *
import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown
# Used to securely store your API key
# Or use `os.getenv('GOOGLE_API_KEY')` to fetch an environment variable.
GOOGLE_API_KEY="AIzaSyCpsmsXzTBHxGmoi7xs08huFphgnccROg8"

genai.configure(api_key=GOOGLE_API_KEY)

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

def generate_text(Question):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(Question)
    return(response.text)