<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/common/back.png" class="back-img"></image></view>
		</view>

		<view class="logo"><image src="../../static/images/index/logo.png"></image></view>

		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input :value="user" @blur="isUser" @input="getUser" class="user" type="text" placeholder="请输入用户名" placeholder-style="color:#aaa;font-weight:400" />
					<view class="employ" v-if="isUserEmploy">已占用</view>
					<image src="../../static/images/sign/right.png" class="ok" v-if="isuser"></image>
				</view>
				<view class="inputs-div">
					<input @blur="isEmail" :value="email" @input="getEmail" class="email" type="text" placeholder="请输入邮箱" placeholder-style="color:#aaa;font-weight:400" />
					<view class="employ" v-if="isEmailEmploy">已占用</view>
					<view class="invalid" v-if="isinvalid">邮箱无效</view>
					<image src="../../static/images/sign/right.png" class="ok" v-if="isemail"></image>
				</view>
				<view class="inputs-div">
					<input  @blur="isPwd" :value="pwd" @input="getPwd" class="pwd" :type="type" placeholder="请输入密码" placeholder-style="color:#aaa;font-weight:400" />
					<image @tap="looks" :src="lookurl" class="look"></image>
					<view class="ispwd" v-if="isp">至少输入5位密码</view>
				</view>
				<view class="inputs-div">
					<input @input="isYzm" v-model="yzm" class="yzm" placeholder="请输入验证码" placeholder-style="color:#aaa;font-weight:400" />
					<button :disabled="disabled" class="yzm-button" @tap="send">{{tip}}</button>
				</view>
			</view>
		</view>

		<view @tap="submit" :class="[{ submit: isok }, { submit1: !isok }]">注册</view>
	</view>
</template>

<script>
import { isHaveEmail, isHaveName, submit, sendEmail } from '../../api/index.js';
export default {
	data() {
		return {
			type: 'password',
			isuser: false, //显示√图片
			isemail: false, //显示√图片
			islook: false, //是否显示密码
			isinvalid: false, //提示邮箱是否有效
			isUserEmploy: false, //用户被占用
			isEmailEmploy: false, //邮箱被占用
			isp: false, //密码长度小于5显示
			lookurl: '../../static/images/sign/biyan.png',
			email: '',
			user: '',
			pwd: '',
			yzm: '',
			disabled:true,
			tip:'获取验证码',
			isok: false, //注册按钮样式
			timer:null,
		};
	},
	beforeDestroy() {
		clearInterval(this.timer)
	},
	onShow() {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarBackground('#FFFFFF');
		// #endif
	},
	methods: {
		//返回
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		//密码显示隐藏
		looks() {
			if (this.islook) {
				this.type = 'password';
				this.islook = !this.islook;
				this.lookurl = '../../static/images/sign/biyan.png';
			} else {
				this.type = 'text';
				this.islook = !this.islook;
				this.lookurl = '../../static/images/sign/look.png';
			}
		},
		//判断用户名是否可用
		isUser() {
			if (this.user.length > 0) {
				isHaveName('/isUserName', { name: this.user }).then(res => {
					if (res.status == 200) {
						this.isuser = true;
						this.isUserEmploy = false;
					} else {
						this.isUserEmploy = true;
						this.isuser = false;
					}
				});
			} else {
				this.isuser = false;
				this.isUserEmploy = false;
			}
		},
		//判断邮箱格式
		isEmail() {
			let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if (this.email.length > 0) {
				if (reg.test(this.email)) {
					this.isinvalid = false;
					this.disabled=false
					isHaveEmail('/isUserEmail', { email: this.email }).then(res => {
						if (res.status == 200) {
							this.isemail = true;
							this.isEmailEmploy = false;
							this.disabled=false
						} else {
							this.isEmailEmploy = true;
							this.isemail = false;
							this.disabled=true
						}
					});

					// console.log(this.email)
				} else {
					this.isinvalid = true;
					this.isEmailEmploy = false;
					this.isemail=false
					this.disabled=true
				}
			} else {
				this.isinvalid = false;
				this.isemail = false;
				this.isEmailEmploy = false;
			}
		},
		//密码长度要大于5
		isPwd() {
			if (this.pwd.length > 0) {
				if (this.pwd.length > 5) {
					this.isp = false;
				} else {
					this.isp = true;
				}
			} else {
				this.isp = false;
			}
		},
		isYzm(){
			this.isReg()
		},
		//获取用户名
		getUser(e) {
			this.user = e.detail.value;
			this.isReg();
		},
		//获取邮箱
		getEmail(e) {
			this.email = e.detail.value;
			this.isReg();
		},
		//获取密码
		getPwd(e) {
			this.pwd = e.detail.value;
			this.isReg();
		},
		// 是否可注册
		isReg() {
			if (this.isuser && this.isemail && this.yzm!="" && this.pwd.length > 5) {
				console.log(1);
				this.isok = true;
			} else {
				this.isok = false;
			}
		},

		//点击发送验证码
		send() {
			sendEmail('/mail',{email:this.email,type:2}).then(res=>{
				if(res.status==200){
					uni.showToast({
						title: '发送成功',
						duration: 1000
					});
				}else{
					uni.showToast({
						title: '服务器出错',
						duration: 1000
					});
				}
			})
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
			that.timer= setInterval(function() {
				subs();
			}, 1000);
		},
		//注册
		submit() {
			if (this.user != '' && this.email != '' && this.pwd != '') {
				submit('/register', { email: this.email, name: this.user, pwd: this.pwd,verify:this.yzm }).then(res => {
					if (res.status == 200) {
						uni.showToast({
							title: '注册成功',
							duration: 1000
						});
						sendEmail('/mail', { email: this.email, type: 1 });
						setTimeout(() => {
							uni.navigateTo({
								url: `../signin/signin?name=${this.user}`
							});
						}, 1000);
					}else if(res.status == 400){
						uni.showToast({
							title: '验证码错误',
							duration: 2000
						});
					}
				});
			} else {
				uni.showToast({
					title: '不能为空',
					duration: 2000
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding-top: var(--status-bar-height);
}
.top-bar {
	.top-bar-left {
		float: left;
		width: 88rpx;
		// background-color: red;
		.back-img {
			height: 46rpx;
			width: 46rpx;
			margin-left: 21rpx;
			padding-top: 16rpx;
		}
	}
}
.logo {
	text-align: center;
	image {
		padding-top: 256rpx;
		width: 194rpx;
		height: 92rpx;
	}
}
.main {
	padding: 54rpx $uni-font-size-lg 120rpx;
	.title {
		font-size: 56rpx;
		font-weight: bold;
		color: $uni-text-color;
		line-height: 88rpx;
	}
	.inputs {
		padding-top: 48rpx;
		input {
			padding-top: 8rpx;
			height: 88rpx;
			font-size: $uni-font-size-lg;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 88rpx;
			border-bottom: 1px solid $uni-border-color;
		}
	}
	.inputs-div {
		position: relative;
		.employ,
		.invalid {
			font-size: $uni-font-size-base;
			position: absolute;
			right: 0;
			top: 40rpx;
			font-weight: 500;
			color: $uni-color-warning;
		}
		.ok {
			width: 38rpx;
			height: 30rpx;
			position: absolute;
			top: 56rpx;
			right: 0;
		}
		.look {
			width: 32rpx;
			height: 30rpx;
			position: absolute;
			top: 56rpx;
			right: 0;
		}
		.ispwd {
			color: red;
		}
		.yzm-button {
			position: absolute;
			right: 0;
			top: 10rpx;
			height: 80rpx;
			width: 300rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 20rpx;
			background-color: rgba(255, 228, 49, 0.4);
		}
	}
}
.submit {
	margin: 0 auto;
	width: 520rpx;
	height: 96rpx;
	background-color: $uni-color-primary;
	font-size: $uni-font-size-lg;
	box-shadow: 0 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
	border-radius: 48rpx;
	line-height: 96rpx;
	font-weight: 500;
	color: $uni-text-color;
	text-align: center;
}
.submit1 {
	margin: 0 auto;
	width: 520rpx;
	height: 96rpx;
	background-color: $uni-bg-color-hover;
	font-size: $uni-font-size-lg;
	border-radius: 48rpx;
	line-height: 96rpx;
	font-weight: 500;
	color: $uni-text-color-inverse;
	text-align: center;
}
</style>
