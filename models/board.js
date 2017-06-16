/**
 * Created by liteng on 2017/6/16.
 */
const Model = require('./main')

class Board extends Model{
    constructor(form={}) {
        super()
        this.id = form.id
        this.title = form.title || ''
        this.ct = Date.now()
        this.ut = this.ct
    }
    // 更细板块
    static update(form={}) {
        const id = Number(form.id)
        const m = this.get(id)
        const keys = this.frozenKeys()
        Object.keys(form).forEach((k) => {
            if(!keys.includes(k)){
                m[k] = form[k]
            }
        })
        m.ut = Date.now()
        m.save()
        return m
    }

    static frozenKeys() {
        const r = [
            'id',
            'ct',
        ]
        return r
    }
}

module.exports = Board