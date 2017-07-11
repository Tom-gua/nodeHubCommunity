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
        if(e.target.classList.contains('delete-image')){
            var id = e.target.dataset.id
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this imaginary file!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function(){
                    var request = {
                        url: `/topic/delete/${id}`,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function() {
                            swal("Deleted!", "Your imaginary file has been deleted.", "success");
                        }
                    }
                    $.ajax(request)
                });
        }else {
            var id = e.target.dataset.id
            if(!id){
                id = e.target.parentNode.dataset.id
            }
            // 请求到详情页面
            requestTopicDetailById(id)
        }
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


var bindClickAdd = () => {
    // 绑定发帖事件
    clickAddTopic()
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