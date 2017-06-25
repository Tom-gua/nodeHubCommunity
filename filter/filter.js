/**
 * Created by liteng on 2017/6/25.
 */
const formattedTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleString()
}
const getAll = (id) => {
    const Topic = require('../models/topic')
    let t = Topic.find('board_id', Number(id))
    return t
}
 const lastContent = (id) => {
     const t = getAll(id)
     if(t.length === 0){
         return '还没有话题信息哦!'
     }
    const lastTopic = t[t.length - 1]
    return lastTopic.content

}

const topicTotals = (id) => {
    const t = getAll(id)
    return t.length
}

const topicUT = (id) => {
    const t = getAll(id)
    if(t.length === 0){
        return '还没有话题信息哦！'
    }
    const lastTopic = t[t.length - 1]
    return formattedTime(lastTopic.ut) || ''
}

module.exports = {
    lastContent: lastContent,
    topicUT:topicUT,
    topicTotals: topicTotals
}
