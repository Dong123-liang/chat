
const mongoose = require('../db')
const schema = mongoose.Schema
//用户表
var user = new schema({
    name: {type:String},//用户名
    pwd: {type:String},//密码
    email: {type:String},//邮箱
    sex: {type:Number,default:2},//性别 0女 1男 2未知
    birth: {type: String},//生日
    tel: {type: Number},//电话
    explain: {type: String},//签名
    avatar: {type:String,default:'/user/user.jpg'},//头像
    createTime:{type:Number},//注册时间
})

//好友表
var friend = new schema({
    userid: {type:schema.Types.ObjectId,ref:'user'},//用户id
    friendid: {type:schema.Types.ObjectId,ref:'user'},//好友id
    createTime:{type:Number},//创建时间
    state: {type:Number},//好友状态 0已成为好友，1申请中,2申请发送方，对方还未同意
    markname:{type:String},//好友昵称
    lastTime:{type:Number},//最后通讯时间
})

//一对一消息表
var message = new schema({
    userid: {type:schema.Types.ObjectId,ref:'user'},//发送者id
    friendid: {type:schema.Types.ObjectId,ref:'user'},//接收者id
    createTime:{type:Number},//发送时间
    message: {type:String},//发送内容
    types: {type:String},//内容类型 0文字，1图片，2音频，3定位...
    state: {type:Number},//状态 0已读 1未读
})

//群表
var group = new schema({
    userid: {type:schema.Types.ObjectId,ref:'user'},//群主id
    name:{type:String},//群名
    avatar:{type:String,default:'/group/group.png'},//群封面
    notice:{type:String},//群公告
    createTime:{type:Number},//创建时间
})

//群成员表
var groupUser = new schema({
    groupid: {type:schema.Types.ObjectId,ref:'group'},//群id
    userid: {type:schema.Types.ObjectId,ref:'user'},//用户id
    name:{type:String},//群内名称
    createTime:{type:Number},//加入时间
    tip:{type:Number,default:0},//未读信息数
    isShielding:{type:Number},//是否屏蔽
    lastTime:{type:Number},//最后通讯时间
})

//群消息表
var groupMessage = new schema({
    groupid: {type:schema.Types.ObjectId,ref:'group'},//群id
    userid: {type:schema.Types.ObjectId,ref:'user'},//发送者id
    message: {type:String},//发送内容
    types: {type:String},//内容类型 0文字，1图片，2音频，...
    createTime:{type:Number},//发送时间
})
//1.
module.exports.user = mongoose.model('user', user)
module.exports.friend = mongoose.model('friend', friend)
module.exports.message = mongoose.model('message', message)
module.exports.group = mongoose.model('group', group)
module.exports.groupUser = mongoose.model('groupUser', groupUser)
module.exports.groupMessage = mongoose.model('groupMessage', groupMessage)

//2.这种写法最后只会剩下最后一个
// module.exports = mongoose.model('user', user)
// module.exports = mongoose.model('friend', friend) 
// module.exports= mongoose.model('message', message)
// module.exports= mongoose.model('group', group)
// module.exports= mongoose.model('groupUser', groupUser)
// module.exports= mongoose.model('groupMessage', groupMessage)