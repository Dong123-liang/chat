const dbServe = require('../dao/dbserver');
module.exports = function (socketio) {
    let users={}//soccket注册用户
    socketio.on("connection", (socket) => {
        console.log("有连接进入" + socket.id);
       
        socket.on("login", (id) => {
            // console.log(id);
            //回复客户端
            users[id]=socket.id
            socket.name=id
        });

        //用户一对一消息
        socket.on("msg", (msg,fromid,toid) => {
            console.log(msg,fromid,toid);
            //修改好友最后通讯时间
            dbServe.upFriendLast(fromid,toid)
            //存储一对一消息
            dbServe.insertMsg(fromid,toid,msg.message,msg.types)
            // 发送给对方
            if(users[toid]){
            socket.to(users[toid]).emit('msg',msg,fromid,0)
            }
            //发送给自己
            socket.emit('msg',msg,toid,1)
        });

        //加入群
        socket.on('group',data=>{
            socket.join(data)
            // console.log(data)
        })

        //接收群消息
        socket.on('groupMsg',(msg,fromid,gid,name,avatar)=>{
            //修改群最后通讯时间
            dbServe.upGroupLast(fromid,gid)
            //存储群消息
            dbServe.insertGroupMsg(fromid,gid,msg.message,msg.types)
            //广播消息
            socket.to(gid).emit('groupmsg',msg,fromid,gid,name,avatar,0)
            //发送给自己
            socket.emit('groupmsg',msg,fromid,gid,name,avatar,1)
        })

        //告知离开当前页面
        socket.on('leaveChat',(uid,fid)=>{
            socket.emit('leavechat',uid,fid)
        })
        //用户离开
        socket.on("disconnecting", () => {
            if(users.hasOwnProperty(socket.name)){
                delete users[socket.name]
                console.log(socket.id+'离开')
            }
          });
    });
}