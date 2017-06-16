/**
 * Created by liteng on 2017/6/14.
 */
const fs = require('fs')
const {log} = require('../utils')

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

    // 创建
    static create(form={}, kwargs={}) {
        const cls = this
        const instance = new cls(form)
        // 额外设置 instance 属性
        Object.keys(kwargs).forEach((k) => {
            instance[k] = kwargs[k]
        })
        instance.save()
        return instance
    }

    // 删除
    static remove(id) {
        const cls = this
        const models = cls.all()
        const index = models.findIndex((e) => {
            return e.id === id
        })
        if(index > -1) {
            models.splice(index, 1)
        }
        const path = cls.dbPath()
        save(models, path)
    }

    // 查找所有
    static find(key, value) {
        const all = this.all()
        const models = all.filter((m) => {
            return m[key] === value
        })
        return models
    }

    static get(id) {
        return this.findOne('id', id)
    }
    // 查找一个
    static findOne(key ,value) {
        const all = this.all()
        let m = all.find((m) => {
            return m[key] === value
        })
        if(m === undefined) {
            m = null
        }
        return m
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

    // 重新写了 toString 方法，这样是为了方便 log
    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

const test = () => {
    log('测试开始')
}

// 当 nodejs 直接运行一个文件时, require.main 会被设为它的 module
// 所以可以通过如下检测确定一个文件是否直接运行
if (require.main === module) {
    test()
}

module.exports = Model

