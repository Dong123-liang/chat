//主页
const dbServe = require('../dao/dbserver');
//获取好友列表
exports.getUsers=function(req,res){
    let uid=req.body.uid
    let state=req.body.state
    dbServe.getUsers(uid,state,res)
}

//获取最后一条消息
exports.getOneMsg=function(req,res){
    let data=req.body
    dbServe.getOneMsg(data,res)
}

//汇总一对一消息数
exports.unReadMsg=function(req,res){
    let data=req.body
    dbServe.unReadMsg(data,res)
}

//一对一消息状态修改(已读)
exports.updateMsg=function(req,res){
    let data=req.body
    dbServe.updateMsg(data,res)
}

//获取群列表
exports.getGroup=function(req,res){
    let uid=req.body.uid
    dbServe.getGroup(uid,res)
}

//获取群最后一条消息
exports.getOneGroupMsg=function(req,res){
    let gid=req.body.gid
    dbServe.getOneGroupMsg(gid,res)
}

//群消息状态修改(已读)
exports.updateGroupMsg=function(req,res){
    let data=req.body
    dbServe.updateGroupMsg(data,res)
}