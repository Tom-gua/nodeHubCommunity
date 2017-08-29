const express = require('express')

const Reply = require('../models/reply')
const Topic = require('../models/topic')
const Model = Reply
const { log } = require('../utils')
const { currentUser, loginRequired, } = require('../routes/main')

// 使用 express.Router 可以创建模块化的路由
// 类似我们以前实现的形式
const reply = express.Router()

const topicsByBoard_id = (board_id) => {
    if(board_id === 1){
        // 全部
        return Topic.all(-1)
    }else {
        return Topic.allList(board_id)
    }
}
reply.post('/add', loginRequired, (request, response) => {
    const form = request.body
    const u = currentUser(request)
    const kwargs = {
        user_id: u.id
    }
    const m = Reply.create(form, kwargs)
    const ms = Reply.find('topic_id', m.topic_id)
    const user = currentUser(request)
    const args = {
        user: user,
        topics: ms,
    }
    response.send({status:'success', message:'添加成功', data: args})
})

reply.get('/delete/:id', loginRequired, (request, response) => {
    // :id 这个方式是动态路由, 意思是这个路由可以匹配一系列不同的路由
    // 动态路由是现在流行的路由设计方案
    // 动态路由的参数通过 request.params 获取
    // Model.remove 的参数是一个数字, 所以这里需要转一下
    // 注意, 这里很容易出现的 bug 是传一个字符串 '1', 结果取出来的是 null
    // 这种类型的问题, 由调用方自己保证
    const id = Number(request.params.id)
    // 根据 id 删除 topic, remove 方法顺便返回了 topic 这个 model,
    // 有些场景下是需要使用的
    const reply = Reply.findOne('id', id)
    const t = Reply.remove(id)
    const ms = Reply.find('topic_id', reply.topic_id)
    const user = currentUser(request)
    const args = {
        user: user,
        topics: ms,
    }
    response.send({status:'success', message:'删除成功', data: args})
})

module.exports = {reply}