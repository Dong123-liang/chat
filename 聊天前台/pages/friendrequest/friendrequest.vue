<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/common/back.png" class="back-img"></image></view>
			<view class="top-bar-center">好友申请</view>
		</view>

		<view class="main">
			<view class="requester" v-for="(item, index) in requsters" :key="index">
				<view class="request-top">
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header"><image :src="item.avatar"></image></view>
					<view class="resolve btn" @tap="resolve(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{ item.name }}</view>
					<view class="time">{{ dateChange(item.lastTime) }}</view>
				</view>

				<view class="notice">
					<text>留言:</text>
					{{ item.message }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { dateChange } from '../../commons/js/myFun.js';
import {getUsers,getOneMsg,deleteFriend,updateFriendState} from '../../api/index.js';
export default {
	data() {
		return { 
			requsters: [],
			uid:uni.getStorageSync('userid'),
			};
	},
	onLoad() {
		this.FriendRequest()
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
		//好友申请
		FriendRequest(){
			getUsers('/getUsers',{uid:this.uid,state:1}).then(res=>{
				// console.log(res)
				if(res.status==200){
					let arr =res.result;
						arr.forEach((item)=>{
							item.avatar=this.$host.host+item.avatar
							this.getLeave(item)
						})
						this.requsters=arr
				}
			})
		},
		//获取留言
		getLeave(item){
			getOneMsg('/getOneMsg',{uid:this.uid,fid:item.id}).then(res=>{
				// console.log(res)
				if(res.status==200){
					this.$set(item,'message',res.result.message)
				}
			})
		},
		//拒绝好友申请
		refuse(fid){
			uni.showModal({
				title: '提示',
				content: '是否拒绝该好友请求',
				success:(res)=>{
					if (res.confirm) {
						deleteFriend('/deleteFriend',{uid: this.uid, fid: fid}).then(res=>{
							console.log(res)
							if (res.status == 200) {
								this.FriendRequest()
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//同意好友申请
		resolve(fid){
			uni.showModal({
				title: '提示',
				content: '是否同意该好友请求',
				success:(res)=>{
					if (res.confirm) {
						updateFriendState('/updateFriendState',{uid: this.uid, fid: fid}).then(res=>{
							console.log(res)
							if (res.status == 200) {
								this.FriendRequest()
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//时间处理
		dateChange(val) {
			return dateChange(val);
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
		height: 88rpx;
		.back-img {
			height: 46rpx;
			width: 46rpx;
			margin-left: 21rpx;
			padding-top: 25rpx;
		}
	}
	.top-bar-center {
		text-align: center;
		height: 88rpx;
		line-height: 88rpx;
	}
}

.main {
	padding: 108rpx $uni-spacing-col-base;
	.requester {
		margin-top: 112rpx;
		padding: $uni-spacing-col-base;
		background-color: rgba(255, 255, 255, 1);
		box-shadow: 0 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
		border-radius: $uni-border-radius-base;
	}
	.request-top {
		display: flex;
		.btn {
			flex: none;
			text-align: center;
			font-size: $uni-font-size-lg;
			width: 160rpx;
			height: 64rpx;
			line-height: 64rpx;
			background-color: rgba(255, 93, 91, 0.1);
			border-radius: 40rpx;
		}
		.reject {
			background-color: rgba(255, 93, 91, 0.1);
			color: $uni-color-warning;
		}
		.resolve {
			background-color: $uni-color-primary;
			color: $uni-text-color;
		}
		.header {
			margin-top: -104rpx;
			text-align: center;
			flex: auto;
			image {
				width: 144rpx;
				height: 144rpx;
				background-color: $uni-color-primary;
				border-radius: 50%;
			}
		}
	}
	.request-center {
		text-align: center;
		padding-top: 20rpx;
		padding-bottom: 40rpx;
		.title {
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 50rpx;
			font-weight: 500;
		}
		.time {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-disable;
			line-height: 34rpx;
		}
	}

	.notice {
		padding: $uni-spacing-row-sm $uni-spacing-col-base;
		border-radius: $uni-border-radius-base;
		background-color: $uni-bg-color-grey;
		font-size: $uni-font-size-base;
		color: $uni-text-color-disable;
		line-height: 40rpx;
	}
}
</style>
