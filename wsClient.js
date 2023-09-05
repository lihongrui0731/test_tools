const WebSocket = require('ws')
const process = require('node:process')

let args = process.argv.slice(2)
let cmd = '';
cmd = args[0]
console.log('cmd:', cmd)
// const wsUrl = 'ws://sh85bq.rhythm-tech.com:10000'
// const wsUrl = 'ws://10.0.0.57:6380'
const wsUrl = 'ws://127.0.0.1:8000'
let wsClient = null
const message = {
    jsonrpc: '2.0',
    method: 'deviceID',
    params: {
        deviceID: '123456789'
    }
}
const recordMsg = {
    jsonrpc: '2.0',
    method: 'soundcam.record',
}
const stopMsg = {
    jsonrpc: '2.0',
    method: 'stop'
}
let sendMessageInterval = ()=>{
    setInterval(sendMessage, 1000)
}

function connect() {
    wsClient = new WebSocket(wsUrl)
    wsClient.onopen = ()=>{
        console.log('connection opened!!!');
        if(!cmd) {
            console.debug('no arg')
            return
        }
        // setTimeout(() => sendMessage(cmd), 1000)
        // sendMessageInterval()
    }
    wsClient.onclose = ()=>{
        console.log('connection closed!!!');
        // clearInterval(sendMessage)
        // setTimeout(()=>{
        //     connect();
        // }, 2000)
    }
    wsClient.onmessage = (msg)=>{
        console.log('message received', msg)
    }
}
function sendMessage(cmd) {
    let msg;
    switch (cmd) {
        case 'record':
            msg = recordMsg;
            break
        case 'stop':
            msg = stopMsg;
            break
    }
    console.log(msg)
    wsClient.send(JSON.stringify(msg))
}

connect();
