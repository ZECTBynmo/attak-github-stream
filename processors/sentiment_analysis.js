var sentiment = require('sentiment')

exports.handler = function(event, context, callback) {
  console.log("GOT EVENT", event.type)
  // context.emit('reversed', event.text.split('').reverse().join(''));
  callback()
}