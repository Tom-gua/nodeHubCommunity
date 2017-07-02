/**
 * Created by liteng on 2017/6/25.
 */
const formattedTime = (ts) => {
    const d = new Date(ts)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}

module.exports ={
    formattedTime :formattedTime,
}