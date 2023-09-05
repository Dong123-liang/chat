<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/images/index/search@2x.png" class="search-img"></image>
				<input class="search" :value="search" @input="getSearch" type="search" placeholder="搜索用户/群" placeholder-style="color:#aaa;font-weight:400" />
			</view>
			<view class="top-bar-right"><view class="text" @tap="back">取消</view></view>
		</view>

		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userArr.length > 0">用户</view>

				<view class="list user" v-for="(item, index) in userArr" :key="index">
					<navigator :url="'../userhome/userhome?id='+item._id" hover-class="none"><image :src="item.avatar"></image></navigator>
					<view class="names">
						<view class="name" v-html="item.names"></view>
						<view class="email" v-html="item.emails"></view>
					</view>
					<view class="right-bt send" v-if="item.tip == 1" @tap="toChatroom(item)">发消息</view>
					<view class="right-bt add" v-if="item.tip == 2" @tap="addFriend(item._id)">加好友</view>
				</view>
			</view>
		</view>
		
		<view class="modify" :style="{ bottom: -modifyHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">添加好友</view>
				<view class="define" @tap="confirm">确定</view>
			</view>
		
			<view class="modify-main">
				<textarea  v-model="msg" class="modify-content"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
import { debounce } from '../../commons/js/myFun.js';
import { searchUser, isFriend,sendFriendRequest } from '../../api/index.js';
export default {
	data() {
		return {
			search: '',
			userArr: [],
			uid: uni.getStorageSync('userid'),
			fid:'',
			myname:uni.getStorageSync('name'),
			animationData: {},
			modifyHeight: 1000,//默认1000
			msg:'',
			isModify: false,
		};
	},
	onReady() {
		this.getElements()
	},
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		//前往聊天页面
		toChatroom(data) {
			uni.navigateTo({
				url: `../chatroom/chatroom?id=${data._id}&name=${data.name}&avatar=${data.avatar}&type=${data.type}`
			});
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
		modify() {
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
		//发送好友请求
		confirm(){
			if(this.msg!==""){
				sendFriendRequest('/applyFriend',{uid:this.uid,fid:this.fid,msg:this.msg}).then(res=>{
					console.log(res)
					if(res.status==200){
						uni.showToast({
							title:'发送成功',
							duration:2000
						})
						this.modify()
					}
				})
			}
		},
		addFriend(fid){
			this.fid=fid
			this.msg='我是' + this.myname
			this.modify()
		},
		//获取关键词 延时
		getSearch: debounce(function(e) {
			this.userArr = [];
			this.search = e.detail.value;
			if (this.search.length > 0) {
				this.searchUser(this.search);
			}
		}, 1000),
		//关键词匹配
		searchUser(val) {
			searchUser('/searchUser', { name: val }).then(res => {
				// console.log(res);
				if (res.status == 200) {
					let arr = res.data;
					let exp = eval('/' + val + '/g');
					arr.forEach(item => {
						// if (item.name.search(val) != -1 || item.email.search(val) != -1) {
							this.isFriends(item);
							item.avatar = `${this.$host.host}${item.avatar}`;
							item.names = item.name.replace(exp, `<span style='color:#4AAAFF'>${val}</span>`);
							item.emails = item.email.replace(exp, `<span style='color:#4AAAFF'>${val}</span>`);
							item.type=0
							this.userArr.push(item);
						// }
					});
				}else if(res.status == 404){
					uni.showToast({
						title:'暂无此用户',
						duration:1000
					})
				}
			});
			// console.log(this.userArr)
		},
		//判断是否为好友
		isFriends(f) {
			if (this.uid == f._id) {
				this.$set(f, 'tip', 0); //自己
			} else {
				isFriend('/isFriend', { uid: this.uid, fid: f._id }).then(res => {
					// console.log(res)
					//如果是好友
					if (res.status == 200) {
						this.$set(f, 'tip', 1); //好友
						// console.log(f);
					} else if (res.status == 404) {
						this.$set(f, 'tip', 2); //陌生人
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../commons/css/mycss.scss';
.content {
	padding-bottom: $uni-spacing-col-base;
}
.top-bar {
	.search-div {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		box-sizing: border-box;
		padding: 14rpx 118rpx 14rpx 32rpx;
		z-index: -1;
		.search {
			padding: 0 60rpx 0 12rpx;
			height: 60rpx;
			background-color: $uni-bg-color-grey;
			border-radius: 10rpx;
		}
		.search-img {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: 130rpx;
			top: 22rpx;
		}
	}
	.top-bar-right {
		position: absolute;
		top: 0;
		right: 20rpx;
		.text {
			font-size: $uni-font-size-lg;
			font-family: PingFangSC-Medium;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 88rpx;
		}
	}
}
.main {
	padding: 88rpx $uni-spacing-col-base;
	.result {
		padding-top: $uni-spacing-col-base;
		.title {
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}
		.list {
			width: 100%;
			height: 80rpx;
			padding: 20rpx 0;
			image {
				float: left;
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
				background-color: $uni-color-primary;
			}
		}
		.names {
			float: left;
			padding-left: $uni-spacing-col-base;
			.name {
				font-size: 36rpx;
				color: $uni-text-color;
				line-height: 50rpx;
			}
			.email {
				font-size: $uni-font-size-sm;
				color: $uni-text-color;
				line-height: 28rpx;
			}
		}

		.right-bt {
			float: right;
			width: 120rpx;
			height: 48rpx;
			border-radius: 24rpx;
			font-size: $uni-font-size-sm;
			font-weight: 400;
			line-height: 48rpx;
			text-align: center;
			margin-top: 16rpx;
		}
		.send {
			background: $uni-color-primary;
			color: $uni-text-color;
		}
		.add {
			background: rgba(74, 170, 255, 0.1);
			color: $uni-color-success;
		}
	}
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

	}
}
</style>
