// Простой чат Forsic
let currentUser = null;
let chats = [];

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем сохраненного пользователя
    const savedUser = localStorage.getItem('forsic_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showChats();
    } else {
        showLogin();
    }
});

// Показать окно входа
function showLogin() {
    document.body.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <h1><i class="fas fa-comment-dots"></i> Forsic</h1>
                <p>Современный мессенджер</p>
                <div class="input-group">
                    <input type="text" id="loginName" placeholder="Ваше имя">
                </div>
                <div class="input-group">
                    <input type="text" id="loginPhone" placeholder="Номер телефона">
                </div>
                <button class="btn" onclick="login()">Войти в Forsic</button>
                <p class="small">Нажимая "Войти", вы принимаете условия</p>
            </div>
        </div>
        <style>
            .login-container { display: flex; align-items: center; justify-content: center; height: 100vh; background: #0d1117; }
            .login-box { background: #161b22; padding: 40px; border-radius: 12px; width: 350px; text-align: center; }
            .login-box h1 { color: #0088cc; margin-bottom: 10px; }
            .input-group { margin: 15px 0; }
            input { width: 100%; padding: 12px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: white; }
            .btn { width: 100%; padding: 12px; background: #0088cc; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
            .small { font-size: 12px; color: #8b949e; margin-top: 15px; }
        </style>
    `;
}

// Вход в систему
function login() {
    const name = document.getElementById('loginName').value;
    const phone = document.getElementById('loginPhone').value;
    
    if (!name || !phone) {
        alert('Заполните все поля!');
        return;
    }
    
    currentUser = {
        id: Date.now(),
        name: name,
        phone: phone,
        online: true
    };
    
    localStorage.setItem('forsic_user', JSON.stringify(currentUser));
    
    // Показываем чаты
    showChats();
}

// Показать список чатов
function showChats() {
    // Демо-чаты
    chats = [
        {
            id: 1,
            name: "Алексей Иванов",
            lastMessage: "Привет! Как дела?",
            time: "12:30",
            online: true
        },
        {
            id: 2,
            name: "Мария Петрова",
            lastMessage: "Жду тебя завтра",
            time: "10:15",
            online: true
        },
        {
            id: 3,
            name: "Иван Сидоров",
            lastMessage: "Отправьте документы",
            time: "09:45",
            online: false
        }
    ];
    
    document.body.innerHTML = `
        <div class="chat-container">
            <div class="sidebar">
                <div class="sidebar-header">
                    <div class="logo">
                        <i class="fas fa-comment-dots"></i>
                        <h2>Forsic</h2>
                    </div>
                    <p>${currentUser.name}</p>
                </div>
                <div class="search-box">
                    <input type="text" placeholder="Поиск чатов">
                </div>
                <div class="chats-list">
                    ${chats.map(chat => `
                        <div class="chat-item" onclick="openChat(${chat.id})">
                            <div class="chat-avatar">${chat.name.charAt(0)}</div>
                            <div>
                                <h4>${chat.name} ${chat.online ? '🟢' : '⚫'}</h4>
                                <p>${chat.lastMessage}</p>
                                <small>${chat.time}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="chat-main">
                <div class="chat-header">
                    <div class="chat-avatar">?</div>
                    <div>
                        <h3>Выберите чат</h3>
                        <p>Начните общение</p>
                    </div>
                </div>
                <div class="messages" id="messages">
                    <div style="text-align: center; padding: 50px; color: #8b949e;">
                        <i class="fas fa-comments" style="font-size: 60px; margin-bottom: 20px;"></i>
                        <h3>Добро пожаловать в Forsic</h3>
                        <p>Выберите чат из списка слева</p>
                    </div>
                </div>
                <div class="message-input">
                    <input type="text" id="messageInput" placeholder="Введите сообщение..." disabled>
                    <button class="send-btn" onclick="sendMessage()" disabled>Отправить</button>
                </div>
            </div>
        </div>
    `;
}

// Открыть чат
function openChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    document.querySelector('.chat-header').innerHTML = `
        <div class="chat-avatar">${chat.name.charAt(0)}</div>
        <div>
            <h3>${chat.name}</h3>
            <p>${chat.online ? 'онлайн' : 'был(а) недавно'}</p>
        </div>
    `;
    
    // Включаем поле ввода
    document.getElementById('messageInput').disabled = false;
    document.querySelector('.send-btn').disabled = false;
    
    // Загружаем сообщения
    loadMessages(chatId);
}

// Отправить сообщение
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-outgoing';
    messageDiv.innerHTML = `
        <strong>Вы</strong><br>
        ${text}<br>
        <small>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
    `;
    
    messagesDiv.appendChild(messageDiv);
    input.value = '';
    
    // Прокрутка вниз
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Имитация ответа
    setTimeout(() => {
        const replies = ['Привет!', 'Как дела?', 'Интересно', 'Согласен', 'Спасибо!'];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        
        const replyDiv = document.createElement('div');
        replyDiv.className = 'message message-incoming';
        replyDiv.innerHTML = `
            <strong>Собеседник</strong><br>
            ${reply}<br>
            <small>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
        `;
        
        messagesDiv.appendChild(replyDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 1000);
}

// Загрузить сообщения
function loadMessages(chatId) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    
    // Демо-сообщения
    const demoMessages = [
        { sender: 'other', text: 'Привет! Как дела?', time: '12:30' },
        { sender: 'me', text: 'Привет! Хорошо, а у тебя?', time: '12:31' },
        { sender: 'other', text: 'Тоже отлично! Что нового?', time: '12:32' }
    ];
    
    demoMessages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message message-${msg.sender === 'me' ? 'outgoing' : 'incoming'}`;
        div.innerHTML = `
            <strong>${msg.sender === 'me' ? 'Вы' : 'Собеседник'}</strong><br>
            ${msg.text}<br>
            <small>${msg.time}</small>
        `;
        messagesDiv.appendChild(div);
    });
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}