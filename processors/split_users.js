
exports.handler = function(event, context, callback) {
  console.log("GOT SPLIT USER EVENT", event)
  for(var iUser=0; iUser<event.users.length; ++iUser) {
    var user = event.users[iUser]
    context.emit('users', {user})
  }

  callback()
}