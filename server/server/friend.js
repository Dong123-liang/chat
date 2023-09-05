const dbServe = require('../dao/dbserver');
//好友申请
exports.applyFriend = function (req, res) {
    let data =req.body
    dbServe.applyFriend(data,res)
}
//更新好友状态（同意好友）
exports.updateFriendState=function(req,res){
    let data =req.body
    dbServe.updateFriendState(data,res)
}

//（拒绝，删除好友）
exports.deleteFriend = function (req, res) {
    let data =req.body
    dbServe.deleteFriend(data,res)
  }