const Jimp = require('jimp');
const fsp = require('fs/promises')

async function convert(sourceType, targetType) {
    let workDir = 'Images/'
    let sourceExt = sourceType.startsWith('.')? sourceType : `.${sourceType}`
    let targetExt = targetType.startsWith('.')? targetType : `.${targetType}`
    let filesList = await fsp.readdir(workDir, {encoding: 'utf8', withFileTypes: true})
    filesList = filesList.map(file => file.name)
    console.log(filesList)
    for (let i=0; i<filesList.length; i++) {
        Jimp.read(workDir + filesList[i], (err, image) => {
            if(err) {
                console.log(err)
            } else {
                image.write((workDir+filesList[i]).replace(sourceExt, targetExt))
            }
        })
    }
}

module.exports = {convert}
