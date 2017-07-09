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
const requestNewTopic = () => {
    location.pathname = '/topic/new'
}

const clickTargetByClass = (className) => {
    $(`.${className}`).on('click', function(e) {
        var id = e.target.dataset.id
        if(!id){
            id = e.target.parentNode.dataset.id
        }
        // 请求到详情页面
        requestTopicDetailById(id)
    })
}

const clickAddTopic = () => {
    $(".topic-add").on('click', function(e) {
        requestNewTopic()
    })
}
// const requestAllBoard = () => {
//     var request = {
//         url: '/topic?board_id=1',
//         type: 'GET',
//         success: function() {
//
//         }
//     }
//     $.ajax(request)
// }
const clickAddBoard = () => {
    $(".board-add").on('click', function(e) {
        swal({
                title: "请输入要添加的板块!",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: true,
                animation: "pop",
                inputPlaceholder: "请输入板块的名字"
            },
            function(inputValue){
                if (inputValue === false) {
                    return false;
                }
                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false
                }
                var s = {title: inputValue}
                var request = {
                    url: '/board/add',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(s),
                    success: function() {
                        document.querySelector('.tab-a').click()
                    }
                }
                $.ajax(request)
            });
    })
}

var bindClickAdd = () => {
    // 绑定发帖事件
    clickAddTopic()
    // 绑定添加板块事件
    clickAddBoard()
}
var bindClickTopic = () => {
    clickTargetByClass('topicItem')
    clickTargetByClass('hotTopicTitle')
}

var bindEvents = () => {
    bindClickTopic()
    bindClickAdd()
}

var main = () => {
    $(document).ready(() => {
        // 1.绑定事件
        bindEvents()
    })
}
main()