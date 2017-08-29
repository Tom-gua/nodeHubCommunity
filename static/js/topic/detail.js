/**
 * Created by liteng on 2017/8/29.
 */
// 格式化时间
// 格式化时间的函数
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
const generateDeleteBtn = (item, id) => {
    let h = ''
    if(item.user_id === id) {
        h += `<div class="commentdelete">
                            <button type="button" data-id=${item.id} class="btn btn-warning btn-default btn-sm">删除</button>
                        </div>`
    }
    return h
}
const insertRepliesBydata = (data) => {
    var html = ''
    data.topics.forEach((item, index) => {
        html += `
            <div class="commentAll">
                    <div class="commentUser">
                        <div>
                            <a class="user_avatar">
                                <!--<img src="/user/avatar/{{ r.user().avatar }}" title="{{ r.user().username }}"/>-->
                                ${data.user.username}
                            </a>
                            <span>
                            ${index + 1}楼
                        </span>
                        </div>
                    </div>
                    <div class="commentContent">
                        ${item.content}
                    </div>
                    <div class="commentTime">
                        <div>
                            ${formattedTime(item.ct)}
                        </div>
                        ${generateDeleteBtn(item, data.user.id)}
                    </div>
                </div>
        `
    })
    $('.commentBodys')[0].innerHTML = html
}
const clickDeleteByClass = (className) => {
    $(`.${className}`).on('click', function(e) {
        if(e.target.classList.contains('btn')){
            var id = e.target.dataset.id
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this comment!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: true
                },
                function(){
                    var request = {
                        url: `/reply/delete/${id}`,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function(res) {
                            // window.location.reload()
                            // 获取到数据插入到文档中
                            insertRepliesBydata(res.data)
                        }
                    }
                    $.ajax(request)
                });
        }
    })
}
const clickTarget = () => {
    $('.addReply').on('click', function(e) {
            var id = $('.addReply').parent()[0].dataset.id
            var text = $('.addReply').siblings('.content')[0].value
            const data = {
                topic_id : id,
                content: text,
            }
            var request = {
                        url: `/reply/add`,
                        type: 'POST',
                        contentType: 'application/json',
                        data:JSON.stringify(data),
                        success: function(res) {
                            console.log('res',res)
                            // window.location.reload()
                            // 获取到数据插入到文档中
                            insertRepliesBydata(res.data)
                        }
            }
            $.ajax(request)
    })
}
const bindClickDelete = () => {
    clickDeleteByClass('commentBodys')
}
const bindClickAddReply = () => {
    clickTarget()
}
var bindEvents = () => {
    bindClickDelete()
    bindClickAddReply()
}

var main = () => {
    $(document).ready(() => {
        // 1.绑定事件
        bindEvents()
    })
}
main()