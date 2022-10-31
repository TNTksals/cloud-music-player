const formatTime = (m, s, options) => {
    var time = new Date('', '', '', '', m, s)
    const minute = time.getMinutes()
    const second = time.getSeconds()
    if (options === 'm:s')
        return `${[minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

module.exports = {
    formatTime
}