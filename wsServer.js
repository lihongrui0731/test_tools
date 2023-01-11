const WebSocketServer = require('ws').WebSocketServer

const wss = new WebSocketServer({ port: 8000 });
wss.on('connection', (ws) => {
    console.log('websocket open')
})
wss.on('closed', () => {
    console.log('websocket closed')
})
wss.on('message', (msg) => {
    console.log(msg)
    let data = typeof msg === 'string'? JSON.parse(msg) : msg;

    if(data.method === 'deviceID') {
        console.log(data)
    }
})
