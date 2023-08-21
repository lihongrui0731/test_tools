const {io} = require("./socket.io");

const Socket = io('169.254.123.51')
Socket.on('connect', ()=> {
  console.log(Socket.id)
  console.log('connected')
})
