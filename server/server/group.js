const dbServe = require('../dao/dbserver');
//建群
exports.createGroup=function(req,res){
    let data=req.body
    dbServe.createGroup(data,res)
}
//添加群成员
exports.insertGroupUser=function(req,res){
    let data=req.body
    dbServe.insertGroupUser(data,res)
}

//删除群成员
exports.deleteGroupUser=function(req,res){
    let data=req.body
    dbServe.deleteGroupUser(data,res)
}

//解散群聊
exports.deleteGroup=function(req,res){
    let data=req.body
    dbServe.deleteGroup(data,res)
}


//获取群详情
exports.getGroupDetail=function(req,res){
    let gid=req.body.gid
    dbServe.getGroupDetail(gid,res)
}

//修改群信息
exports.updateGroupDetail=function(req,res){
    let data=req.body
    dbServe.updateGroupDetail(data,res)
}

//获取群内名称
exports.getGroupName=function(req,res){
    let data=req.body
    dbServe.getGroupName(data,res)
}

//修改群内名称
exports.updateGroupName=function(req,res){
    let data=req.body
    dbServe.updateGroupName(data,res)
}



//获取群成员
exports.getGroupUsers=function(req,res){
    let gid=req.body.gid
    let uid=req.body.uid
    dbServe.getGroupUsers(gid,uid,res)
}
