//引入express第三方模块
const express = require("express");
const path = require("path");
//创建路由器对象
const r = express.Router();
const {sendmail} =require('../server/mail')
const {builder} =require('../server/signup')
const {sigin,forgetPassword} =require('../server/sigin')
const {isUname} =require('../server/isUserName')
const {isEmail} =require('../server/isUserEmail')
const {searchUser,isFriend} =require('../server/search')
const {userDetail,userUpdate,getMarkName,friendMarkName} =require('../server/update')
const {applyFriend,updateFriendState,deleteFriend} =require('../server/friend')
const {getUsers,getOneMsg,unReadMsg,updateMsg,getGroup,getOneGroupMsg,updateGroupMsg} =require('../server/index')
const {msg,grouMsg} =require('../server/chat')
const {createGroup,insertGroupUser,getGroupDetail,getGroupUsers,deleteGroupUser,deleteGroup,updateGroupDetail,getGroupName,updateGroupName} =require('../server/group')

//校验token
r.get('/judgeToken',(req,res)=>{
    res.send({status:200})
})
//发送邮件
r.get('/mail',(req,res)=>{
    sendmail(req,res)
})

//注册
r.post('/register',(req,res)=>{
    builder(req,res)
})

//忘记密码
r.post('/forgetPassword',(req,res)=>{
    forgetPassword(req,res)
})

//用户名是否可用
r.get('/isUserName',(req,res)=>{
    isUname(req,res)
})

//用户名是否可用
r.get('/isUserEmail',(req,res)=>{
    isEmail(req,res)
})

//登录
r.post('/sigin',(req,res)=>{
    sigin(req,res)
})

//搜索用户
r.get('/searchUser',(req,res)=>{
    searchUser(req,res)
})

//判断是否为好友
r.post('/isFriend',(req,res)=>{
    isFriend(req,res)
})

//搜索群
r.get('/searchGroup',(req,res)=>{
    searchGroup(req,res)                                          
})

//判断是否在群
r.post('/isGroup',(req,res)=>{
    isGroup(req,res)
})

//用户详情
r.get('/userDetail',(req,res)=>{
    userDetail(req,res)
})

//用户修改
r.post('/userUpdate',(req,res)=>{
    userUpdate(req,res)
})

//获取好友昵称
r.post('/getMarkName',(req,res)=>{
    getMarkName(req,res)
})

//修改好友昵称
r.post('/friendMarkName',(req,res)=>{
    friendMarkName(req,res)
})

//好友操作
//申请好友
r.post('/applyFriend',(req,res)=>{
    applyFriend(req,res)
})

//更新好友状态（同意好友）
r.post('/updateFriendState',(req,res)=>{
    updateFriendState(req,res)
})

//（拒绝，删除好友）
r.post('/deleteFriend',(req,res)=>{
    deleteFriend(req,res)
})

//获取好友列表
r.post('/getUsers',(req,res)=>{
    getUsers(req,res)
})

//获取最后一条消息
r.post('/getOneMsg',(req,res)=>{
    getOneMsg(req,res)
})

//汇总一对一消息
r.post('/unReadMsg',(req,res)=>{
    unReadMsg(req,res)
})

//一对一消息状态修改(已读)
r.post('/updateMsg',(req,res)=>{
    updateMsg(req,res)
})

//建群
r.post('/createGroup',(req,res)=>{
    createGroup(req,res)
})

//添加群成员
r.post('/insertGroupUser',(req,res)=>{
    insertGroupUser(req,res)
})

//删除群成员
r.post('/deleteGroupUser',(req,res)=>{
    deleteGroupUser(req,res)
})

//解散群聊
r.post('/deleteGroup',(req,res)=>{
    deleteGroup(req,res)
})


//获取群列表
r.post('/getGroup',(req,res)=>{
    getGroup(req,res)
})

//获取群最后一条消息
r.post('/getOneGroupMsg',(req,res)=>{
    getOneGroupMsg(req,res)
})


//群消息状态修改(已读)
r.post('/updateGroupMsg',(req,res)=>{
    updateGroupMsg(req,res)
})

//获取一对一聊天信息
r.post('/chat/msg',(req,res)=>{
    msg(req,res)
})

//获取群聊天信息
r.post('/chat/groupMsg',(req,res)=>{
    grouMsg(req,res)
})

//获取群详情
r.post('/getGroupDetail',(req,res)=>{
    getGroupDetail(req,res)
})

//修改群信息
r.post('/updateGroupDetail',(req,res)=>{
    updateGroupDetail(req,res)
})

//获取群内名称
r.post('/getGroupName',(req,res)=>{
    getGroupName(req,res)
})

//修改群内名称
r.post('/updateGroupName',(req,res)=>{
    updateGroupName(req,res)
})


//获取群成员
r.post('/getGroupUsers',(req,res)=>{
    getGroupUsers(req,res)
})

//下载软件
r.get('/download',(req,res)=>{
    res.download(path.join(__dirname, "../public/download/" + 'yike.apk'));
   })
   

//导出路由器对象
module.exports = r;
