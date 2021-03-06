const express = require('express')

const Topic = require('../models/topic')
const Board = require('../models/board')
const Model = Topic
const { log } = require('../utils')
const { currentUser, loginRequired } = require('./main')

// 使用 express.Router 可以创建模块化的路由
// 类似我们以前实现的形式
const topic = express.Router()

const quickSort = function(arr) {
    if (arr.length <= 1) {
        return arr
    }
    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIndex, 1)[0];
    let view = pivot.view
    let left = [];
    let right = [];
    for (let i = 0; i < arr.length; i++){
        const topic = arr[i]
        if (topic.view < view) {
            left.push(topic);
        } else {
            right.push(topic);
        }
    }
    // 递归执行
    return quickSort(left).concat([pivot], quickSort(right));
};

// 获得热点话题
const hotTopic = () => {
    const all = topicsByBoard_id(-1)
    const TopicBySort = quickSort(all)
    const topics = TopicBySort.slice(0, 3)
    return topics
}
const topicsByBoard_id = (board_id) => {
    if(board_id === 1){
        // 全部
        return Topic.all(-1)
    }else {
        return Topic.allList(board_id)
    }
}
topic.get('/', (request, response) => {
    const board_id = Number(request.query.board_id || -1)
    const ms = topicsByBoard_id(board_id)
    const boards = Board.all()
    const user = currentUser(request)
    const hotTopics = hotTopic()
    const args = {
        admin: user.isAdmin(),
        hotTopics: hotTopics,
        user: user,
        topics: ms,
        boards: boards,
        board_id: board_id,
    }
    // log('debug args', args)
    response.render('topic/index.html', args)
})

topic.get('/detail/:id', (request, response) => {
    const id = Number(request.params.id)
    log('id',id)
    // const t = Topic.findOne('id', id)
    // t.views += 1
    // t.save()
    // const args = {
    //     topic: t,
    // }
    const user = currentUser(request)
    const m = Topic.get(id)
    const args = {
        topic: m,
        user: user,
    }
    response.render('topic/detail.html', args)
})

topic.get('/new',loginRequired, (request, response) => {
    const boards = Board.all()
    const args = {
        boards: boards,
    }
    response.render('topic/new.html', args)
})

topic.post('/add', (request, response) => {
    // 获取添加 topic 的表单内容
    const form = request.body
    // 调用 create 方法保存 topic
    const u = currentUser(request)
    form.user_id = u.id
    const m = Model.create(form)
    // 重定向到 topic 首页
    response.redirect(`/topic?board_id=${form.board_id}`)
})

topic.get('/delete/:id', loginRequired, (request, response) => {
    // :id 这个方式是动态路由, 意思是这个路由可以匹配一系列不同的路由
    // 动态路由是现在流行的路由设计方案
    // 动态路由的参数通过 request.params 获取
    // Model.remove 的参数是一个数字, 所以这里需要转一下
    // 注意, 这里很容易出现的 bug 是传一个字符串 '1', 结果取出来的是 null
    // 这种类型的问题, 由调用方自己保证
    const id = Number(request.params.id)
    // 根据 id 删除 topic, remove 方法顺便返回了 topic 这个 model,
    // 有些场景下是需要使用的
    const t = Model.remove(id)
    response.redirect(`/topic/myTopic`)
})

topic.get('/edit/:id', (request, response) => {
    const id = Number(request.params.id)
    const m = Model.get(id)
    const args = {
        topic: m,
    }
    response.render('topic/edit.html', args)
})

topic.post('/update', (request, response) => {
    const form = request.body
    const m = Model.update(form)
    // const args = {
    //     topic: m,
    // }
    // console.log('m',request.form)
    response.redirect(`/topic?board_id=${m.board_id}`)
})

// 我的帖子的接口
topic.get('/myTopic', (request, response) => {
    const u = currentUser(request)
    const ms = Topic.find('user_id', u.id)
    const res = {
        status:'success',
        message:'成功',
        data:{
            myTopic: ms,
        }
    }
    response.send(JSON.stringify(res))
})

module.exports = topic

