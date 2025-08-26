const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const themeToggle = document.getElementById('themeToggle');
const startBtn = document.getElementById('startBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const timerDisplay = document.getElementById('chatTimer');
const typingIndicator = document.getElementById('typingIndicator');

let socket = null;
let chatStartTime = null;
let timerInterval = null;

// 🔔 Sound notification
const notificationSound = new Audio('https://www.soundjay.com/button/beep-07.wav');

// 😀 Emoji map
const emojiMap = {
  ':)': '😊',
  ':(': '😢',
  '<3': '❤️',
  ':D': '😄',
  ';)': '😉'
};

function parseEmojis(text) {
  for (const [key, emoji] of Object.entries(emojiMap)) {
    text = text.split(key).join(emoji);
  }
  return text;
}

// 🧍 Avatar generator
function getAvatar(sender) {
  return sender === 'you' ? '🧑' : sender === 'stranger' ? '👽' : '⚙️';
}

// 🕓 Timestamp generator
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// 💬 Add message bubble
function addMessage(text, sender) {
  const msgElem = document.createElement('div');
  msgElem.classList.add('message', sender);
  msgElem.innerHTML = `
    <span class='avatar'>${getAvatar(sender)}</span>
    <span class='text'>${parseEmojis(text)}</span>
    <span class='timestamp'>${getTimestamp()}</span>
  `;
  msgElem.style.animation = 'fadeIn 0.3s ease-in';
  messagesDiv.appendChild(msgElem);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  if (sender === 'stranger') {
    notificationSound.play();
  }
}

// ✍️ Typing indicator logic
input.addEventListener('input', () => {
  typingIndicator.classList.remove('hidden');
  clearTimeout(typingIndicator.timeout);
  typingIndicator.timeout = setTimeout(() => {
    typingIndicator.classList.add('hidden');
  }, 1000);
});

// 🕒 Chat timer functions
function startTimer() {
  chatStartTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - chatStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timerDisplay.textContent = `Chat Duration: ${minutes}m ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerDisplay.textContent = 'Chat Duration: 0m 0s';
}

// 🌙 Dark mode toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// 🚀 Start chat
startBtn.addEventListener('click', () => {
  addMessage('Chat started!', 'system');
  startTimer();
});

// ❌ Disconnect chat
disconnectBtn.addEventListener('click', () => {
  addMessage('Chat disconnected.', 'system');
  stopTimer();
});

// 📤 Send message
sendBtn.addEventListener('click', () => {
  const msg = input.value.trim();
  if (msg) {
    addMessage(msg, 'you');
    input.value = '';

    // Simulate stranger reply
    setTimeout(() => {
      addMessage("Stranger: " + parseEmojis(msg.split('').reverse().join('')), 'stranger');
    }, 1000);
  }
});