// app/service/tool.js

'use strict'

const Service = require('egg').Service
const { v4: uuid } = require('uuid')
const dayjs = require('dayjs')

const nodemailer = require('nodemailer')
const user_email = '2576267399@qq.com'
const auth_code = 'ummnwpwfxdthebjc'

const transporter = nodemailer.createTransport({
  service: 'qq', secureConnection: true, port: 465, auth: {
    user: user_email, // 账号
    pass: auth_code // 授权码
  }
})

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

class ToolService extends Service {
  //
  async sendMail(email, subject) {
    let randomNum = ''
    let index = 6
    while (index > 0) {
      randomNum += getRandomInt(0, 10)
      index--
    }
    const html = `
     <p>${email},你好</p>
     <br/>
     <p>邮箱验证码为：<span style="color: forestgreen;font-size: 18px">${randomNum}</span> ，该验证码15分钟内有效。</p>
    `
    const mailOptions = {
      from: user_email, // 发送者,与上面的user一致
      to: email, // 接收者,可以同时发送多个,以逗号隔开
      subject, // 标题
      // text, // 文本
      html
    }

    try {
      await transporter.sendMail(mailOptions)
      let userInfo = await this.app.mysql.get('user', { email })
      // console.log(userInfo)
      if (userInfo) {
        // 更新验证码和登录时间
        await this.app.mysql.update('user', {
          code: randomNum, loginTime: dayjs()
            .format('YYYY-MM-DD HH:mm:ss')
        }, { where: { id: userInfo.id } })
      } else {
        const options = {
          id: uuid(), email, code: randomNum, loginTime: dayjs()
            .format('YYYY-MM-DD HH:mm:ss'), registerTime: dayjs()
            .format('YYYY-MM-DD HH:mm:ss'),
          integral: 0,
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        }
        // console.log(options)
        await this.app.mysql.insert('user', options)
      }
      return true
    } catch (err) {
      return false
    }
  }

}

module.exports = ToolService

