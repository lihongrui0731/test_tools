const fsp = require('fs/promises')
let XLSX = require("xlsx");
let NodeXlsx = require('node-xlsx')
const {data} = require("wavefile/src/wave-errors");

const filePath = 'excel/VibData-all-v2022.xlsx';
let excelContent;
async function readExcel() {
	let content = NodeXlsx.parse(filePath);
	excelContent = content
	return content[0]
}
async function writeExcel() {
	let dataToAppend = []
	for (let i=0; i<excelContent[0].data[0].length; i++) {
		if(i === 0) {
			dataToAppend[i] = `test-file-${i}`;
			continue
		}
		if(i === 1) {
			dataToAppend[i] = 'normal';
			continue
		}
		dataToAppend[i] = 1
	}
	excelContent[0].data.push(dataToAppend);
	let bufferToWrite = NodeXlsx.build(excelContent);
	await fsp.writeFile(filePath, bufferToWrite, async (err) => {
		if (err) {
			console.log('err>>>>', err);
			return
		} else {
			console.log('completed')
			let editedContent = await readExcel()
			console.log('write completed!', editedContent.data.length)
		}
	})
}

async function main() {
  let content	= await readExcel()
	console.log('original length', content.data.length)
	await writeExcel()
}

main()
