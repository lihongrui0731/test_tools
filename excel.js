const fsp = require('fs/promises')
let NodeXlsx = require('node-xlsx')

const rawDataDir = 'D:/temp/results/'
const xlsxPath = 'excel/VibData-all-v2023.xlsx';
let excelContent;
let headers = [];
let datasetToAppend = []
const average = (arr) => arr.reduce((acc, val) => acc + val, 0) / arr.length

async function generateData() {
	let dirs = await fsp.readdir(rawDataDir);
	const evFileName = 'ev-sp-full.json';
	// headers = excelContent[0].data[0]
	headers.push(...['RunName', 'Status'])
	// console.log('headers:', headers, 'headers length:', headers.length)
	for (let i = 0; i < dirs.length; i++) {
		let evFilePath = rawDataDir + dirs[i] + '/' + evFileName;
		let evContent = await fsp.readFile(evFilePath, {encoding: 'utf-8'})
		let evObj = JSON.parse(evContent)
		let evValues = evObj.data.values
		if(!evValues) continue
		let valuesName = Object.keys(evValues)
		if(i === 0) headers.push(...valuesName)
		for (let value_idx=0; value_idx<evObj.data.frameCount; value_idx++) {
			let recordToAppend = [dirs[i]] // without `Status`
			for (let name_idx=0; name_idx<valuesName.length; name_idx++) {
				recordToAppend.push(evValues[valuesName[name_idx]][value_idx])
			}
			datasetToAppend.push(recordToAppend)
		}
	}
	console.log(datasetToAppend.length)
	for (let i = 0; i<datasetToAppend.length; i++) {
		if(datasetToAppend[i][0].startsWith('2020')) {
			datasetToAppend[i].splice(1, 0, 'fault');
			continue
		}
		datasetToAppend[i].splice(1, 0, 'normal')
	}
}

async function readExcel() {
	let content = NodeXlsx.parse(xlsxPath);
	excelContent = content
	return content[0]
}

async function writeExcel() {
	datasetToAppend.unshift(headers)
	let contentToWrite = []
	contentToWrite.push({
		name: 'Sheet1',
		data: datasetToAppend
	})
	let bufferToWrite = NodeXlsx.build(contentToWrite);
	await fsp.writeFile(xlsxPath, bufferToWrite).then(async (res) => {
		if (!res) {
			console.log('completed')
			let editedContent = await readExcel()
			console.log('write completed!', editedContent.data.length)
			return
		} else {
			console.log('res>>>>', res);
			console.log('none')
		}
	})
}

async function main() {
	let content = await readExcel()
	await generateData()
	// console.log('original length', content.data.length)
	await writeExcel()
}

main()
