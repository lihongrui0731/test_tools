const fs = require('fs')
const fsp = require('fs').promises
const assimpjs = require('assimpjs')()


module.exports = {
    async convert(workDir, targetDir, source, target) {
        let sourceExt = '';
        let targetExt = '';
        if (source) sourceExt = `.${source}`
        if (target) targetExt = `.${target}`
        workDir = workDir.endsWith('/')? workDir : workDir + '/';
        await this.checkDir(targetDir)
        let fileList = await fsp.readdir(workDir, {encoding: 'utf8', withFileTypes: true})
        let files = fileList.map(file => file.name)
        fileList = null
        assimpjs.then(async (ajs) => {
            for (let i = 0; i < files.length; i++) {
                if (files[i].endsWith(sourceExt)) {
                    let filePath = workDir + files[i];
                    let resultFile = ajs.ConvertFile(
                        files[i],
                        target,
                        fs.readFileSync(filePath),
                        (fileName) => {
                            console.log(fileName)
                        },
                        (fileName) => {
                            console.log(fileName)
                        }
                    )
                    console.log(resultFile.GetFile(0).GetPath())
                    let glbContent = resultFile.GetFile(0).GetContent()
                    await fsp.writeFile(targetDir + files[i].replace(sourceExt, targetExt), glbContent, {flag: 'w+'})
                }
            }
        })
    },

    async checkDir(dirPath) { // return boolean, create dir if not exist
        await fsp.readdir(dirPath, {}).then(res => {
            if (res) console.log('onCheckDir', res.length, 'files')
            // if(res && res.length > 0) {
            //   fsp.mkdir(dirPath, {recursive: true}).then(res => {
            //     if (!res) console.log(dirPath, 'created')
            //   })
            // }
        }).catch(async err => {
            console.log('onCheckDir', err)
            await fsp.mkdir(dirPath, {recursive: true}).then(res => {
                if (!res) console.log(dirPath, 'created')
            })
        })
    }
}
