const socket = io('/');
const messageInput = document.getElementById('input');
const messagesContainer = document.getElementById('messages');
const user = sessionStorage.getItem('user');
const alterUser = sessionStorage.getItem('alterUser');
const title = document.getElementById('title').innerText = 'Welcome ' + user + '!';
const roomId = window.location.href.split('/').pop();


socket.emit('joinRoom', { roomId, user });


socket.on('userJoined', (data) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = `${data.user} has joined the room`;
    messagesContainer.appendChild(notification);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});


document.getElementById('trigger').addEventListener('click', () => {
    const msg = messageInput.value;
    messageInput.value = '';
    const timestamp = new Date().toLocaleTimeString();
    socket.emit('sendNewMessage', {
        user: user,
        message: msg,
        room: roomId,
        timestamp: timestamp
    });
});


socket.on('messageReceived', (data) => {
    const messageBubble = document.createElement('div');
    messageBubble.className = data.user === user ? 'message my-message' : 'message other-message';
    messageBubble.innerHTML = `<strong>${data.user}</strong> at ${data.timestamp}:<br>${data.message}`;
    messagesContainer.appendChild(messageBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});


socket.on('userLeft', (data) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = `${data.user} left the room`;
    messagesContainer.appendChild(notification);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});


window.addEventListener('beforeunload', () => {
    socket.emit('leaveRoom', { roomId, user });
});
