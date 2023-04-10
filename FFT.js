const fsp = require('fs/promises')
const FFT = require('fft.js');
const WaveFile = require('wavefile');

let waveFile;
fsp.readFile('waveFiles/waveSample.wav', {}).then((buffer) => {
    waveFile = new WaveFile(buffer);
    console.log(waveFile)
});
