const moment = require('moment')
const fsp = require('fs/promises')

let momentStr = moment(Date.now()).format() + '\n'
fsp.appendFile('./time.txt', momentStr)
