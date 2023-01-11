const WebSocket = require('ws')
// const wsUrl = 'ws://sh85bq.rhythm-tech.com:10000'
const wsUrl = 'ws://localhost:8000'
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
        sendMessage()
        // sendMessageInterval()
        // wsClient.send(JSON.stringify(message))
        // wsClient.send(JSON.stringify({
        //     jsonrpc: '2.0',
        //     method: 'msgTest',
        //     params: {
        //         msg: 'message'
        //     }
        // }))
    }
    wsClient.onclose = ()=>{
        console.log('connection closed!!!');
        // clearInterval(sendMessage)
        setTimeout(()=>{
            connect();
        }, 500)
    }
    wsClient.onmessage = (msg)=>{
        console.log('message from edge received')
    }
}
function sendMessage() {
    console.log(message)
    wsClient.send(JSON.stringify(message))
}

connect();
