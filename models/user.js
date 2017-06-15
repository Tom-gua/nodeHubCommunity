/**
 * Created by liteng on 2017/6/15.
 */
const Model = require('main')
const crypto = require('crypto')

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
}