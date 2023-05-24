const fsp = require('fs/promises')
const FFT = require('fft.js');
const WaveFile = require('wavefile');
const SpectrumAnalyser = require('spectrum-analyzer');
const Octave = require('./octave.js')

let waveFile;
let fft;

fsp.readFile('waveFiles/waveSample.wav', {}).then((buffer) => {
    waveFile = new WaveFile(buffer);
    let size = 4096 << 1

    let spectrumAnalyser = new SpectrumAnalyser(size)
    let data = waveFile.samples.slice(0, size)
    spectrumAnalyser.appendData(data);
    spectrumAnalyser.recompute();
    let power = spectrumAnalyser.getPower()

    let outData = [];
    let halfPowerLen = power.length >>> 1;
    for (let i=0; i<=halfPowerLen; i++) {
        outData[i] = Math.sqrt(power[i])/size
    }
    // console.log(outData)
    // fsp.writeFile('FFTFiles/out.json', JSON.stringify(outData), {flag: 'w'})
    let outData_wrapped = {
        data: {
            values: outData,
            baseFreq: 0,
            deltaFreq: 24000/outData.length,
            frameLength: size >>> 1
        }
    }
    let octaveData = Octave.octave3(2, outData_wrapped);
    console.log(octaveData)
});
