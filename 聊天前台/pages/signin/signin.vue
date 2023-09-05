<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-right" @tap="toRegister"><view class="text">注册</view></view>
		</view>

		<view class="logo"><image src="../../static/images/index/logo.png"></image></view>

		<view class="main">
			<view class="title">登录</view>
			<view class="slogin">您好,欢迎来到 yike!</view>
			<view class="inputs">
				<input v-model="user" class="user" type="text" placeholder="用户名/邮箱" placeholder-style="color:#aaa;font-weight:400" />
				<input v-model="pwd" class="pwd" type="password" placeholder="密码" placeholder-style="color:#aaa;font-weight:400" />
			</view>
			<view v-if="iserror" class="tips">用户名或密码错误!</view>
			<view v-if="iswarn" class="tips">用户名和密码不能为空</view>
		</view>

		<view @tap="submit" class="submit">登录</view>
		<view class="forget" @tap="toForget">
			<text>忘记密码</text>
		</view>
	</view>
</template>

<script>
import { login } from '../../api/index.js';
export default {
	data() {
		return {
			user: '',
			pwd: '',
			iserror: false,
			iswarn: false
		};
	},
	onLoad(e) {
		if(e.name){
			this.user=e.name
		}
	},
	onShow() {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarBackground('#FFFFFF');
		// #endif
	},
	methods: {
		//跳转注册页面
		toRegister() {
			uni.navigateTo({
				url: '../signup/signup'
			});
		},
		//跳转到忘记密码页面
		toForget(){
			uni.navigateTo({
				url: '../forgetPassword/forgetPassword'
			});
		},
		//登录
		submit() {
			if (this.user != '' && this.pwd != '') {
				this.iswarn = false;
				login('/sigin', { name: this.user, pwd: this.pwd }).then(res => {
					// console.log(res);
					if (res.status === 200) {
						uni.setStorageSync('token', res.obj.token);
						uni.setStorageSync('userid', res.obj.id);
						uni.setStorageSync('name', res.obj.name);
						uni.showToast({
							title: '登录成功',
							duration: 1000
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '../index/index'
							});
						}, 1000);
					}else{
						uni.showToast({
							title: '账号或密码错误',
							duration: 1000
						});
					}
				});
			} else {
				this.iswarn = true;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../commons/css/mycss.scss';
.content {
	padding-top: var(--status-bar-height);
}
.top-bar {
	border-bottom: 1px solid $uni-border-color;
	.top-bar-right {
		padding-right: 32rpx;
		float: right;
		.text {
			font-size: $uni-font-size-lg;
			font-family: PingFangSC-Medium;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 88rpx;
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
	.slogin {
		font-size: 40rpx;
		color: $uni-text-color-grey;
		line-height: 56rpx;
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
	.tips {
		float: left;
		font-size: $uni-font-size-lg;
		line-height: 56rpx;
		color: $uni-color-warning;
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
.forget{
	text-align: center;
	margin-top: 20rpx;
	color: blue;
}
</style>
