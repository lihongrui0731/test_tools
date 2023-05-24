const WebSocket = require('ws')
// const wsUrl = 'ws://sh85bq.rhythm-tech.com:10000'
const wsUrl = 'ws://192.168.1.114:6380'
let wsClient = null
const message = {
    jsonrpc: '2.0',
    method: 'deviceID',
    params: {
        deviceID: '123456789'
    }
}
let sendMessageInterval = ()=>{
    setInterval(sendMessage, 1000)
}

function connect() {
    wsClient = new WebSocket(wsUrl)
    wsClient.onopen = ()=>{
        console.log('connection opened!!!');
        // sendMessage()
        // sendMessageInterval()
    }
    wsClient.onclose = ()=>{
        console.log('connection closed!!!');
        // clearInterval(sendMessage)
        setTimeout(()=>{
            connect();
        }, 500)
    }
    wsClient.onmessage = (msg)=>{
        console.log('message received', msg)
    }
}
function sendMessage() {
    console.log(message)
    wsClient.send(JSON.stringify(message))
}

connect();
