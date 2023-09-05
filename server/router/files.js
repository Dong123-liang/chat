//引入express第三方模块
const express = require("express");
//创建路由器对象
const r = express.Router();
//文件上传
const multer = require("multer");
const { mkdirs } = require('../config/mkdir')
//控制文件存储
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //文件路径
        let url = req.body.url
        mkdirs('../data/' + url, err => {
            console.log(err)
        })
        cb(null, "./data/" + url);
    },
    filename: function (req, file, cb) {
        let name = req.body.name
        //正则匹配文件后缀名
        let type = file.originalname.replace(/.+\./, '.')
        cb(null, name + type);
    },
});

var upload = multer({ storage: storage });
r.post("/upload", upload.array("file", 12), function (req, res, next) {
    //   console.log(req.files)
    let url =req.body.url
    let name = req.files[0].filename
    let imgurl = '/'+url+'/'+name
    res.send( imgurl )
});
//导出路由器对象
module.exports = r;
