<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/common/back.png" class="back-img"></image></view>
			<view class="top-bar-right" v-if="relation==0 || relation==1" @tap="toUserDetail">
				<view class="more-img"><image src="../../static/images/userhome/more.png" mode=""></image></view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-bai" :animation="animationData4"></view>
			<image :src="$host.host+user.avatar" class="bg-img" mode="aspectFill"></image>
		</view>

		<view class="main">
			<view class="user-header">
				<view class="sex" :animation="animationData3" :style="{ background: sexcolor }">
					<image v-if="user.sex=='0'" src="../../static/images/userhome/woman.png" mode=""></image>
					<image v-if="user.sex=='1'" src="../../static/images/userhome/man.png" mode=""></image>
					<image v-if="user.sex=='2'" src="../../static/images/userhome/sex.png" mode=""></image>
				</view>
				<image :src="$host.host+user.avatar" class="user-img" :animation="animationData2"></image>
			</view>
			<view class="user-imf">
				<view class="name">{{ user.name }}</view>
				<view class="nick">{{markname ? `备注:${markname}`:'' }}</view>
				<view class="intr">{{ user.explain ? user.explain:'这个人很懒，什么也没留下' }}</view>
			</view>
		</view>

		<view class="bottom-bar">
			<view class="bottom-btn"  v-if="relation==1" @tap="toChatroom">发消息</view>
			<view class="bottom-btn" @tap="addFriend" v-if="relation==2">加为好友</view>
		</view>

		<view class="add-misg" :style="{ height: addHeight + 'px', bottom: -addHeight + 'px' }" :animation="animationData">
			<view class="name">{{ user.name }}</view>
			<textarea v-model="msgs" maxlength="120" class="add-main" />
		</view>
		<view class="add-bt" :animation="animationData1">
			<view class="close" @tap="addFriendAnimate">取消</view>
			<view class="send" @tap="confirm">发送</view>
		</view>
	</view>
</template>

<script>
import { userDetail,isFriend,getMarkname,sendFriendRequest} from '../../api/index.js';
export default {
	data() {
		return {
			sexcolor: 'rgba(197, 202, 252, 1.0)',
			animationData: {}, //动画
			animationData1: {}, //动画
			animationData2: {}, //动画
			animationData3: {}, //动画
			animationData4: {}, //动画
			isAdd: false,
			id:'',//用户点击头像传进来的id
			uid:uni.getStorageSync('userid'),//缓存里的id
			relation:'',//关系 0表示自己 1表示好友 2表示陌生人
			addHeight: 1000,
			myname: uni.getStorageSync('name'),
			markname:'',//备注
			user: {
				name: '',//名字
				explain: '',//签名
				avatar:'user.jpg',//头像
			},
			msgs:'',
		};
	},
	mounted() {
		this.getElements();
		this.getUserDetail()
		this.judgeFriend()
		this.getMarkname()
	},
	onLoad(options) {
		this.id=options.id
	},
	onShow() {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarBackground('#00FFFFFF');
		// #endif
	},
	methods: {
		//返回
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		//获取用户信息
		getUserDetail() {
			userDetail('/userDetail',{id:this.id}).then(res => {
				if(res.status==200){
					this.user = res.data;
					if(res.data.sex==0){
						this.sexcolor='rgba(255,93,91,1)'
					}else if(res.data.sex==1){
						this.sexcolor='rgba(87,153,255,1)'
					}else{
						this.sexcolor='rgba(197, 202, 252, 1.0)'
					}
				}else{
					uni.showToast({
						title: '获取用户信息失败',
						duration: 2000
					});
				}
				// console.log(res);
			});
		},
		//前往聊天页面
		toChatroom() {
			let avatar=this.$host.host+this.user.avatar
			let id=this.user._id
			let name=this.user.name
			uni.navigateTo({
				url: `../chatroom/chatroom?id=${id}&name=${name}&avatar=${avatar}&type=0`
			});
		},
		//判断用户关系
		judgeFriend(){
			if(this.id==this.uid){
				this.relation=0
			}else{
				isFriend('/isFriend',{uid:this.uid,fid:this.id}).then(res=>{
					// console.log(res)
					//如果是好友
					if(res.status==200){
						this.relation=1
					}else if(res.status==404){
						this.relation=2
					}
				})
			}
		},
		//获取好友昵称
		getMarkname(){
			getMarkname('/getMarkName',{uid:this.uid,fid:this.id}).then(res=>{
				if(res.status==200){
					// console.log(res)
					if(res.result){
						this.markname=res.result.markname
					}
				}
			})
		},
		addFriend(){
			this.msgs='我是' + this.myname
			this.addFriendAnimate()
		},
		//发送好友请求
		confirm(){
			if(this.msg!==""){
				sendFriendRequest('/applyFriend',{uid:this.uid,fid:this.id,msg:this.msg}).then(res=>{
					console.log(res)
					if(res.status==200){
						uni.showToast({
							title:'发送成功',
							duration:2000
						})
						this.addFriendAnimate()
					}
				})
			}
		},
		//获取高度
		getElements() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.bg')
				.boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					// console.log("节点离页面顶部的距离为" + data.top);
					this.addHeight = data.height - 186;
				})
				.exec();
		},
		//添加好友动画
		addFriendAnimate() {
			this.isAdd = !this.isAdd;
			var animation = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease'
			});
			var animation1 = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease'
			});
			var animation2 = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease'
			});
			var animation3 = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease'
			});
			var animation4 = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease'
			});
			if (this.isAdd) {
				// #ifdef APP-PLUS
				plus.navigator.setStatusBarBackground('#FFE431');
				// #endif
				animation.bottom(0).step();
				animation1.bottom(0).step();
				animation2
					.width(120)
					.height(120)
					.step();
				animation3.opacity(0).step();
				animation4.backgroundColor('rgba(255,228,49,0.6)').step();
			} else {
				// #ifdef APP-PLUS
				plus.navigator.setStatusBarBackground('#00FFFFFF');
				// #endif
				animation.bottom(-this.addHeight).step();
				animation1.bottom(-200).step();
				animation2
					.width()
					.height()
					.step();
				animation3.opacity(1).step();
				animation4.backgroundColor('rgba(255,228,49,0)').step();
			}

			this.animationData = animation.export();
			this.animationData1 = animation1.export();
			this.animationData2 = animation2.export();
			this.animationData3 = animation3.export();
			this.animationData4 = animation4.export();
		},
		//跳转到用户详情页
		toUserDetail(){
			uni.navigateTo({
				url:'../userdetails/userdetails?id='+this.id
			})
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../commons/css/mycss.scss';
.top-bar {
	background-color: transparent;
	.top-bar-left {
		float: left;
		width: 88rpx;
		.back-img {
			height: 46rpx;
			width: 46rpx;
			margin-left: 21rpx;
			padding-top: 16rpx;
		}
	}
	.top-bar-right {
		position: absolute;
		top: 10;
		right: 20rpx;
		.more-img {
			height: 88rpx;
			padding-top: 10rpx;
			padding-right: 32rpx;
			image {
				width: 52rpx;
				height: 12rpx;
			}
		}
	}
}
.bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -2;
	.bg-bai {
		width: 100%;
		height: 100%;
		// background-color: #eee;
	}
	.bg-img {
		z-index: -1;
		position: absolute;
		left: -10rpx;
		top: -10rpx;
		filter: blur(16px);
		width: 110%;
		height: 110%;
		opacity: 0.4;
	}
}
.main {
	padding-top: 230rpx;
	text-align: center;
	.user-header {
		position: relative;
		margin: 0 auto;
		width: 412rpx;
		height: 412rpx;
		.sex {
			position: absolute;
			bottom: 22rpx;
			right: 22rpx;
			width: 32px;
			height: 32px;
			z-index: 11;
			border-radius: 36px;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 32rpx;
				height: 32rpx;
			}
		}
		.user-img {
			z-index: 10;
			box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39, 40, 50, 0.1);
			width: 400rpx;
			height: 400rpx;
			border-radius: 48rpx;
			border: 6rpx solid rgba(255, 255, 255, 1);
		}
	}

	.user-imf {
		padding-top: 42rpx;
		.name {
			color: $uni-text-color;
			font-size: 52rpx;
			line-height: 74rpx;
		}
		.nick {
			font-size: $uni-font-size-base;
			line-height: 40rpx;
			color: $uni-text-color;
		}
		.intr {
			padding: 20rpx 120rpx;
			font-size: $uni-font-size-base;
			font-weight: 300;
			color: $uni-text-color;
			line-height: 48rpx;
		}
	}
}

.bottom-bar {
	position: fixed;
	width: 100%;
	bottom: 0;
	height: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	// background-color: #eee;
	.bottom-btn {
		width: 684rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background-color: $uni-color-primary;
		border-radius: $uni-border-radius-sm;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		font-weight: 500;
	}
}

.add-misg {
	position: fixed;
	padding: 0 56rpx;
	box-sizing: border-box;
	width: 100%;
	background: rgba(255, 255, 255, 1);
	border-radius: 40rpx 40rpx 0 0;
	.name {
		padding: 168rpx 0 40rpx;
		font-size: 52rpx;
		color: $uni-text-color;
		line-height: 74rpx;
	}
	.add-main {
		padding: 18rpx 22rpx;
		width: 100%;
		box-sizing: border-box;
		height: 420rpx;
		background: $uni-bg-color-grey;
		font-size: $uni-font-size-lg;
		border-radius: $uni-border-radius-base;
		color: $uni-text-color;
		line-height: 44rpx;
	}
}

.add-bt {
	position: fixed;
	width: 100%;
	z-index: 100;
	bottom: -200rpx;
	height: 104rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
	.close,
	.send {
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background-color: $uni-color-primary;
		border-radius: $uni-border-radius-sm;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		font-weight: 500;
	}
	.close {
		width: 172rpx;
		background: #eee;
	}
	.send {
		margin-left: 20px;
		width: 300rpx;
	}
}
</style>
