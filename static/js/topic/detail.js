/**
 * Created by liteng on 2017/8/29.
 */
const clickTargetByClass = (className) => {
    $(`.${className}`).on('click', function(e) {
        console.log(12222,e.target.classList)
        if(e.target.classList.contains('btn')){
            console.log(111)
            var id = e.target.dataset.id
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this comment!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function(){
                    var request = {
                        url: `/reply/delete/${id}`,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function(res) {
                            console.log('res',res)
                            // window.location.reload()
                        }
                    }
                    $.ajax(request)
                });
        }
    })
}
var bindClickDelete = () => {
    clickTargetByClass('commentdelete')
}

var bindEvents = () => {
    bindClickDelete()
}

var main = () => {
    $(document).ready(() => {
        // 1.绑定事件
        bindEvents()
    })
}
main()