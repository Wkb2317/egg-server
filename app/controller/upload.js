const path = require("path");
const fs = require("fs");
const Controller = require("egg").Controller;

//故名思意 异步二进制 写入流
const awaitWriteStream = require("await-stream-ready").write;
//管道读入一个虫洞。
const sendToWormhole = require("stream-wormhole");
//当然你也可以不使用这个 哈哈 个人比较赖
//还有我们这里使用了egg-multipart
const md5 = require("md5");

class UploadController extends Controller {
  async uploadImage() {
    const ctx = this.ctx;
    //egg-multipart 已经帮我们处理文件二进制对象
    // node.js 和 php 的上传唯一的不同就是 ，php 是转移一个 临时文件
    // node.js 和 其他语言（java c#） 一样操作文件流
    const stream = await ctx.getFileStream();
    //新建一个文件名
    const filename = md5(stream.filename) + path.extname(stream.filename).toLocaleLowerCase();
    //文件生成绝对路径
    //当然这里这样市不行的，因为你还要判断一下是否存在文件路径
    const target = path.resolve(__dirname, "../../static", filename);
    //生成一个文件写入 文件流
    let writeStream = fs.createWriteStream(target);
    try {
      //异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
      const url = "http://110.40.236.242:8001/static/" + filename;

      return (ctx.body = {
        code: 1,
        msg: "ok",
        url: url,
      });
    } catch (err) {
      //如果出现错误，关闭管道
      await sendToWormhole(stream);
      return (ctx.body = {
        code: 0,
        msg: "error",
        url: "",
      });
      throw err;
    }
  }
}

module.exports = UploadController;
