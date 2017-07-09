/**
 * Created by liteng on 2017/6/13.
 */
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')

const {log} = require('./utils')
const { secretKey } = require('./config')
const app = express()

// 设置 bodyParser
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false,
}))

// 设置 bodyParser 解析 json 格式的数据
app.use(bodyParser.json())

// 设置 session, 这里的 secretKey 是从 config.js 文件中拿到的
app.use(session({
    secret: secretKey,
}))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
// nunjucks.configure 返回的是一个 nunjucks.Environment 实例对象
const env = nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})


env.addFilter('formattedTime', (ut) => {
    // 引入自定义的过滤器 filter
    const {formattedTime} = require('./filter/filter')
    const s = formattedTime(ut)
    return s
})

// 配置静态资源文件, 比如 js css 图片
const asset = __dirname + '/static'
app.use('/static', express.static(asset))

app.use((request, response, next) => {
    // response.locals 会把数据传到页面中
    // 这里的处理方式是先把 flash 数据放在 session 中
    // 然后把 flash 里面的数据放在 response.locals 中
    // 接着删除 response.session 中的 flash 数据,
    // 这样只会在当前这次请求中使用 flash 数据
    response.locals.flash = request.session.flash
    // obj = { a: '123' }
    // obj.a = null
    // delete obj.a
    delete request.session.flash
    next()
})

const index = require('./routes/index')
const topic = require('./routes/topic')
const {board} = require('./routes/board')
app.use('/', index)
app.use('/topic', topic)
app.use('/board', board)

// 把逻辑放在单独的函数中, 这样可以方便地调用
// 指定了默认的 host 和 port, 因为用的是默认参数, 当然可以在调用的时候传其他的值
const run = (port=3000, host='') => {
    // app.listen 方法返回一个 http.Server 对象, 这样使用更方便
    const server = app.listen(port, host, () => {
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}

if (require.main === module) {
    const port = 2333
    // host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    const host = '0.0.0.0'
    run(port, host)
}