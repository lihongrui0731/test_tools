// import {Buffer} from 'node:buffer'
let resultBuffer = Buffer.from(new ArrayBuffer(9));
let nums = [-18000, 18040, -464646];
let int32Array_raw = Int32Array.from(nums)
let resultPos = 0
let arrayBuffer = new ArrayBuffer(4)
let int32View = new Int32Array(arrayBuffer/* , 0, 1 */)
let uint8View = new Uint8Array(arrayBuffer/* , 0, 4 */)
for (let i = 0; i < int32Array_raw.length; i++) {

    let item = int32Array_raw[i];
    // if(item /* & 0x80000000 */ <0) {
    //     item = Math.abs(int32Array_raw[i])
    //     item |= 0x80 << (/* (bitsPerSample/8 - 1) */2 * 8);
    // }
    int32View[0] = item

    for(let i=0; i<3; i++) {
        resultBuffer.writeUInt8(uint8View[i], resultPos+i)
    }
    resultPos += 3
}
console.log(resultBuffer)
