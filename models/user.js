/**
 * Created by liteng on 2017/6/15.
 */
const Model = require('./main')
const crypto = require('crypto')
const {log} = require('../utils')
class User extends Model{
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
        this.id = form.id
        this.note = form.note || ''
        // 默认的权限是 2， 管理员权限手动设置为 1
        this.role = 2
        this.avatar = ''
    }

    static create(form={}) {
        // 将密码加盐加密存储
        form.password = this.saltedPassword(form.password)
        const user = super.create(form)
        user.save()
        return user
    }
    // 用盐来加密
    static saltedPassword(passWord, salt='node8') {
        function _sha1(s) {
            const algorithm = 'sha1'
            const hash = crypto.createHash(algorithm)
            hash.update(s)
            const  h = hash.digest('hex')
            return h
        }
        const hash1 = _sha1(passWord)
        const hash2 = _sha1(hash1)
        return hash2
    }

    // 注册
    static register(form={}) {
        const {username, password} = form
        const validForm = username.length > 2 && password.length > 2
        // 是否存在
        const uniqueUser = User.findOne('username', username) === null
        if(validForm && uniqueUser) {
            const u = this.create(form)
            u.save()
            return u
        }else {
            return null
        }
    }

    // 登陆
    static login(form={}) {
        const { username, password } = form
        const pwd = this.saltedPassword(password)
        const user = User.findOne('username', username)
        return user !== null && user.password === pwd
    }

    validateAuth(form) {
        const cls = this.constructor
        const { username, password } = form
        console.log('uuuuu',username, password)
        const pwd = cls.saltedPassword(password)
        const usernameEquals = this.username === username
        const passwordEquals = this.password === pwd
        return usernameEquals && passwordEquals
    }
    // 是否是管理员
    static isAdmin() {
        return this.id === 1
    }
}

const test = () => {
    // const u1 = User.findBy('username', 'gua')
    // const u2 = User.findBy({
    //     username: 'gua',
    // })
    // console.log('debug u1', u1)
    // console.log('debug u2', u2)
    const form = {
        username: 'tom',
        password: '12345',
        note: 'py',
    }
    // User.create(form)
    const u = User.login(form)
    console.log('debug u', u)
}

// 当 nodejs 直接运行一个文件时, require.main 会被设为它的 module
// 所以可以通过如下检测确定一个文件是否直接运行
if (require.main === module) {
    test()
}

module.exports = User