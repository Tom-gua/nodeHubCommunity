/**
 * Created by liteng on 2017/7/2.
 */
var log = function() {
    console.log.apply(console, arguments)
}


// 请求详情页面
const requestTopicDetailById = function(id) {
    location.pathname = `/topic/detail/${id}`
}
var bindClickTopic = function() {
    $('.topicItem').on('click', function(e) {
        var id = e.target.dataset.id
        if(!id){
            id = e.target.parentNode.dataset.id
        }
        // 请求到详情页面
        requestTopicDetailById(id)
    })
    $('.hotTopicTitle').on('click', function(e) {
        var id = e.target.dataset.id
        if(!id){
            id = e.target.parentNode.dataset.id
        }
        // 请求到详情页面
        requestTopicDetailById(id)
    })
}

var bindEvents = function() {
    bindClickTopic()
}

var main = function() {
    $(document).ready(function() {
        // 1.绑定事件
        bindEvents()
    })
}
main()