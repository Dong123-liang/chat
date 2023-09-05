//服务器地址
// 本地
// let server = 'http://localhost:3000/v1/index'
// let serverFile='http://localhost:3000/v1/files'

//本地ip 使用模拟器时必须使用本地ip不能使用localhost 有线ip
 let server = 'http://172.16.9.207:3000/v1/index'
 let serverFile='http://172.16.9.207:3000/v1/files'
 //无线ip
 // let server = 'http://192.168.0.102:3000/v1/index'
 // let serverFile='http://192.168.0.102:3000/v1/files'
 
// 腾讯云
// let server = 'http://114.132.42.191:3500/v1/index'
// let serverFile = 'http://114.132.42.191:3500/v1/files'

//校验token
export function judgeToken(url) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'get',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//忘记密码
export function forgetPassword(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'POST',
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}


//登录
export function login(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'POST',
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}
//用户名是否被占用
export function isHaveName(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'get',
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//邮箱是否被占用
export function isHaveEmail(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'get',
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}


//注册
export function submit(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'POST',
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//搜索用户
export function searchUser(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'get',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}
//用户详情
export function userDetail(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'get',
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//用户修改
export function userUpdate(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//判断是否为好友
export function isFriend(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取好友昵称
export function getMarkname(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//修改好友昵称
export function friendMarkName(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//发送好友请求
export function sendFriendRequest(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//删除好友
export function deleteFriend(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取好友列表
export function getUsers(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//建群
export function createGroup(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取群列表
export function getGroup(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取最后一条消息
export function getOneMsg(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取一对一聊天消息
export function msg(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取群最后一条消息
export function getOneGroupMsg(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}
//获取群消息
export function groupMsg(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//修改群未读消息数
export function updateGroupMsg(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//修改一对一未读消息状态
export function updateMsg(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取群详情
export function getGroupDetail(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取群成员
export function getGroupUsers(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}
//添加群成员
export function insertGroupUser(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//删除群成员
export function deleteGroupUser(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//解散群聊
export function deleteGroup(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//修改群信息
export function updateGroupDetail(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//获取群内名称
export function getGroupName(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//修改群内名称
export function updateGroupName(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}


//未读消息数
export function unReadMsg(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}

//同意好友申请
export function updateFriendState(url, data) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'post',
			header: {
				Authorization: uni.getStorageSync('token')
			},
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
}


//发送邮件
export function sendEmail(url, data) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: server + url,
			method: 'get',
			data: data,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {}
		})
	})
}

//文件上传
export function uploadFile(url, file,data,type) {
	uni.showLoading({
		title: "加载中"
	})
	return new Promise((resolve,reject) => {
		uni.uploadFile({
			url: serverFile + url,
			header: {
				Authorization: uni.getStorageSync('token')
			},
			filePath: file,
			name: 'file',
			fileType:type,
			formData: data,
			success: uploadFileRes => {
				resolve(uploadFileRes.data)
			},
			fail: err => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		});
	})
}

