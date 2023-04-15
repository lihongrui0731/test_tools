function octave3(n, fft) {
    let dataFrame = fft.data
    let values = dataFrame.values
    let baseFreq = dataFrame.baseFreq
    let deltaFreq = dataFrame.deltaFreq
    let frameLength = dataFrame.frameLength

    let f_oct = []
    let y_oct = []

    let f_arr = []
    for (let i = 0; i < frameLength; i++) {
        f_arr[i] = baseFreq + deltaFreq * i
    }
    // console.log(f_arr.length, f_arr)
    // for (let i=0; i<values.length; i++) {
    //   values[i] = Math.sqrt(values[i])
    // }

    const f_cal = false
    let G
    switch (n) {
        case 2:
            G = 2
            break
        case 10:
            G = Math.pow(10, 0.3)
            break
        default:
            G = Math.pow(10, 0.3)
            break
    }
    const OctRatio = Math.pow(G, 1 / 6)

    let nn = []
    let f_center = []
    const f_centers = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000]
    let f_low = []
    let f_up = []

    for (let i = 0; i <= 13 + 37; i++) {
        nn[i] = (-37 + i) / 3
        f_center[i] = f_cal ? 1000 * Math.pow(G, nn[i]) : f_centers[i]
        f_low[i] = f_center[i] / OctRatio
        f_up[i] = f_center[i] * OctRatio
    }

    let c_u_l = []
    let ci_ui_li = [] // f_center, f_up index, f_low index, target values range index
    for (let i = 0; i < f_center.length; i++) {
        let index1 = f_arr.filter(f => f < f_up[i] && f_low[i] < f)
        if (index1.length >= 3) {
            c_u_l.push([f_center[i], f_up[i], f_low[i]])
            let index1Max = Math.max(...index1)
            let index1Min = Math.min(...index1)
            ci_ui_li.push([f_center[i], f_arr.findIndex(value => value === index1Max), f_arr.findIndex(value => value === index1Min), index1.length])
        }
    }
    // console.log(c_u_l)
    for (let i = 0; i < ci_ui_li.length; i++) {
        f_oct[i] = ci_ui_li[i][0] // f_center

        let x = []
        for (let j = 0; j < ci_ui_li[i][3]; j++) {
            x[j] = Math.pow(values[j + ci_ui_li[i][2]], 2)
        }
        let sum_x = 0
        for (let i = 0; i < x.length; i++) {
            sum_x += x[i]
        }
        y_oct[i] = Math.sqrt(sum_x / 1.499) // 1.499对于hanning窗，1对于矩形窗?
        y_oct[i] = (20 * Math.log10(y_oct[i] / (2e-5)) + AWeight(f_oct[i]) - 3.6).toFixed(1) //加A计权
    }
    return {f_oct: f_oct, y_oct: y_oct}
}

function AWeight(f) {
    const f1 = 20.6
    const f2 = 107.7
    const f3 = 737.9
    const f4 = 12194
    const A1000 = -2
    const up = Math.pow(f4, 2) * Math.pow(f, 4)
    const down = (Math.pow(f, 2) + Math.pow(f1, 2)) * Math.pow((Math.pow(f, 2) + Math.pow(f2, 2)), 1 / 2) * Math.pow((Math.pow(f, 2) + Math.pow(f3, 2)), 1 / 2) * (Math.pow(f, 2) + Math.pow(f4, 2))
    return 20 * Math.log10(up / down) - A1000
}

module.exports = {octave3}
