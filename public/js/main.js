const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// getting username and room from URL
const {username,room} = Qs.parse(location.search,{
   ignoreQueryPrefix: true
});

const socket = io();

//join chatroom
socket.emit('joinRoom',{username, room})

console.log(username,room);

//get room and users
socket.on('roomUsers',({room,users}) => {
   OutputRoomName(room);
   OutputUsers(users);
});

//message from server
socket.on('message',message => {
   // console.log(message);
   outputMessage(message);

   //scroll down
   chatMessages.scrollTop =chatMessages.scrollHeight;
});

socket.on('userMessage',message => {
   // console.log(message);
   outputUserMessage(message);

   //scroll down
   chatMessages.scrollTop =chatMessages.scrollHeight;
});

//chat submit
chatForm.addEventListener('submit', e => {
   e.preventDefault();
   //getting text message
   const msg = e.target.elements.msg.value;
   //emmiting message to server
   socket.emit('chatMessage',msg);
   //clear input
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
   const div =document.createElement('div');
   div.classList.add('bot-message');
   div.innerHTML= `<p class="text">
      ${message.text}
   </p>`;
   document.querySelector('.chat-messages').appendChild(div);
}

function outputUserMessage(message) {
   const div =document.createElement('div');
   div.classList.add('message');

   if(message.username===username) {
      div.classList.add('my-message');
   }

   div.innerHTML= `<p class="meta">${message.username} <span>${message.time}</span></p>
   <p class="text">
      ${message.text}
   </p>`;
   document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function OutputRoomName(room) {
   roomName.innerText=room;
}

//Add users to DOM
function OutputUsers(users) {
   userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}