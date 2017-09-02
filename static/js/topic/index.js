/**
 * Created by liteng on 2017/7/2.
 */
var log = function() {
    console.log.apply(console, arguments)
}
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
// 请求详情页面
const requestTopicDetailById = function(id) {
    location.pathname = `/topic/detail/${id}`
}
const requestNewTopic = () => {
    location.pathname = '/topic/new'
}

const clickTargetByClass = (className) => {
    $(`.${className}`).on('click', function(e) {
        if(e.target.classList.contains('delete-image')){
            var id = e.target.dataset.id
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this imaginary file!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: true
                },
                function(){
                    var request = {
                        url: `/topic/delete/${id}`,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function(res) {
                            const data = JSON.parse(res).data
                            insertTopicToMain(data)
                        }
                    }
                    $.ajax(request)
                });
        }else {
            var id = e.target.dataset.id
            if(!id){
                id = e.target.parentNode.dataset.id
            }
            requestTopicDetailById(id)
        }
    })
}

const clickAddTopic = () => {
    $(".topic-add").on('click', function(e) {
            requestNewTopic()
    })
}
const insertTopicToMain = function(data) {
    const html = data && data.myTopic.map(function(item, index) {
        const time = formattedTime(item.ct)
        return ` <div class="tab-pane active topicItem" id=tab${item.id} data-id=${item.id}>
                                    <div class="topic_title">${item.title}</div>
                                    <a href="/topic/edit/${item.id}"><img class="edit-image" data-id=${item.id} src="../../static/images/edit.png"/></a>
                                    <img class="delete-image" data-id=${item.id} src="../../static/images/delete.png"/>
                                    <a class="topic_updateTime">编辑于 ${time}</a>
                        </div>`
    }).join('')
    $('.tab-content')[0].innerHTML = html
}
const clickMyTopic = () => {
    $('.myTopic').on('click', function(e) {
        var request = {
            url: `topic/myTopic`,
            type: 'GET',
            contentType: 'application/json',
            success: function(res) {
                console.log('res',res)
                const data = JSON.parse(res).data
                insertTopicToMain(data)
            }
        }
        $.ajax(request)
    })
}

var bindClickAdd = () => {
    // 绑定发帖事件
    clickAddTopic()
}

var bindClickTopic = () => {
    clickTargetByClass('tab-content')
    clickTargetByClass('hotTopicTitle')
}

var bindEvents = () => {
    bindClickTopic()
    bindClickAdd()
    clickMyTopic()
}

var main = () => {
    $(document).ready(() => {
        // 1.绑定事件
        bindEvents()
    })
}
main()