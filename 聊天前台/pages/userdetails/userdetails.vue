<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/common/back.png" class="back-img"></image></view>
			<view class="top-bar-center">详情</view>
			<view class="top-bar-right"></view>
		</view>

		<view class="main">
			<view class="column heads">
				<view class="low head">
					<view class="title">头像</view>
					<view class="content header-content" v-if="id == uid">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
					<!-- 不是自己  -->
					<image :src="$host.host + dataObj.avatar" v-if="id != uid" class="friend-img"></image>
				</view>

				<view v-if="id == uid" class="low" @tap="modify($event, '签名', dataObj.explain, false)">
					<view class="title">签名</view>
					<view class="content">{{ dataObj.explain }}</view>
					<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
				</view>

				<view class="low" v-if="id != uid">
					<view class="title">签名</view>
					<view class="content">{{ dataObj.explain ? dataObj.explain : '这个人很懒，什么也没留下' }}</view>
				</view>

				<view class="low">
					<view class="title">注册</view>
					<view class="content">{{ dateChange(dataObj.createTime) }}</view>
				</view>
			</view>

			<view class="column">
				<view v-if="id == uid" class="low" @tap="modify($event, '用户名', dataObj.name, false, false)">
					<view class="title">用户名</view>
					<view class="content">{{ dataObj.name }}</view>
					<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
				</view>

				<view v-if="id != uid" class="low">
					<view class="title">用户名</view>
					<view class="content">{{ dataObj.name }}</view>
				</view>

				<view v-if="id != uid" class="low" @tap="modify($event, '备注', markname, false, false)">
					<view class="title">备注</view>
					<view class="content">{{ markname }}</view>
					<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
				</view>

				<view class="low" v-if="id == uid">
					<view class="title">性别</view>
					<view class="content">
						<picker @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">{{ array[index] }}</view>
						</picker>
					</view>
					<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
				</view>

				<view class="low" v-if="id != uid">
					<view class="title">性别</view>
					<view class="content">
						<view class="uni-input">{{ array[index] }}</view>
					</view>
				</view>

				<view class="low" v-if="id == uid">
					<view class="title">生日</view>
					<view class="content">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{ date }}</view>
						</picker>
					</view>
					<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
				</view>

				<view class="low" v-if="id != uid">
					<view class="title">生日</view>
					<view class="content">
						<view class="uni-input">{{ date }}</view>
					</view>
				</view>

				<view v-if="id == uid" class="low" @tap="modify($event, '电话', dataObj.tel, false, false)">
					<view class="title">电话</view>
					<view class="content">{{ dataObj.tel }}</view>
					<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
				</view>

				<view class="low" v-if="id != uid">
					<view class="title">电话</view>
					<view class="content">{{ dataObj.tel }}</view>
				</view>

				<view v-if="id == uid" class="low" @tap="modify($event, '邮箱', dataObj.email, false, true)">
					<view class="title">邮箱</view>
					<view class="content">{{ dataObj.email }}</view>
					<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
				</view>

				<view v-if="id != uid" class="low">
					<view class="title">邮箱</view>
					<view class="content">{{ dataObj.email }}</view>
				</view>
			</view>

			<view class="column" v-if="id == uid">
				<view class="low" @tap="modify($event, '密码', dataObj.name, true, false)">
					<view class="title">密码</view>
					<view class="content">******</view>
					<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFill"></image></view>
				</view>
			</view>
		</view>

		<view v-if="id == uid" class="btn" @tap="logout">退出登录</view>
		<view v-if="id != uid" class="btn" @tap="deleteFriend">删除好友</view>

		<view class="modify" :style="{ bottom: -modifyHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">{{ modifyTitle }}</view>
				<view class="define" @tap="update">确定</view>
			</view>

			<view class="modify-main">
				<input v-if="ispwd" type="text" v-model="oldpwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa;font-weight:400" />
				<input v-if="ispwd" type="text" v-model="pwd" class="modify-pwd" placeholder="请输入新密码" placeholder-style="color:#aaa;font-weight:400" />
				<textarea v-if="!ispwd && !isemail" v-model="data" class="modify-content"></textarea>
				<view class="modify-email" v-if="isemail">
					<input @blur="isEmail" type="text" v-model="email" class="modify-pwd" placeholder="请输入邮箱" placeholder-style="color:#aaa;font-weight:400" />
					<view class="yzm-input">
						<input v-model="yzm" class="modify-pwd" placeholder="请输入验证码" placeholder-style="color:#aaa;font-weight:400" />
						<button :disabled="disabled" class="yzm-button" @tap="send">{{ tip }}</button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="isShowTip" class="msg-tip">{{ msgTip }}</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
import { nanoid } from 'nanoid';
import { dateChange } from '../../commons/js/myFun.js';
import { userDetail, userUpdate, isHaveEmail, sendEmail, getMarkname, friendMarkName, uploadFile, deleteFriend } from '../../api/index.js';
export default {
	components: {
		ImageCropper
	},
	beforeDestroy() {
		clearInterval(this.timer);
		clearInterval(this.timer1);
	},
	data() {
		return {
			cropFilePath: '../../static/images/img/OIP-C.jpg',
			tempFilePath: '',
			array: ['女', '男', '未知'],
			id: '',
			uid: uni.getStorageSync('userid'),
			index: 0,
			date: '1970-1-1',
			data: '修改的内容',
			oldpwd: '', //原密码
			pwd: '', //新密码
			email: '', //邮箱
			yzm: '', //验证码
			disabled: true,
			tip: '获取验证码',
			animationData: {},
			isModify: false,
			modifyHeight: 1000, //默认1000
			dataObj: {
				avatar: 'user.jpg',
				name: '',
				birth: '',
				tel: '',
				email: '',
				createTime: '',
				sex: ''
			},
			markname: '', //备注
			modifyTitle: '', //弹框标题
			ispwd: false, //是否为修改密码
			isemail: false,
			msgTip: '', //消息提示
			isShowTip: false
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	onShow() {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarBackground('#FFFFFF');
		// #endif
	},
	onLoad(options) {
		// console.log(options)
		this.id = options.id;
	},
	mounted() {
		this.getElements();
		this.getUserDetail();
		this.getMarkname();
	},
	methods: {
		//获取用户信息
		getUserDetail() {
			userDetail('/userDetail', { id: this.id }).then(res => {
				// console.log(res);
				if (res.status == 200) {
					this.dataObj = res.data;
					this.index = res.data.sex;
					this.cropFilePath = this.$host.host + res.data.avatar;
					if (res.data.birth) {
						this.date = res.data.birth;
					}
				} else {
					uni.showToast({
						title: '获取用户信息失败',
						duration: 2000
					});
				}
			});
		},
		//删除好友
		deleteFriend() {
			uni.showModal({
				title: '提示',
				content: '是否删除该好友',
				success:(res)=>{
					if (res.confirm) {
						deleteFriend('/deleteFriend', { uid: this.uid, fid: this.id }).then(res => {
							if (res.status == 200) {
								uni.showToast({
									title: '删除成功',
									duration: 2000
								});
								setTimeout(()=>{
									uni.navigateTo({
										url: '../index/index'
									});
								},2000)
							}
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//获取好友昵称
		getMarkname() {
			getMarkname('/getMarkName', { uid: this.uid, fid: this.id }).then(res => {
				if (res.status == 200) {
					// console.log(res)
					if (res.result) {
						this.markname = res.result.markname;
					}
				}
			});
		},
		//退出登录
		logout() {
			uni.showModal({
				title: '提示',
				content: '是否退出账号',
				success: function(res) {
					if (res.confirm) {
						uni.clearStorageSync();
						uni.navigateTo({
							url: '../signin/signin'
						});
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//返回
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		//时间处理
		dateChange(val) {
			return dateChange(val);
		},
		//性别选择
		bindPickerChange(e) {
			userUpdate('/userUpdate', { _id: this.uid, type: 'sex', data: e.detail.value }).then(res => {
				if (res.status === 200) {
					this.getUserDetail();
				}
			});
			this.index = e.detail.value;
		},
		//日期选择
		bindDateChange: function(e) {
			userUpdate('/userUpdate', { _id: this.uid, type: 'birth', data: e.detail.value }).then(res => {
				if (res.status === 200) {
					this.getUserDetail();
				}
			});
			this.date = e.detail.value;
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		upload() {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择,相机
				success: res => {
					this.tempFilePath = res.tempFilePaths.shift();
				}
			});
		},
		confirm(e) {
			this.tempFilePath = '';
			this.cropFilePath = e.detail.tempFilePath;
			// #ifdef APP-PLUS||MP
			// #endif
			//除了H5端返回base64数据外，其他端都是返回临时地址，所以你要判断base64还是临时文件名，（用条件编译APP-PLUS||MP执行编译。）
			//按我这里是先上传裁剪得来的临时文件地址然后得到临时文件名，
			//待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了
			uploadFile('/upload', this.cropFilePath, { name: nanoid(), url: 'user' }, 'image').then(res => {
				console.log(res);
				if (res) {
					userUpdate('/userUpdate', { _id: this.uid, type: 'avatar', data: res }).then(res => {
						if (res.status === 200) {
							this.getUserDetail();
							uni.showToast({
								title: '修改成功',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: '服务器异常',
								duration: 2000
							});
						}
					});
				}
			});
		},
		cancel() {
			console.log('canceled');
			this.tempFilePath = '';
		},

		//获取高度
		getElements() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.modify')
				.boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					// console.log("节点离页面顶部的距离为" + data.top);
					this.modifyHeight = data.height;
				})
				.exec();
		},

		//弹框动画
		modify(e, type, data, ispwd, isemail) {
			this.ispwd = ispwd;
			this.isemail = isemail;
			this.modifyTitle = type;
			this.data = data;
			this.email = data; //邮箱
			this.markname = data; //备注
			this.isModify = !this.isModify;
			var animation = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease'
			});
			if (this.isModify) {
				animation.bottom(0).step();
			} else {
				animation.bottom(-this.modifyHeight).step();
			}

			this.animationData = animation.export();
		},
		//判断邮箱格式
		isEmail() {
			let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if (this.email.length > 0) {
				if (reg.test(this.email)) {
					this.disabled = false;
					isHaveEmail('/isUserEmail', { email: this.email }).then(res => {
						if (res.status == 200) {
							this.disabled = false;
						} else {
							this.disabled = true;
							this.isShowMessage('邮箱已存在', 2);
						}
					});
				} else {
					this.isShowMessage('请输入正确的邮箱格式', 2);
					this.disabled = true;
				}
			}
		},
		isShowMessage(msg, date) {
			this.isShowTip = true;
			this.msgTip = msg;
			let time = date; //定义倒计时
			let that = this; //因为this在函数中指向window，所以定义that接收
			function subs() {
				time--;
				if (time === 0) {
					clearInterval(that.timer1);
					that.isShowTip = false;
				} else {
					that.isShowTip = true;
				}
			}
			//设置一个定时，一秒执行一次
			that.timer1 = setInterval(function() {
				subs();
			}, 1000);
		},
		//点击发送验证码
		send() {
			sendEmail('/mail', { email: this.email, type: 2 }).then(res => {
				if (res.status == 200) {
					this.isShowMessage('发送成功', 2);
				} else {
					this.isShowMessage('服务器出错', 2);
				}
			});
			let time = 60; //定义60秒的倒计时
			let that = this; //因为this在函数中指向window，所以定义that接收
			function subs() {
				time--;
				that.tip = `请${time}秒后再试`;
				if (time === 0) {
					clearInterval(that.timer);
					that.tip = `获取验证码`;
					that.disabled = false; //按键可用
				} else {
					that.disabled = true; //按键不可用
				}
			}
			//设置一个定时，一秒执行一次
			that.timer = setInterval(function() {
				subs();
			}, 1000);
		},
		//确定修改
		update() {
			if (this.modifyTitle === '签名') {
				userUpdate('/userUpdate', { _id: this.uid, type: 'explain', data: this.data }).then(res => {
					if (res.status === 200) {
						this.getUserDetail();
						this.modify();
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
					} else {
						this.isShowMessage('服务器出错', 2);
					}
				});
			} else if (this.modifyTitle === '用户名') {
				userUpdate('/userUpdate', { _id: this.uid, type: 'name', data: this.data }).then(res => {
					if (res.status === 200) {
						this.getUserDetail();
						this.modify();
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
					} else {
						this.isShowMessage('用户名已存在', 2);
					}
				});
			} else if (this.modifyTitle === '电话') {
				userUpdate('/userUpdate', { _id: this.uid, type: 'tel', data: this.data }).then(res => {
					if (res.status === 200) {
						this.getUserDetail();
						this.modify();
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
					} else {
						this.isShowMessage('服务器出错', 2);
					}
				});
			} else if (this.modifyTitle === '邮箱') {
				userUpdate('/userUpdate', { _id: this.uid, type: 'email', data: this.email, verify: this.yzm }).then(res => {
					if (res.status === 200) {
						this.getUserDetail();
						this.modify();
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
					} else if (res.status === 400) {
						this.isShowMessage('邮箱已存在', 2);
					} else if (res.status === 410) {
						this.isShowMessage('验证码错误', 2);
					} else {
						this.isShowMessage('服务器出错', 2);
					}
				});
			} else if (this.modifyTitle === '密码') {
				userUpdate('/userUpdate', { _id: this.uid, type: 'pwd', data: this.pwd, oldPass: this.oldpwd }).then(res => {
					if (res.status === 200) {
						uni.showToast({
							title: '用户状态发生变化,需重新登录',
							duration: 2000
						});

						setTimeout(() => {
							uni.clearStorage();
							uni.navigateTo({
								url: '../signin/signin'
							});
						}, 2000);
					}
				});
			} else if (this.modifyTitle === '备注') {
				friendMarkName('/friendMarkName', { fid: this.id, uid: this.uid, markname: this.data }).then(res => {
					if (res.status === 200) {
						this.getMarkname();
						this.modify();
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../commons/css/mycss.scss';
.top-bar {
	border-bottom: 1px solid $uni-border-color;
	.top-bar-left {
		float: left;
		width: 88rpx;
		.back-img {
			height: 46rpx;
			width: 46rpx;
			margin-left: 21rpx;
			padding-top: 25rpx;
		}
	}

	.top-bar-center {
		line-height: 88rpx;
		text-align: center;
	}

	.top-bar-right {
		padding-right: 14rpx;
		float: right;
	}
}

.main {
	padding-top: 118rpx;
	display: flex;
	flex-direction: column;
	.column {
		display: flex;
		flex-direction: column;
		padding-top: 12rpx;
		border-bottom: 1px solid $uni-border-color;
	}
	.low {
		display: flex;
		flex-direction: row;
	}
	.head {
		height: 148rpx;
		display: flex;
		align-items: center;
	}
	.title {
		flex: none;
		padding-left: $uni-spacing-col-base;
		font-size: $uni-font-size-lg;
		line-height: 112rpx;
		color: $uni-text-color;
	}
	.user-img {
		width: 104rpx;
		height: 104rpx;
		border-radius: 20rpx;
	}
	.friend-img {
		width: 104rpx;
		height: 104rpx;
		border-radius: 20rpx;
		margin-left: 50rpx;
	}
	.header-content {
		display: flex;
		align-items: center;
	}
	.content {
		flex: auto;
		padding: 0 $uni-spacing-col-base;
		font-size: $uni-font-size-lg;
		line-height: 112rpx;
		color: $uni-text-color-grey;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.more {
		flex: none;
		height: 112rpx;
		display: flex;
		align-items: center;
		image {
			width: 80rpx;
			height: 28rpx;
		}
	}
}
.btn {
	text-align: center;
	font-size: $uni-font-size-lg;
	color: $uni-color-warning;
	line-height: 88rpx;
	margin-top: 100rpx;
}

.modify {
	position: fixed;
	z-index: 1002;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #fff;
	.modify-header {
		width: 100%;
		height: 88rpx;
		margin-top: var(--status-bar-height);
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 1px solid $uni-border-color;
		.close {
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
		.title {
			font-size: 40rpx;
			color: $uni-text-color;
			line-height: 88rpx;
		}
		.define {
			font-size: $uni-font-size-lg;
			color: $uni-color-success;
			line-height: 88rpx;
		}
	}
	.modify-main {
		padding: 20rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.modify-pwd {
			width: 686rpx;
			padding: 16rpx 20rpx;
			margin-bottom: 40rpx;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 88rpx;
		}
		.modify-content {
			padding: 16rpx 20rpx;
			width: 686rpx;
			height: 386rpx;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}

		.modify-email {
			.yzm-input {
				position: relative;
			}
			.yzm-button {
				position: absolute;
				right: 10rpx;
				top: 8rpx;
				height: 60rpx;
				width: 300rpx;
				line-height: 60rpx;
				text-align: center;
				border-radius: 20rpx;
				background-color: rgba(255, 228, 49, 0.4);
			}
		}
	}
}
.msg-tip {
	background-color: rgba(86, 86, 86, 0.3);
	width: 400rpx;
	height: 300rpx;
	line-height: 300rpx;
	position: fixed;
	border-radius: 20rpx;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%); /*50%为自身尺寸的一半*/
	z-index: 9999;
	text-align: center;
	color: #fff;
}
</style>
