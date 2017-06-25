/**
 * Created by liteng on 2017/6/17.
 */
const Model = require('./main')

class Reply extends Model{
    constructor(form) {
        super()
        this.id = form.id
        this.content = form.content || ''
        this.ct = Date.now()
        this.ut = this.ct
        this.user_id = form.user_id || ''
        this.topic_id = Number(form.topic_id || -1)
    }

    user() {
        const User = require('./user')
        const u = User.get(this.user_id)
        return u
    }
}

module.exports = Reply