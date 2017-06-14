/**
 * Created by liteng on 2017/6/14.
 */
const fs = require('fs')

const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

const load = (path) => {
    const options = {
        encoding: 'utf8',
    }
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}

class Model {

    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = require('path')
        const filename = `${classname}.json`
        const p = path.join(__dirname, '../db', filename)
        return p
    }

    static _newFromDict(dict) {
        const cls = this
        // 这种初始化 model 的方式有 bug, 这种方式会用 form 直接重置数据库现有的内容
        // 比如 dict 里 role 为 1, 但是 constructor 里面 this.role = 2, 这样就会被覆盖
        // 所以先用一个空 object 初始化一个 model 实例, 然后动态改变值
        const m = new cls({})
        Object.keys(dict).forEach((k) => {
            m[k] = dict[k]
        })
        return m
    }
    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map((item) => {
            const cls = this
            const instance = cls._newFromDict(item)
            return instance
        })
        return ms
    }

    static create(form={}, kwargs={}) {
        const cls = this
        const instance = new cls(form)
        // 额外设置 instance 属性
        Object.keys(kwargs),forEach((k) => {
            instance[k] = kwargs[k]
        })
        instance.save()
        return instance
    }

    save() {
        const cls = this.constructor
        const models = cls.all()
        if (this.id === undefined) {
            // 创建一个新的
            if (models.length > 0) {
                const last = models[models.length - 1]
                this.id = last.id + 1
            } else {
                // 0 在 js 中会被处理成 false, 第一个元素的 id 设置为 1, 方便处理
                this.id = 1
            }
            models.push(this)
        } else {
            // 更新
            const index = models.findIndex((e) => {
                return e.id === this.id
            })
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(models, path)
    }
}


