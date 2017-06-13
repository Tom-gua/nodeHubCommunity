/**
 * Created by liteng on 2017/6/13.
 */

const fs = require('fs')

// 格式化时间
// 格式化时间的函数
const formattedTime = () => {
    const d = new Date()
    // 这里需要注意, js 中 month 是从 0 开始计算的, 所以要加 1
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()
    const t = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
    return t
}

// 用 log 把所有的输出都写入到文件中， 这样可以方便到掌握全局
const log = (...args) => {
    const t = formattedTime()
    // 将打印的结果带上时间
    const arg = [t].concat(args)
    // 打印
    console.log.apply(console, arg)

    // 将打印结果写入文件, 使用 flag 是追加模式，为了不覆盖的写入。
    const content = t + ' ' + args + '\n'
    fs.writeFileSync('log.txt', content, {
        flag: 'a',
    })
}

module.exports = {
    log: log
}