const {make, RGB} = require('binary-bmp');
const fsp = require('fs/promises')

const targetFile = 'image.bmp'
const blockStep = 4;
const width = 100;
const height = 100;
const rows = (height / blockStep)
const columns = (width / blockStep)

/**
 * @param {String} filePath
 * @returns {Promise} colors array
 * */
async function generateData(filePath) {
  let rawContent = await fsp.readFile(filePath, {encoding: 'utf-8'})
  let content;
  content = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent //[[x, y, power], [x, y, power], ...]
  let dataset = []
  let colors = []
  for (let i = 0; i < content.length; i++) {
    if (content[i][0] === null || content[i][1] === null || content[i][2] === null) continue
    let color = calcColor(content[i][2], 0, 120)
    colors.push([color.r, color.g, color.b])
  }
  for (let y = 0; y < rows; y++) {
    let row = []
    for (let x = 0; x < columns; x++) {
      for (let i = 0; i < blockStep; i++) {
        row.push(...colors[x])
      }
    }
    for (let i = 0; i < blockStep; i++) {
      dataset.push(...row)
    }
  }
  return dataset
}

/**
 * get BMP
 * @param {array} dataset
 * @returns {ArrayBuffer} BMP content in ArrayBuffer
 */
function getBMP(dataset) {
  let uint8array;
  uint8array = make({
    bits: RGB,
    width: width,
    height: height,
    data: dataset
  })
  
  return uint8array
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {object} color value
 * */
function calcColor(value, min, max) {
  if (value < min)
    value = min;
  else if (value > max)
    value = max;
  const dv = max - min;
  const c = {r: 0, g: 0, b: 0};
  const v = (value - min) / dv;
  const _8th = 0.125;
  
  if (v < _8th) {
    c.b = 128 * (1 + v / _8th);
  } else if (v < 3 * _8th) {
    c.b = 255;
    c.g = 128 * (v - _8th) / _8th;
  } else if (v < 5 * _8th) {
    c.r = 128 * (v - 3 * _8th) / _8th;
    c.g = 255;
    c.b = 128 * (5 * _8th - v) / _8th;
  } else if (v < 7 * _8th) {
    c.r = 255;
    c.g = 128 * (7 * _8th - v) / _8th;
  } else {
    c.r = 128 * (9 * _8th - v) / _8th;
  }
  return c;
}
/**
 * @returns {Promise} fulfill with true if image file has been made
 * */
async function run() {
  let data = await generateData('sum-grid-values.json')
  // for (let i=0; i<data.length; i++) {
  //   if(i<40) console.log(data[i])
  // }
  let bmp = getBMP(data)
  let fileWritten = await fsp.writeFile(targetFile, new Uint8Array(bmp), {flag: 'w+'})
  return !fileWritten
}

// access function
run().then(res => {
  if(res) console.log('done with', targetFile)
})
