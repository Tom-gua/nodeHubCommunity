const express = require('express')

const Reply = require('../models/reply')
const Model = Reply
const { log } = require('../utils')
const { currentUser, loginRequired, } = require('../routes/main')

// 使用 express.Router 可以创建模块化的路由
// 类似我们以前实现的形式
const reply = express.Router()

reply.post('/add', loginRequired, (request, response) => {
    const form = request.body
    const u = currentUser(request)
    const kwargs = {
        user_id: u.id
    }
    const m = Reply.create(form, kwargs)
    response.redirect(`/topic/detail/${m.topic_id}`)
})

// reply.get('/detail/:id', (request, response) => {
//     const id = Number(request.params.id)
//     log('id',id)
//     // const t = Topic.findOne('id', id)
//     // t.views += 1
//     // t.save()
//     // const args = {
//     //     topic: t,
//     // }
//     const user = currentUser(request)
//     const m = Reply.get(id)
//     const args = {
//         topic: m,
//         user: user,
//     }
//     response.render('topic/detail.html', args)
// })

module.exports = {reply}