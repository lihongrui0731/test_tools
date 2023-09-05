const {make, RGB} = require('binary-bmp');
// import {make, RGB} from "./mudules/binary-bmp/dist/index.iife"
const fsp = require('fs/promises')

const targetFile = 'image.bmp'
let blockStep = 0;
let width = 0;
let height = 0;
let rows = (height / blockStep)
let columns = (width / blockStep)

/**
 * @param {String} filePath
 * @returns {Promise} colors array
 */
async function generateData(filePath) {
  let rawContent = await fsp.readFile(filePath, {encoding: 'utf-8'})
  let content;
  content = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent //[[x, y, power], [x, y, power], ...]
  console.log("content length", content.length)
  let dataset = []
  let contentLength = content.length - 1
  let dataHeight = content[0][1]
  let dataWidth = content[contentLength - 1][0]
  blockStep = content[1][0] - content[0][0]
  rows = Math.ceil(dataHeight / blockStep) + 1
  columns = Math.ceil(dataWidth / blockStep) + 1
  height = rows * blockStep
  width = columns * blockStep
  console.log("block step", blockStep, "rows:", rows, "columns:", columns, "height:", height, "width:", width)
  // get colors
  let colors = []
  for (let i = 0; i < content.length; i++) {
    if (content[i][0] === null || content[i][1] === null || content[i][2] === null) continue
    let color = calcColor(content[i][2], 30, 80)
    // dataset.push(color.r)
    // dataset.push(color.g)
    // dataset.push(color.b)
    colors.push([color.r, color.g, color.b])
  }
  // for (let y = 0; y < rows; y++) {
  //   let row = []
  //   for (let x=0; x<columns; x++) {
  //     row.push(...colors[x + y * columns])
  //   }
  //   dataset.push(...row)
  // }
  // scale image
  for (let y = 0; y < rows; y++) {
    let row = []
    for (let x = 0; x < columns; x++) {
      for (let i = 0; i < blockStep; i++) {
        row.push(...colors[x + y*columns])
      }
    }
    for (let i = 0; i < blockStep; i++) {
      dataset.push(...row)
    }
  }
  console.log(dataset.length/3, "points to render")
  return dataset
}
function scaleApply(array, factor) {
  const scaled = [];

  for(const row of array) {
    let x = [];

    for(const item of row)
      x.push.apply(x, Array(factor).fill(item));

    scaled.push.apply(scaled, Array(factor).fill(x));
  }

  return scaled;
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
 * @param {number} input value
 * @param {number} min power
 * @param {number} max power
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
  // const _20th = 0.05

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
  let data = await generateData('./sum-grid-values.json')
  // for (let i=0; i<40; i++) {
  //   console.log(data[i])
  // }
  let bmp = getBMP(data)
  let fileWritten = await fsp.writeFile(targetFile, new Uint8Array(bmp), {flag: 'w+'})
  return !fileWritten
}

// access function
run().then(res => {
  if(res) console.log('done with', targetFile)
})
