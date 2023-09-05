<template>
	<view class="content">
		<view class="top-bar">
			<navigator :url="`../userhome/userhome?id=${uid}`" hover-class="none">
				<view class="top-bar-left"><image :src="$host.host + user.avatar"></image></view>
			</navigator>
			<view class="top-bar-center"><image src="../../static/images/index/logo.png" class="logo"></image></view>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch"><image src="../../static/images/index/search@2x.png"></image></view>
				<view class="add" @tap="tobuildGroup"><image src="../../static/images/index/add@2x.png"></image></view>
			</view>
		</view>

		<view class="main">
			<view class="refresh" v-if="freshStatus">
				<image src="../../static/images/index/refresh.png"></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<view class="noone" v-if="noone">
				<image src="../../static/images/index/noone.png" mode="aspectFill"></image>
				<view class="no-title">你还没有好友~</view>
				<view class="no-search" @tap="toSearch">添加好友</view>
			</view>
			<view class="friends" v-if="requestCount > 0" @tap="toFriendRequest">
				<view class="friends-list">
					<view class="friends-list-l">
						<text class="tip">{{ requestCount }}</text>
						<image src="../../static/images/index/userplus-fill.png"></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{changeTime(requestTime)}}</view>
						</view>
						<view class="news">茫茫人海，相遇便是缘分</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friends-list" v-for="(item, index) in friends" :key="index" @tap="toChatroom(item)">
					<view class="friends-list-l">
						<text v-if="item.tip > 0" class="tip">{{ item.tip }}</text>
						<image :src="item.avatar"></image>
						<!-- 区别群 -->
						<view class="groupm" v-if="item.type == 1"></view>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">{{ item.name }}</view>
							<view class="time">{{ changeTime(item.lastTime) }}</view>
						</view>
						<view class="news">{{ item.message }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { userDetail, getUsers, getGroup, getOneMsg, unReadMsg, getOneGroupMsg, updateGroupMsg } from '../../api/index.js';
import { getTimeStringAutoShort, mysort } from '../../commons/js/myFun.js';
export default {
	data() {
		return {
			friends: [], //好友列表
			groups: [], //群列表
			user: { avatar: 'user.jpg' },
			uid: uni.getStorageSync('userid'),
			requestCount: 0, //好友申请数
			requestTime: 0, //最后申请时间
			freshStatus: true, //刷新状态
			noone: true //是否没有好友
		};
	},
	onLoad() {
		//监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参）
		if(uni.getStorageSync('token')){
			this.getUser();
			this.getUserDetail();
			this.FriendRequest();
			this.join(this.uid);
			this.reciveSocket();
			this.reciveGroup();
			this.leaveChat();
		}
	},
	onShow() {
		//监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarBackground('#FFFFFF');
		// #endif
	},
	//下拉刷新
	onPullDownRefresh() {
		this.friends = []; //避免下拉刷新累加
		this.groups = [];
		this.getUser();
		this.getUserDetail();
		this.FriendRequest();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		//获取用户信息
		getUserDetail() {
			userDetail('/userDetail', { id: this.uid }).then(res => {
				// console.log(res.data);
				this.user = res.data;
			});
		},
		//前往搜索页面
		toSearch() {
			uni.navigateTo({
				url: '../search/search'
			});
		},
		//前往建群页面
		tobuildGroup() {
			uni.navigateTo({
				url: '../buildgroup/buildgroup'
			});
		},
		//前往好友申请页面
		toFriendRequest() {
			uni.navigateTo({
				url: '../friendrequest/friendrequest'
			});
		},
		//前往聊天页面
		toChatroom(data) {
			uni.navigateTo({
				url: `../chatroom/chatroom?id=${data.id}&name=${data.name}&avatar=${data.avatar}&type=${data.type}`
			});
		},
		//离开页面时触发
		leaveChat() {
			this.$io.on('leavechat', (uid, fid) => {
				this.friends.forEach((item, index) => {
					if (item.id == fid) {
						item.tip = 0;
						this.friends.splice(index, 1, item);
					}
				});
			});
		},
		//用户登录socket模块
		join(uid) {
			this.$io.emit('login', uid);
		},
		//接收socket消息
		reciveSocket() {
			this.$io.on('msg', (msg, fromid) => {
				let nmsg = '';
				if (msg.types == 0) {
					nmsg = msg.message;
				} else if (msg.types == 1) {
					nmsg = '[图片]';
				} else if (msg.types == 2) {
					nmsg = '[语音]';
				} else if (msg.types == 3) {
					nmsg = '[位置]';
				}

				this.friends.forEach((item, index) => {
					if (item.id == fromid) {
						item.message = nmsg;
						item.lastTime = new Date();
						item.tip++;
						//删除当前条
						this.friends.splice(index, 1);
						//新信息置顶
						this.friends.unshift(item);
					}
				});
			});
		},
		//群即时消息接收
		reciveGroup() {
			this.$io.on('groupmsg', (msg, fromid, gid, name, avatar) => {
				let nmsg = '';
				if (msg.types == 0) {
					nmsg = msg.message;
				} else if (msg.types == 1) {
					nmsg = '[图片]';
				} else if (msg.types == 2) {
					nmsg = '[语音]';
				} else if (msg.types == 3) {
					nmsg = '[位置]';
				}

				this.friends.forEach((item, index) => {
					if (item.id == gid) {
						item.message = nmsg;
						item.lastTime = new Date();
						if (fromid == this.uid) {
							item.message = nmsg;
						} else {
							item.message = name + ':' + item.message;
						}
						item.tip++;
						//更新群未读消息数
						updateGroupMsg('/updateGroupMsg', { uid: this.uid, gid: gid, tip: item.tip });
						//删除当前条
						this.friends.splice(index, 1);
						//新信息置顶
						this.friends.unshift(item);
					}
				});
			});
		},
		//获取好友列表
		getUser() {
			getUsers('/getUsers', { uid: this.uid, state: 0 })
				.then(res => {
					// console.log(res);
					if (res.status == 200) {
						this.freshStatus = false;
						let arr = res.result;
						if (arr.length > 0) {
							this.noone = false;
							arr.forEach(item => {
								item.avatar = this.$host.host + item.avatar;
								if (item.markname) {
									item.name = item.markname;
								}
								this.friends.push(item);
								this.getOneMsg(item);
								this.unReadMsg(item);
							});
						}
					} else {
						uni.showToast({
							title: '服务器异常',
							duration: 2000
						});
					}
				})
				.then(() => {
					this.getGroup();
				});
		},
		//获取群列表
		getGroup() {
			getGroup('/getGroup', { uid: this.uid }).then(res => {
				// console.log(res);
				if (res.status == 200) {
					this.freshStatus = false;
					let arr = res.result;
					if (arr.length > 0) {
						this.noone = false;
						arr.forEach(item => {
							item.avatar = this.$host.host + item.avatar;
							this.groups.push(item);
							this.getOneGroupMsg(item);
							this.$io.emit('group', item.id);
						});
						this.friends = this.friends.concat(this.groups);
						this.friends = mysort(this.friends, 'lastTime', 0);
					}
				}
			});
		},
		//最后一条消息
		getOneMsg(item) {
			getOneMsg('/getOneMsg', { uid: this.uid, fid: item.id }).then(res => {
				// console.log(res)
				if (res.status == 200) {
					if (res.result.types == 0) {
						this.$set(item, 'message', res.result.message);
					} else if (res.result.types == 1) {
						this.$set(item, 'message', '[图片]');
					} else if (res.result.types == 2) {
						this.$set(item, 'message', '[语音]');
					} else if (res.result.types == 3) {
						this.$set(item, 'message', '[位置]');
					}
				}
			});
		},
		//获取群最后一条消息
		getOneGroupMsg(item) {
			getOneGroupMsg('/getOneGroupMsg', { gid: item.id }).then(res => {
				if (res.status == 200) {
					if (res.result.types == 0) {
						this.$set(item, 'message', res.result.message);
					} else if (res.result.types == 1) {
						this.$set(item, 'message', '[图片]');
					} else if (res.result.types == 2) {
						this.$set(item, 'message', '[语音]');
					} else if (res.result.types == 3) {
						this.$set(item, 'message', '[位置]');
					}
				}
			});
		},
		//未读消息数
		unReadMsg(item) {
			//我加别人，别人同意之后自己才有一条未读消息
			// console.log(this.uid,item.id)
			unReadMsg('/unReadMsg', { uid: this.uid, fid: item.id }).then(res => {
				// console.log(res)
				if (res.status == 200) {
					if (res.result) {
						this.$set(item, 'tip', res.result);
					}
				} else {
					uni.showToast({
						title: '服务器异常',
						duration: 2000
					});
				}
			});
		},
		//好友申请
		FriendRequest() {
			getUsers('/getUsers', { uid: this.uid, state: 1 }).then(res => {
				// console.log(res);
				if (res.status == 200) {
					let arr = res.result;
					if (arr.length > 0) {
						this.noone = false;
						this.requestCount = arr.length;
						arr.forEach(item => {
							if (item.lastTime > this.requestTime) {
								this.requestTime = item.lastTime;
							}
						});
					} else {
						this.requestCount = 0;
					}
				} else {
					uni.showToast({
						title: '服务器异常',
						duration: 2000
					});
				}
			});
		},
		changeTime(time) {
			return getTimeStringAutoShort(time, false);
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
	// box-shadow: 0 1px 0 0 rgba(0,0,0,0.1);
	border-bottom: 1px solid $uni-border-color;

	.top-bar-left {
		padding-left: $uni-spacing-col-base;
		float: left;
		image {
			width: 68rpx;
			height: 68rpx;
			border-radius: 16rpx;
			margin-top: 10rpx;
			background-color: $uni-color-primary;
		}
	}

	.top-bar-center {
		z-index: -1;
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		.logo {
			padding-top: 19rpx;
			width: 88rpx;
			height: 42rpx;
		}
	}

	.top-bar-right {
		padding-right: 14rpx;
		float: right;

		.search {
			width: 88rpx;
			height: 88rpx;
			display: inline-block;
		}

		.add {
			display: inline-block;
			width: 88rpx;
			height: 88rpx;
		}

		image {
			width: 52rpx;
			height: 52rpx;
			padding: 18rpx 0 0 18rpx;
		}
	}
}

.main {
	padding-top: 104rpx;
}
.refresh {
	text-align: center;
	padding-top: 400rpx;
	image {
		width: 32rpx;
		height: 31rpx;
	}
	.ref-title {
		padding-top: 20rpx;
		font-size: $uni-font-size-base;
		color: rgba(39, 40, 50, 0.4);
		line-height: 40rpx;
	}
}

.noone {
	padding-top: 400rpx;
	text-align: center;
	image {
		height: 250rpx;
		width: 150rpx;
	}
	.no-title {
		padding: 32rpx;
		font-size: $uni-font-size-base;
		color: rgba(39, 40, 50, 0.4);
		line-height: 40rpx;
	}
	.no-search {
		width: 240rpx;
		height: 96rpx;
		line-height: 96rpx;
		background-color: $uni-color-primary;
		border-radius: 48rpx;
		margin: 0 auto;
		color: $uni-text-color;
	}
}
.friends-list {
	height: 96rpx;
	padding: 16rpx $uni-spacing-col-base;
	&:active {
		background-color: $uni-bg-color-grey;
	}
	.friends-list-l {
		float: left;
		position: relative;
		image {
			width: 96rpx;
			height: 96rpx;
			border-radius: $uni-border-radius-base;
			background-color: $uni-color-primary;
		}
		.tip {
			position: absolute;
			z-index: 10;
			height: 36rpx;
			left: 68rpx;
			top: -8px;
			min-width: 20rpx;
			padding: 0 8rpx;
			background-color: $uni-color-warning;
			border-radius: 18rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-inverse;
			line-height: 36rpx;
			text-align: center;
		}
		.groupm {
			position: absolute;
			z-index: 10;
			bottom: 8rpx;
			right: 0;
			width: 16rpx;
			height: 16rpx;
			background-color: greenyellow;
			border-radius: 8rpx;
			opacity: 0.8;
		}
	}
	.friends-list-r {
		padding-left: 128rpx;
		.top {
			height: 50rpx;
			.name {
				float: left;
				font-size: 36rpx;
				font-weight: 400;
				color: $uni-text-color;
				line-height: 50rpx;
			}
			.time {
				float: right;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-disable;
				line-height: 50rpx;
			}
		}
	}
	.news {
		font-size: $uni-font-size-base;
		color: $uni-text-color-grey;
		line-height: 40rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
}
</style>
