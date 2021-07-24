const path = require('path')
const Server = require('axios')
const crypto = require('crypto')
const fs = require("fs")
const userName = require('os').userInfo().username
const sendMsg = async (url, secret, Msg) => {
    const timestamp = new Date().getTime()
    const stringToSign = timestamp + "\n" + secret
    const sign = crypto.createHmac('sha256', secret).update(stringToSign).digest("base64")
    const signUrlencode = encodeURIComponent(sign)
    const { data } = await Server({
        url: url + `&timestamp=${timestamp}&sign=${signUrlencode}`,
        method: "POST",
        data: {
            "msgtype": "text",
            "text": {
                "content": Msg
            }
        }
    })
    return data
}
const getdirsize = (dir, callback) => {
    var size = 0
    fs.stat(dir, function (err, stats) {
        if (err) return callback(err)
        if (stats.isFile()) return callback(null, stats.size)
        fs.readdir(dir, function (err, files) {
            if (err) return callback(err)
            if (files.length == 0) return callback(null, 0)
            var count = files.length
            for (var i = 0; i < files.length; i++) {
                getdirsize(path.join(dir, files[i]), function (err, _size) {
                    if (err) return callback(err)
                    size += _size
                    if (--count <= 0) {
                        callback(null, size)
                    }
                })
            }
        })
    })
}
class DingTalkMsgPlugin {
    constructor (options) {
        this.options = options
    }
    apply (compiler) {
        compiler.hooks.done.tap('DingTalkMsgPlugin', ({ compilation }) => {
            getdirsize(compilation.options.output.path, async (err, size) => {
                if (err) {
                    console.log(err)
                    return
                }
                const kbSize = Math.floor(size / 1024)
                const url = this.options.webhook
                const secret = this.options.secret
                try {
                    const Msg = `构建大小: ${kbSize}kb\n用户信息: ${userName}\n构建时间: ${new Date().getHours()} : ${new Date().getMinutes()}\n构建环境: ${process.env.CODE_ENV || process.env.NODE_ENV}`
                    const res = await sendMsg(url, secret, Msg)
                    console.log(res)
                } catch (error) {
                    console.log(error)
                }
            })
        })
    }
}

module.exports = DingTalkMsgPlugin
