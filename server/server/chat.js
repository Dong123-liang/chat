const dbServe = require('../dao/dbserver');
//获取一对一聊天数据
exports.msg=function(req,res){
    let data=req.body
    dbServe.msg(data,res)
}

//获取群聊天数据
exports.grouMsg=function(req,res){
    let data=req.body
    dbServe.grouMsg(data,res)
}
