const fs = require('fs')
const fsp = require('fs/promises')
const baseDir = '/Users/lihongrui/Public/data/'

async function checkDir() {
    let testDir = baseDir + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate() + new Date().getHours()
    await fsp.readdir(testDir, {}).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
        fsp.mkdir(testDir, {recursive: true}).then(res => {
            if (!res) console.log(testDir, 'created')
        })
    })
}

checkDir()
