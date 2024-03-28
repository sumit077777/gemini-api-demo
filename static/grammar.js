const chatOutput = document.getElementById('chat-output');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const voiceBtn = document.getElementById('voice-btn');
const startBtn=document.getElementById('start-btn');
const recognition = new webkitSpeechRecognition();
let voiceInputTimeout;

recognition.continuous = false;
recognition.interimResults = false;

submitBtn.addEventListener('click', () => {
  const userMessage = userInput.value;
  processUserMessage(userMessage);
});

startBtn.addEventListener('click', () => {
  const userMessage = userInput.value;
  processStartMessage(userMessage);
});

voiceBtn.addEventListener('click', () => {
  startSpeechRecognition();
});

recognition.onresult = (event) => {
  clearTimeout(voiceInputTimeout);
  const transcript = event.results[0][0].transcript;
  userInput.value = transcript;
  voiceInputTimeout = setTimeout(() => {
    if (transcript.trim() === '') {
      submitBtn.click();
    } else {
      processUserMessage(transcript);
    }
  }, 5000);
};

function startSpeechRecognition() {
  clearTimeout(voiceInputTimeout);
  recognition.start();
}

function processUserMessage(userMessage) {
  displayMessage(userMessage,'human');

  // Send user message to the server using Python Flask API
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then(response => response.json())
    .then(data => {
      const chatbotMessage = data.message;
      displayMessage(chatbotMessage,'bot');
      // Use Text-to-Speech API to convert chatbot message to voice
      speak(chatbotMessage);
    });

  userInput.value = '';
}

function processStartMessage(userMessage) {
  displayMessage("help me to improve my grammar",'human');

  // Send user message to the server using Python Flask API
  fetch('/api/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then(response => response.json())
    .then(data => {
      const chatbotMessage = data.message;
      displayMessage(chatbotMessage,'bot');
      // Use Text-to-Speech API to convert chatbot message to voice
      speak(chatbotMessage);
    });

  userInput.value = '';
}

function displayMessage(message, actor) {
  const messageContainer = document.createElement('div');
  messageContainer.style.display = 'flex';
  messageContainer.style.marginBottom = '10px';
  messageContainer.style.justifyContent = actor === 'bot' ? 'flex-start' : 'flex-end';

  const messageElement = document.createElement('div');
  messageElement.style.padding = '10px';
  messageElement.style.borderRadius = '20px';
  messageElement.innerText = message;

  if (actor === 'bot') {
    messageElement.style.backgroundColor = 'rgb(117, 16, 211)'; // Color for bot messages
    messageElement.style.color = '#FFF'; // Text color for bot messages
    messageElement.style.maxWidth = '70%'; // Limit the width of bot messages to 70% of the container
    messageElement.style.marginRight = '10px'; // Add margin between the bot message and user message
  } else {
    messageElement.style.backgroundColor = 'rgb(19, 22, 239)'; // Color for user messages
    messageElement.style.color = '#FFF'; // Text color for user messages
    messageElement.style.maxWidth = 'fit-content'; // Adjust width based on the content length
    messageElement.style.marginLeft = '10px'; // Add margin between the user message and bot message
  }

  messageContainer.appendChild(messageElement);
  chatOutput.appendChild(messageContainer);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}



function speak(message) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
   window.speechSynthesis.speak(speech);
}