/**
 * Created by liteng on 2018/3/3.
 */
const log = (...arg) => {
    console.log.apply(console, arg)
}

const checkUserAndPassword = (username, password) => {
    return username.length === 0 || password.length === 0
}

const bindEvents = () => {
    let btn = $(".login-button")[0]
    btn.addEventListener("click", function(e) {
        // 获取到账号和密码
        let use = $('.username')[0].value
        let pwd = $('.password')[0].value
        let check = checkUserAndPassword(use, pwd)
        if(check){
            swal("请求参数错误", "请重新输入")
            return false
        }else {
            return true
        }
    })
}

const main = () => {
    $(document).ready(() => {
        bindEvents()
    })
}

main()