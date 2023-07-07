const moment = require('moment');

function formatMessage(username,text) {
   const admin = 'ChatBot';
   return {
      username,
      text,
      time:moment().format('h:mm a')
   };
}

module.exports =formatMessage;