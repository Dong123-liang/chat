const dbServe = require('../dao/dbserver');
//用户详情
exports.userDetail = function (req, res) {
    let id =req.query.id
    dbServe.userDetail(id,res)
}
//用户修改
exports.userUpdate = function (req, res) {
    let data=req.body
    dbServe.userUpdate(data,res)
}

//获取好友昵称
exports.getMarkName = function (req, res) {
    let data=req.body
    dbServe.getMarkName(data,res)
}

//修改好友昵称
exports.friendMarkName = function (req, res) {
    let data=req.body
    dbServe.friendMarkName(data,res)
}
