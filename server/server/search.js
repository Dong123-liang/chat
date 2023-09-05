const dbServe = require('../dao/dbserver');
//用户搜索
exports.searchUser = function (req, res) {
    let name= req.query.name
    dbServe.searchUser(name,res)
}
//判断是否为好友
exports.isFriend = function (req, res) {
    let uid= req.body.uid
    let fid =req.body.fid
    dbServe.isFriend(uid,fid,res)
}

//群搜索
exports.searchGroup = function (req, res) {
    let name= req.query.name
    dbServe.searchGroup(name,res)
}
//判断是否在群
exports.isGroup = function (req, res) {
    let uid= req.body.userid
    let fid =req.body.groupid
    dbServe.isGroup(uid,fid,res)
}