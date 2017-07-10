/**
 * Created by liteng on 2017/6/16.
 */
const Model = require('./main')

class Topic extends Model{
    constructor(form={}) {
        super()
        this.id = form.id
        this.view = form.view || ''
        this.title = form.title || ''
        this.content = form.content || ''
        this.ct = Date.now()
        this.ut = this.ct
        this.user_id = form.user_id || ''
        this.board_id = Number(form.board_id || -1)
    }

    static get(id) {
        const m = super.get(id)
        m.view += 1
        m.save()
        return m
    }

    static allList(board_id) {
        let ms = []
        if (board_id === -1) {
            // 相当于 Model.all()
            ms = super.all()
        } else {
            ms = super.find('board_id', board_id)
        }
        return ms
    }

     replies() {
        const Reply = require('./reply')
        const ms = Reply.find('topic_id', this.id)
        return ms
    }
    // 哪个用户下的
    user() {
        const User = require('./user')
        const b = User.findOne('id', this.user_id)
        return b
    }
    // 哪个模块下的
    board() {
        const Board = require('./board')
        const b = Board.findOne('id', this.board_id)
        return b
    }
    // 创建
    static fakeCreate(form) {
        const m = super.create(form)
        if (m === null) {
            const obj = {
                success: false,
                data: null,
                message: '用户名已经使用',
            }
            return obj
        } else {
            const obj = {
                success: true,
                data: m,
                message: '',
            }
            return obj
        }
    }
    static update(form={}) {
        console.log('form',form)
        const id = Number(form.id)
        const m = this.get(id)
        const keys = this.frozenKeys()
        Object.keys(form).forEach((k) => {
            if (!keys.includes(k)) {
                m[k] = form[k]
            }
        })
        m.ut = Date.now()
        console.log('m', m)
        m.save()
        return m
    }

    static frozenKeys() {
        // 保证了这些内容不会被修改
        const l = [
            "user_id",
            "board_id",
            'id',
            "view",
            'ct',
        ]
        return l
    }

}

module.exports = Topic