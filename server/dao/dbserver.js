//1.对应dbmodel的导出方法1引入
const user = require("../model/dbmodel").user;
const friend = require("../model/dbmodel").friend;
const group = require("../model/dbmodel").group;
const groupUser = require("../model/dbmodel").groupUser;
const message = require("../model/dbmodel").message;
const groupMessage = require("../model/dbmodel").groupMessage;
const Mail = require("../config/mail");

// console.log(user)
//2.对应dbmodel的导出方法2引入
// const dbmodel = require('../model/dbmodel')
// console.log(dbmodel)
// const user = dbmodel.model('user')
const { hash, compare } = require("../config/bcrypt");
const jToken = require("../config/jwt_token");
//注册
exports.builder = async function (name, email, pwd, verify, res) {
  //密码加密
  pwd = await hash(pwd);
  let obj = {
    name,
    pwd,
    email,
    createTime: new Date().getTime(),
  };//若验证码校验通过
  if (Mail.judgeMail(verify)) {
    //给user表中添加用户信息,则注册成功
    user.insertMany(obj, (err, data) => {
      if (err) {
        console.log("用户插入失败" + err);
        res.send({ status: 500 });
        return;
      } else {
        res.send({ status: 200, message: "注册成功" });
      }
    });
  } else {
    res.send({ status: 400, msg: "验证码错误" });
  }
};

//忘记密码
exports.forgetPassword = async function (email, pwd, verify, res) {
  //密码加密
  pwd = await hash(pwd);
  if (Mail.judgeMail(verify)) {
    user.updateMany({email},{pwd}, (err, data) => {
      if (err) {
        res.send({ status: 500 });
        return;
      } else {
        res.send({ status: 200, message: "修改成功" });
      }
    });
  } else {
    res.send({ status: 400, msg: "验证码错误" });
  }
};

//用户名是否存在
exports.isUname = function (name, res) {
  user.find({ name }, (err, data) => {
    if (err) {
      console.log("用户名查询失败" + err);
      res.send({ status: 500 });
      return;
    }
    if (data.length === 0) {
      res.send({ status: 200, msg: "用户名可用" });
    } else {
      res.send({ status: 400, msg: "用户名不可用" });
    }
  });
};

//邮箱是否存在
exports.isEmail = function (email, res) {
  user.find({ email }, (err, data) => {
    // console.log(data)
    if (err) {
      console.log("邮箱查询失败" + err);
      res.send({ status: 500 });
      return;
    }
    if (data.length === 0) {
      res.send({ status: 200, msg: "邮箱可用" });
    } else {
      res.send({ status: 400, msg: "邮箱不可用" });
    }
  });
};

//用户登录
exports.sigin = function (name, pwd, res) {
  //查询条件
  let wherestr = { $or: [{ name: name }, { email: name }] };
  //输出 1代表输出
  let out = {
    name: 1,
    avatar: 1,
    pwd: 1,
    _id: 1,
  };
  user.findOne(wherestr, out, async (err, data) => {
    if (err) {
      res.send({ status: 500 });
      return;
    }

    if (data) {
      // console.log(data)
      //比对密码
      let ret = await compare(pwd, data.pwd);
      if (ret) {
        let payload = { id: data._id };
        const token = jToken.generateToken(payload);
        let obj = {
          id: data._id,
          name: data.name,
          avatar: data.avatar,
          token,
        };
        res.json({ status: 200, obj, msg: "登录成功" });
      } else {
        res.json({ status: 0, msg: "密码错误" });
      }
    } else {
      res.json({ status: 0, msg: "用户名不存在" });
    }
  });
};

//搜索用户
exports.searchUser = function (name, res) {
  //彩蛋，当用户输入yike时 搜索全部用户
  let wherestr;
  if (name === "all") {
    wherestr = {};
  } else {
    //$or或者
    //$regex //模糊查询
    wherestr = {
      $or: [{ name: { $regex: name } }, { email: { $regex: name } }],
    };
  }
  let out = {
    name: 1,
    email: 1,
    avatar: 1,
  };
  user.find(wherestr, out, (err, data) => {
    if (err) {
      res.send({ status: 500 });
      return;
    }

    if (data.length > 0) {
      res.send({ status: 200, data });
    } else {
      res.send({ status: 404 });
    }
  });
};

//判断是否为好友
exports.isFriend = function (uid, fid, res) {
  let wherestr = {
    userid: uid,
    friendid: fid,
    state: 0,
  };
  friend.findOne(wherestr, (err, data) => {
    if (err) {
      res.send({ status: 500 });
      return;
    }
    // console.log(data)

    if (data) {
      //是好友
      res.send({ status: 200 });
    } else {
      res.send({ status: 404 });
    }
  });
};

//搜索群
exports.searchGroup = function (name, res) {
  let wherestr;
  if (name === "yike") {
    wherestr = {};
  } else {
    //$or或者
    //$regex //模糊查询
    wherestr = { name: { $regex: name } };
  }

  let out = {
    name: 1,
    avatar: 1,
  };

  group.find(wherestr, out, (err, data) => {
    if (err) {
      res.send({ status: 500 });
      return;
    }

    if (data) {
      res.send({ status: 200, data });
    } else {
      res.send({ status: 404 });
    }
  });
};

//判断是否在群
exports.isGroup = function (uid, gid, res) {
  let wherestr = {
    userid: uid,
    groupid: gid,
    staus: 0,
  };
  groupUser.findOne(wherestr, (err, data) => {
    if (err) {
      res.send({ status: 500 });
      return;
    }

    if (data) {
      //在群
      res.send({ status: 200 });
    } else {
      res.send({ status: 404 });
    }
  });
};

//用户详情
exports.userDetail = function (id, res) {
  let wherestr = { _id: id };
  let out = { pwd: 0 };
  user.findOne(wherestr, out, async (err, data) => {
    if (err) {
      res.send({ status: 500 });
      return;
    }
    //获取昵称
    let obj = await friend.findOne({ friendid: id });
    //拷贝
    let result = JSON.stringify(data);
    result = JSON.parse(result);
    if (obj &&obj.markname) {
      result.markname = obj.markname;
    }
    res.send({ status: 200, data: result });
  });
};

//用户修改
exports.userUpdate = async function (data, res) {
  let verify = data.verify;
  // console.log(data)
  let wherestr = { _id: data._id };
  let updateObj = {};
  //判断是否有密码
  if (data.type === "pwd") {
    //有密码则进行匹配
    //根据id查询
    let result = await user.findOne({ _id: data._id });
    if (result) {
      //匹配密码
      let ret = await compare(data.oldPass, result.pwd);
      if (ret) {
        updateObj[data.type] = await hash(data.data);
        user.updateOne(wherestr, updateObj, (err, re) => {
          if (err || re.n === 0) {
            res.json({ status: 400, msg: "密码修改失败" });
          } else {
            res.json({ status: 200, msg: "密码修改成功" });
          }
        });
      }
    }
  } else {
    updateObj[data.type] = data.data;
    // console.log(updateObj)
    if (data.type === "email") {
      if (Mail.judgeMail(verify)) {
        let result = await user.findOne({ email: data.data });
        if (result) {
          res.send({ status: 400, msg: "邮箱已存在" });
        } else {
          user.findByIdAndUpdate(data._id, updateObj, (err, result) => {
            if (err) {
              res.send({ status: 500 });
              return;
            }
            res.send({ status: 200 });
          });
        }
      } else {
        res.send({ status: 410, msg: "验证码错误" });
      }
    } else if (data.type === "name") {
      let result = await user.findOne({ name: data.data });
      if (result) {
        res.send({ status: 400, msg: "用户名已存在" });
      } else {
        user.findByIdAndUpdate(data._id, updateObj, (err, result) => {
          if (err) {
            res.send({ status: 500 });
            return;
          }
          res.send({ status: 200 });
        });
      }
    } else {
      user.findByIdAndUpdate(data._id, updateObj, (err, result) => {
        if (err) {
          res.send({ status: 500 });
          return;
        }
        res.send({ status: 200 });
      });
    }
  }
};

//获取好友昵称
exports.getMarkName = function (data, res) {
  let wherestr = { userid: data.uid, friendid: data.fid };
  let out = { markname: 1 };
  friend.findOne(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
      return;
    }
    res.send({ status: 200, result });
  });
};

//修改好友昵称
exports.friendMarkName = function (data, res) {
  // console.log(data)
  let wherestr = { userid: data.uid, friendid: data.fid };
  let updatestr = { markname: data.markname };
  friend.updateOne(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
      return;
    }
    res.send({ status: 200 });
  });
};
//好友操作
//添加好友表
exports.buildFriend = function (uid, fid, state, res) {
  let obj = {
    userid: uid,
    friendid: fid,
    state: state,
    createTime: new Date().getTime(),
    lastTime: new Date().getTime(),
  };
  friend.insertMany(obj, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

//好友最后通讯时间
exports.upFriendLast = function (uid, fid, res) {
  let wherestr = {
    $or: [
      { userid: uid, friendid: fid },
      { userid: fid, friendid: uid },
    ],
  };
  let updatestr = { lastTime: new Date().getTime() };
  friend.updateMany(wherestr, updatestr, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

//添加一对一消息表
exports.insertMsg = function (uid, fid, msg, type, res) {
  if (type == 2 || type == 3) {
    msg = JSON.stringify(msg);
  }
  let obj = {
    userid: uid,
    friendid: fid,
    message: msg,
    types: type,
    createTime: new Date().getTime(),
    state: 1,
  };
  message.insertMany(obj, (err, result) => {
    if (err) {
      if (res) {
        res.send({ status: 500 });
      }
      return;
    } else {
      if (res) {
        res.send({ status: 200, message: "发送成功" });
      }
    }
  });
};

//群最后通讯时间
exports.upGroupLast = function (uid, gid, res) {
  let wherestr = { userid: uid, groupid: gid };
  let updatestr = { lastTime: new Date().getTime() };
  groupUser.updateMany(wherestr, updatestr, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

//添加群消息
exports.insertGroupMsg = function (uid, gid, msg, type, res) {
  if (type == 2 || type == 3) {
    msg = JSON.stringify(msg);
  }
  let obj = {
    userid: uid,
    groupid: gid,
    message: msg,
    types: type,
    createTime: new Date().getTime(),
  };
  groupMessage.insertMany(obj, (err, result) => {
    if (err) {
      if (res) {
        res.send({ status: 500 });
      }
      return;
    } else {
      if (res) {
        res.send({ status: 200, message: "发送成功" });
      }
    }
  });
};

//好友申请
exports.applyFriend = function (data, res) {
  //判断是否已经申请过
  let wherestr = { userid: data.uid, friendid: data.fid };
  friend.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
      return;
    } else {
      //如果result为0则是初次申请
      if (result == 0) {
        this.buildFriend(data.fid, data.uid, 1);
        this.buildFriend(data.uid, data.fid, 2);
      } else {
        //已经申请
        this.upFriendLast(data.uid, data.fid);
      }
      //添加消息
      this.insertMsg(data.uid, data.fid, data.msg, 0, res);
    }
  });
};

//更新好友状态（同意好友）
exports.updateFriendState = function (data, res) {
  let wherestr = {
    $or: [
      { userid: data.uid, friendid: data.fid },
      { userid: data.fid, friendid: data.uid },
    ],
  };
  let updatestr = { state: 0 };
  friend.updateMany(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
      return;
    } else {
      res.send({ status: 200 });
    }
  });
};

//（拒绝，删除好友）
exports.deleteFriend = function (data, res) {
  // console.log(data);
  let wherestr = {
    $or: [
      { userid: data.uid, friendid: data.fid },
      { userid: data.fid, friendid: data.uid },
    ],
  };
  friend.deleteMany(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
      return;
    } else {
      res.send({ status: 200 });
    }
  });
};

//按要求获取用户列表
exports.getUsers = function (uid, state, res) {
  let query = friend.find({});
  query.where({ userid: uid, state });
  //查找friendid关联的user对象
  query.populate("friendid");
  //排序方式，最后通讯时间倒叙
  query.sort({ lastTime: -1 });
  //查询结果
  query
    .exec()
    .then((e) => {
      let result = e.map((item) => {
        // console.log(item)
        return {
          id: item.friendid._id,
          name: item.friendid.name,
          markname: item.markname,
          lastTime: item.lastTime,
          avatar: item.friendid.avatar,
          type: 0,
        };
      });
      // console.log(result)
      res.send({ status: 200, result });
    })
    .catch(() => {
      res.send({ status: 500 });
    });
};

//按要求获取一条一对一消息
exports.getOneMsg = function (data, res) {
  let query = message.findOne({});
  query.where({
    $or: [
      { userid: data.uid, friendid: data.fid },
      { userid: data.fid, friendid: data.uid },
    ],
  });
  //排序方式
  query.sort({ createTime: -1 });
  //查询结果
  query
    .exec()
    .then((e) => {
      let result = {
        message: e.message,
        createTime: e.createTime,
        types: e.types,
      };
      // console.log(result)
      res.send({ status: 200, result });
    })
    .catch(() => {
      res.send({ status: 500 });
    });
};

//汇总一对一消息未读数
exports.unReadMsg = function (data, res) {
  //汇总条件 相反 应该看对方发过来的
  let wherestr = { userid: data.fid, friendid: data.uid, state: 1 };
  message.countDocuments(wherestr, (err, result) => {
    // console.log(result)
    if (err) {
      res.send({ status: 500 });
      return;
    } else {
      res.send({ status: 200, result });
    }
  });
};

//一对一消息状态修改(已读)
exports.updateMsg = function (data, res) {
  //查询条件
  let wherestr = {
    $or: [
      { userid: data.uid, friendid: data.fid, state: 1 },
      { userid: data.fid, friendid: data.uid, state: 1 },
    ],
  };
  //修改内容
  let updatestr = { state: 0 };
  message.updateMany(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
      return;
    } else {
      res.send({ status: 200 });
    }
  });
};

//建群
exports.createGroup = async function (data, res) {
  let groupData = {
    userid: data.uid,
    name: data.name,
    createTime: new Date().getTime(),
    avatar: data.avatar,
  };
  //使用save时可以返回数据
  let groups = new group(groupData);
  let result = await groups.save();
  //添加好友入群
  data.user.map((uid) => {
    let fobj = {
      groupid: result._id,
      userid: uid,
      createTime: new Date().getTime(),
      lastTime: new Date().getTime(),
    };
    this.insertGroupUser(fobj);
  });
  res.send({ status: 200 });
};
//添加群成员
exports.insertGroupUser = function (data, res) {
  groupUser.insertMany(data, (err, result) => {
    // console.log(result)
    if (res) {
      if (err) {
        res.send({ status: 500 });
      } else {
        res.send({ status: 200 });
      }
    }
  });
};
//删除群成员
exports.deleteGroupUser = function (data, res) {
  groupUser.deleteMany(
    { userid: data.uid, groupid: data.gid },
    (err, result) => {
      if (err) {
        res.send({ status: 500 });
        return;
      } else {
        res.send({ status: 200 });
      }
    }
  );
};

//解散群聊
exports.deleteGroup = async function (data, res) {
  await groupUser.deleteMany({ groupid: data.gid });
  await group.deleteMany({ userid: data.uid });
  await groupMessage.deleteMany({ groupid: data.gid });
  res.send({ status: 200 });
};

//获取群详情
exports.getGroupDetail = function (gid, res) {
  group.findOne({ _id: gid }, (err, result) => {
    // console.log(result)
    if (res) {
      if (err) {
        res.send({ status: 500 });
      } else {
        res.send({ status: 200, result });
      }
    }
  });
};

//修改群信息
exports.updateGroupDetail = function (data, res) {
  let updateObj = {};
  updateObj[data.type] = data.data;
  group.updateMany({ _id: data.gid }, updateObj, (err, result) => {
    // console.log(result)
    if (res) {
      if (err) {
        res.send({ status: 500 });
      } else {
        res.send({ status: 200 });
      }
    }
  });
};

//获取群内名称
exports.getGroupName = function (data, res) {
  groupUser.findOne({ userid: data.uid, groupid: data.gid }, (err, result) => {
    // console.log(result)
    if (res) {
      if (err) {
        res.send({ status: 500 });
      } else {
        res.send({ status: 200, result });
      }
    }
  });
};

//修改群内名称
exports.updateGroupName = function (data, res) {
  groupUser.updateMany(
    { userid: data.uid, groupid: data.gid },
    { name: data.name },
    (err, result) => {
      // console.log(result)
      if (res) {
        if (err) {
          res.send({ status: 500 });
        } else {
          res.send({ status: 200 });
        }
      }
    }
  );
};

//获取群成员
exports.getGroupUsers = function (gid, uid, res) {
  let query = groupUser.find({});
  query.where({ groupid: gid });
  //查找userid关联的user对象
  query.populate("userid");
  //查询结果
  query
    .exec()
    .then(async (e) => {
      let result = e.map((item) => {
        // console.log(item)
        return {
          uid: item.userid._id,
          gid: item.groupid,
          name: item.userid.name,
          lastTime: item.lastTime,
          avatar: item.userid.avatar,
        };
      });

      //获取好友并匹配好友昵称
      let users = await friend.find({ userid: uid, state: 0 });
      let brr = [];
      result.forEach((item) => {
        users.forEach((item2) => {
          if (item2.friendid.toString() == item.uid.toString()) {
            item.markname = item2.markname;
          }
          brr.push(item);
        });
      });
      //去重 也可以不用去重直接使用result因为里面的值已替换
      brr = Array.from(new Set(brr));
      res.send({ status: 200, result: brr });
    })
    .catch(() => {
      res.send({ status: 500 });
    });
};

//按要求获取群列表
exports.getGroup = function (uid, res) {
  let query = groupUser.find({});
  query.where({ userid: uid });
  //查找groupid关联的user对象
  query.populate("groupid");
  //排序方式
  query.sort({ lastTime: -1 });
  //查询结果
  query
    .exec()
    .then((e) => {
      let result = e.map((item) => {
        // console.log(item)
        return {
          id: item.groupid._id,
          name: item.groupid.name,
          markname: item.name,
          lastTime: item.lastTime,
          avatar: item.groupid.avatar,
          tip: item.tip,
          type: 1,
        };
      });
      // console.log(result)
      res.send({ status: 200, result });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: 500 });
    });
};

//按要求获取一条群消息
exports.getOneGroupMsg = function (gid, res) {
  let query = groupMessage.findOne({});
  query.where({ groupid: gid });
  //查找userid关联的user对象
  query.populate("userid");
  //排序方式
  query.sort({ createTime: -1 });
  //查询结果
  query
    .exec()
    .then((e) => {
      let result = {
        message: e.message,
        createTime: e.createTime,
        types: e.types,
        name: e.userid.name,
      };
      // console.log(result)
      res.send({ status: 200, result });
    })
    .catch(() => {
      res.send({ status: 500 });
    });
};

//群消息状态修改(已读)
exports.updateGroupMsg = function (data, res) {
  //查询条件
  let wherestr = { userid: data.uid, groupid: data.gid };
  //修改内容
  let updatestr = { tip: data.tip };
  groupUser.updateOne(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
      return;
    } else {
      res.send({ status: 200 });
    }
  });
};

//消息操作
//分页获取一对一聊天数据
exports.msg = function (data, res) {
  //data uid fid nowPage ,pageSize
  let skipNum = data.nowPage * data.pageSize;
  let query = message.find({});
  query.where({
    $or: [
      { userid: data.uid, friendid: data.fid },
      { userid: data.fid, friendid: data.uid },
    ],
  });
  //排序方式
  query.sort({ createTime: -1 });
  //查找userid关联的user对象
  query.populate("userid");
  //跳过条数
  query.skip(skipNum);
  //每页条数
  query.limit(data.pageSize);
  //查询结果
  query
    .exec()
    .then((e) => {
      let result = e.map((item) => {
        // console.log(item)
        return {
          id: item._id,
          message: item.message,
          types: item.types,
          createTime: item.createTime,
          fromid: item.userid._id,
          avatar: item.userid.avatar,
        };
      });
      // console.log(result)
      res.send({ status: 200, result });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: 500 });
    });
};

//消息操作
//分页获取群聊天数据
exports.grouMsg = function (data, res) {
  //data uid fid nowPage ,pageSize
  let skipNum = data.nowPage * data.pageSize;
  let query = groupMessage.find({});
  query.where({ groupid: data.gid });

  //排序方式
  query.sort({ createTime: -1 });
  //查找userid关联的user对象
  query.populate("userid");
  //跳过条数
  query.skip(skipNum);
  //每页条数
  query.limit(data.pageSize);
  //查询结果
  query
    .exec()
    .then(async (e) => {
      let result = e.map((item) => {
        // console.log(item)
        return {
          id: item._id,
          message: item.message,
          types: item.types,
          createTime: item.createTime,
          fromid: item.userid._id,
          avatar: item.userid.avatar,
          name: item.userid.name,
        };
      });

      //获取好友并匹配好友昵称
      let users = await friend.find({ userid: data.uid, state: 0 });
      result.forEach((item) => {
        users.forEach((item2) => {
          if (item2.friendid.toString() == item.fromid.toString()) {
            item.markname = item2.markname;
          }
        });
      });

      //获取群内名称
      let groupUsers = await groupUser.find({ groupid: data.gid });
      result.forEach((item) => {
        groupUsers.forEach((item2) => {
          console.log(item.fromid.toString(), item2.userid.toString())
          if (item.fromid.toString() == item2.userid.toString()) {
            item.groupUserName = item2.name;
          }
        });
      });
      res.send({ status: 200, result });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: 500 });
    });
};
