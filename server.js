const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const { userJoin,getCurrentUser,userLeave,getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// setting static folder
app.use(express.static(path.join(__dirname,'public')));

const admin = 'ChatBot';

// when user connects
io.on('connection', socket => {
   socket.on('joinRoom', ({username,room}) => {
      const user =userJoin(socket.id,username,room);

      socket.join(user.room);

      //welcome message for new user
      socket.emit('message',formatMessage(admin,'Welcome to Real Time Chat'));

      //tell other users when someone connects
      socket.broadcast.to(user.room).emit('message',formatMessage(admin,`${user.username} has joined the chat`));

      //users and room info
      io.to(user.room).emit('roomUsers', {
         room : user.room,
         users :getRoomUsers(user.room)
      });

   });

   //listen for chat message
   socket.on('chatMessage', msg => {
      const user=getCurrentUser(socket.id);

      io.to(user.room).emit('userMessage',formatMessage(user.username,msg));
   });

   //when user disconnects
   socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if(user) {
         io.to(user.room).emit('message',formatMessage(admin,`${user.username} has left the chat`));
      }

      io.to(user.room).emit('roomUsers', {
         room : user.room,
         users :getRoomUsers(user.room)
      });
   });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));