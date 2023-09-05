<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/common/back.png" class="back-img"></image></view>
			<view class="top-bar-center">{{ friend.name }}</view>

			<view class="top-bar-right" v-if="friend.type == 0">
				<view class="more-img"><image src="../../static/images/userhome/more.png" mode=""></image></view>
			</view>
			<!-- 为群时显示 -->
			<view class="top-bar-right" v-if="friend.type == 1" @tap="toGroupHome"><image :src="friend.avatar" class="group-img"></image></view>
		</view>

		<scroll-view @scrolltoupper="loading" @tap="close" data-set="1" id="scoll" scroll-y="true" class="chat" scroll-with-animation="true" :scroll-into-view="scrollToView">
			<view class="chat-main" :style="{ paddingBottom: myHeight + 'px' }">
				<view class="loading" v-if="isLoading"><image :animation="animationData" src="../../static/images/chatroom/loading.png"></image></view>
				<view class="chat-ls" v-for="(item, index) in msgs" :key="index" :id="'msg' + item.id">
					<view class="chat-time">{{ dateChange(item.createTime) }}</view>
					<view class="msg-m msg-left" v-if="item.fromid != uid">
						<text class="user-name">{{ item.name }}</text>
						<image :src="item.avatar" class="user-img" @tap="toUserDetail(item.fromid)"></image>
						<!-- 文字 -->
						<view class="message msg-voice" v-if="item.types == 0">
							<view class="msg-text">{{ item.message }}</view>
						</view>
						<!-- 图片 -->
						<view class="message" v-if="item.types == 1"><image :src="item.message" @tap="previewImg(item.message)" class="msg-img" mode="widthFix"></image></view>
						<!-- 音频 -->
						<view class="message msg-voice" @tap="playVoice(item.message.voice, item.audioIndex)" v-if="item.types == 2">
							<view class="msg-text voice" :style="{ width: item.message.time * 4 + 'px' }">
								<image v-if="!audioList[item.audioIndex].playFlag" src="../../static/images/chatroom/yyl.png" class="voice-img"></image>
								<image v-if="audioList[item.audioIndex].playFlag" src="../../static/images/chatroom/voice-l.gif" class="voice-img"></image>
								{{ item.message.time }}″
							</view>
						</view>
						<view class="message" @tap="openLocation(item.message)" v-if="item.types == 3">
							<view class="msg-map">
								<view class="map-name">{{ item.message.name }}</view>
								<view class="map-address">{{ item.message.address }}</view>
								<!-- 温馨提示经纬度不能反 -->
								<!-- 不带标记marker -->
								<!-- <image :src="`https://restapi.amap.com/v3/staticmap?location=${item.message.longitude},${item.message.latitude}&zoom=17&key=高德静态地图key`" ></image> -->
								<image
									:src="
										`https://restapi.amap.com/v3/staticmap?markers=-1,https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png,0:${
											item.message.longitude
										},${item.message.latitude}&key=高德静态地图key`
									"
								></image>
							</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.fromid == uid">
						<image :src="item.avatar" class="user-img" @tap="toUserDetail(uid)"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{ item.message }}</view>
						</view>
						<!-- 图片 -->
						<view class="message" v-if="item.types == 1"><image :src="item.message" @tap="previewImg(item.message)" class="msg-img" mode="widthFix"></image></view>
						<!-- 音频 -->
						<view class="message msg-voice" @tap="playVoice(item.message.voice, item.audioIndex)" v-if="item.types == 2">
							<view class="msg-text voice" :style="{ width: item.message.time * 4 + 'px' }">
								{{ item.message.time }}″
								<image v-if="!audioList[item.audioIndex].playFlag" src="../../static/images/chatroom/yyr.png" class="voice-img"></image>
								<image v-if="audioList[item.audioIndex].playFlag" src="../../static/images/chatroom/voice-r.gif" class="voice-img"></image>
							</view>
						</view>
						<!-- 位置 -->
						<view class="message" @tap="openLocation(item.message)" v-if="item.types == 3">
							<view class="msg-map">
								<view class="map-name">{{ item.message.name }}</view>
								<view class="map-address">{{ item.message.address }}</view>
								<!-- 温馨提示经纬度不能反 -->
								<!-- 不带标记marker -->
								<!-- <image :src="`https://restapi.amap.com/v3/staticmap?location=${item.message.longitude},${item.message.latitude}&zoom=17&key=高德静态地图key`" ></image> -->
								<image
									:src="
										`https://restapi.amap.com/v3/staticmap?markers=-1,https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png,0:${
											item.message.longitude
										},${item.message.latitude}&高德静态地图key`
									"
								></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<submit ref="submit" @msgs="message" @getHeight="getHeight" @bottom="scollTo"></submit>
	</view>
</template>

<script>
const innerAudioContext = uni.createInnerAudioContext();
import { userDetail, msg, uploadFile, groupMsg, updateGroupMsg, updateMsg, getGroupName } from '@/api/index.js';
import { nanoid } from 'nanoid';
import { getTimeStringAutoShort, fileName } from '../../commons/js/myFun.js';
import submit from '../../components/submit/submit.vue';
export default {
	data() {
		return {
			msgs: [], //所有消息列表
			msgImg: [], //聊天图片
			audioLength: 0, //语音消息数量
			audioList: [], //语音消息列表
			oldTime: new Date(),
			scrollToView: '',
			groupUserName: '', //群内名称
			myHeight: 60,
			animationData: {},
			uid: uni.getStorageSync('userid'),
			user: {}, //个人信息
			friend: {}, //好友信息
			isLoading: false,
			beginLoading: false, //开始加载
			nowPage: 0,
			pageSize: 10,
			pos: 0 //用来加载多页时判断是否回到底部
		};
	},
	components: { submit },
	onLoad(options) {
		this.friend = options;
		this.getMsg();
		this.getGroupMsg();
		this.getAudio();
		this.getUserDetail();
		this.getGroupName();
		this.reciveSocket();
		this.reciveGroup();
		this.updateGroupMsg();
		this.updateMsg();
	},
	onShow() {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarBackground('#F4F4F4');
		// #endif
	},
	methods: {
		//滚动顶部加载下一页
		loading() {
			if (this.nowPage > 0 && this.beginLoading) {
				//出现loading
				this.isLoading = true;
				//禁止重复加载
				this.beginLoading = false;
				var animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'step-start'
				});
				this.animation = animation;
				let i = 1;
				this.timer = setInterval(() => {
					animation.rotate(i * 30).step();
					i++;
					//获取聊天数据
					if (i > 10) {
						this.getMsg();
						this.getGroupMsg();
					}
					this.animationData = animation.export();
				}, 100);
			}
		},
		//跳转到用户详情页
		toUserDetail(id) {
			if(this.friend.type==0){//单聊
				uni.navigateTo({
					url: '../userdetails/userdetails?id=' + id
				});
			}else{//群聊
				uni.navigateTo({
					url: '../userhome/userhome?id=' + id
				});
			}
			
		},
		//跳转到群详情
		toGroupHome() {
			uni.navigateTo({
				url: `../grouphome/grouphome?gid=${this.friend.id}`
			});
		},
		//获取用户信息
		getUserDetail() {
			userDetail('/userDetail', { id: this.uid }).then(res => {
				// console.log(res);
				if (res.status == 200) {
					this.user = res.data;
				} else {
					uni.showToast({
						title: '获取用户信息失败',
						duration: 2000
					});
				}
			});
		},
		//过滤出语音播放列表,并且添加关联的index
		getAudio() {
			let index = 0;
			this.audioList = this.msgs.filter(item => {
				if (item.types == 2) {
					item.audioIndex = index;
					index++;
					this.$set(item, 'playFlag', false); //需要加入observe，切换效果，使用$set
					return item;
				}
			});
			// console.log(this.audioList);
			this.audioLength = this.audioList.length;
		},
		close() {
			this.$refs.submit.close();
		},
		//返回
		back() {
			//告知离开当前聊天页面
			this.$io.emit('leaveChat', this.uid, this.friend.id);
			uni.navigateBack({
				delta: 1
			});
		},
		//导航
		openLocation(val) {
			uni.openLocation({
				latitude: val.latitude,
				longitude: val.longitude,
				name: val.name,
				success: function() {
					console.log('success');
				}
			});
		},
		//发送信息
		 message(val, types) {
			let avatar = this.$host.host + this.user.avatar;
			this.recive(val, this.uid, avatar, types);
		},
		//接收消息
		recive(val, id, avatar, types) {
			let nowTime = new Date();
			let obj = {
				fromid: id, //发送者id
				avatar: avatar,
				message: val,
				types: types,
				createTime: nowTime,
				id: this.msgs.length
			};
			this.msgs.push(obj);
			this.getAudio();
			// console.log(this.audioList);
			if (types === 1) {
				this.msgImg.push(val);
			}

			if (types == 0) {
				//文字表情
				let message = {
					message: val,
					types
				};
				this.sendSocket(message);
			} else if (types == 1) {
				//图片
				let url = fileName(new Date());
				uploadFile('/upload', val, { url, name: nanoid() }, 'image').then(res => {
					// console.log(res)
					let message = {
						message: res,
						types
					};
					this.sendSocket(message);
				});
			} else if (types == 2) {
				//音频
				let url = fileName(new Date());
				// console.log(val)
				uploadFile('/upload', val.voice, { url, name: nanoid() }, 'audio').then(res => {
					// console.log(res)
					let message = {
						//message:val,//用临时地址也可以，因为临时地址的语音是存在手机里的
						message: { voice: res, time: val.time },
						types
					};
					this.sendSocket(message);
				});
			} else {
				//位置
				let message = {
					message: val,
					types
				};
				this.sendSocket(message);
			}
			this.scollTo();
		},
		//发送socket消息
		sendSocket(val) {
			//一对一聊天
			if (this.friend.type == 0) {
				this.$io.emit('msg', val, this.uid, this.friend.id);
			} else {
				//群消息
				// console.log(this.friend.id)
				let name = this.user.name;
				if (this.user.markname) {
					//好友昵称
					name = this.user.markname;
				} else if (this.groupUserName) {
					//群内名
					name = this.groupUserName;
				}
				console.log(this.groupUserName)
				this.$io.emit('groupMsg', val, this.uid, this.friend.id, name, this.user.avatar);
			}
		},
		//接收socket消息
		reciveSocket() {
			this.$io.on('msg', (msg, fromid, tip) => {
				if (fromid == this.friend.id && tip == 0) {
					let nowTime = new Date();
					if (msg.types == 1) {
						msg.message = this.$host.host + msg.message;
						// console.log(msg.message)
					} else if (msg.type == 2) {
						msg.message.voice = this.$host.host + msg.message.voice;
					}
					let obj = {
						fromid: fromid, //发送者id
						avatar: this.friend.avatar,
						message: msg.message,
						types: msg.types,
						createTime: nowTime,
						id: this.msgs.length
					};
					this.msgs.push(obj);
					this.getAudio();
					// console.log(this.audioList);
					if (msg.types === 1) {
						this.msgImg.push(msg.message);
					}
					this.scollTo();
				}
			});
		},
		//接收群聊天消息
		reciveGroup() {
			this.$io.on('groupmsg', (msg, fromid, gid, name, avatar, tip) => {
				// console.log(msg,fromid,gid,this.friend.id)
				if (gid == this.friend.id && tip == 0) {
					let nowTime = new Date();
					if (msg.types == 1) {
						msg.message = this.$host.host + msg.message;
						// console.log(msg.message)
					} else if (msg.type == 2) {
						msg.message.voice = this.$host.host + msg.message.voice;
					}
					let obj = {
						fromid: fromid, //发送者id
						avatar: this.$host.host + avatar,
						name: name,
						message: msg.message,
						types: msg.types,
						createTime: nowTime,
						id: this.msgs.length
					};
					this.msgs.push(obj);
					this.getAudio();
					// console.log(this.audioList);
					if (msg.types === 1) {
						this.msgImg.push(msg.message);
					}
					this.scollTo();
				}
			});
		},
		//获取高度
		getHeight(val) {
			// console.log(val);
			this.myHeight = val;
			this.scollTo();
		},
		//获取群内名称
		getGroupName() {
			getGroupName('/getGroupName', { uid: this.uid, gid: this.friend.id }).then(res => {
				// console.log(res)
				if (res.status == 200 && res.result) {
					this.groupUserName = res.result.name;
				}
			});
		},
		//滚动到底部
		scollTo() {
			this.scrollToView = '';
			//滚动到最后一条
			this.$nextTick(() => {
				setTimeout(() => {
					this.scrollToView = 'msg' + this.msgs[this.msgs.length - 1].id;
					// console.log(this.scrollToView)
				}, 200);
			});
		},
		//获取消息
		getMsg() {
			msg('/chat/msg', { uid: this.uid, fid: this.friend.id, nowPage: this.nowPage, pageSize: this.pageSize }).then(res => {
				// console.log(res);
				if (res.status == 200) {
					let arr = res.result;
					if (arr.length > 0) {
						arr.forEach(item => {
							// console.log(item)
							item.avatar = this.$host.host + item.avatar;
							//补充图片地址
							if (item.types == 1) {
								item.message = this.$host.host + item.message;
								this.msgImg.unshift(item.message);
							} else if (item.types == 2 || item.types == 3) {
								//因为音频和位置存入数据库时为字符串
								item.message = JSON.parse(item.message);
								if (item.message.voice) {
									item.message.voice = this.$host.host + item.message.voice;
								}
							}
							this.msgs.unshift(item);
							this.getAudio();
						});
						//判断nowPage
						if (arr.length == 10) {
							this.nowPage++;
						} else {
							this.nowPage = -1;
						}
						// console.log(this.nowPage)
						if (this.pos == 0) {
							this.scollTo();
							this.pos++;
						}

						clearInterval(this.timer);
						//关闭loading
						this.isLoading = false;
						// 开启加载
						this.beginLoading = true;
					} else if (res.status == 500) {
						uni.showToast({
							title: '服务器出错',
							duration: 2000
						});
					}
				}
			});
		},

		//获取群消息
		getGroupMsg() {
			groupMsg('/chat/groupMsg', { uid: this.uid, gid: this.friend.id, nowPage: this.nowPage, pageSize: this.pageSize }).then(res => {
				if (res.status == 200) {
					// console.log(res);
					let arr = res.result;
					if (arr.length > 0) {
						arr.forEach(item => {
							// console.log(item)
							item.avatar = this.$host.host + item.avatar;
							if (item.markname) {
								item.name = item.markname;
							} else if (item.groupUserName) {
								item.name = item.groupUserName;
							}

							//补充图片地址
							if (item.types == 1) {
								item.message = this.$host.host + item.message;
								this.msgImg.unshift(item.message);
							} else if (item.types == 2 || item.types == 3) {
								//因为音频和位置存入数据库时为字符串
								item.message = JSON.parse(item.message);
								if (item.message.voice) {
									item.message.voice = this.$host.host + item.message.voice;
								}
							}
							this.msgs.unshift(item);
							this.getAudio();
						});
						//判断nowPage
						if (arr.length == 10) {
							this.nowPage++;
						} else {
							this.nowPage = -1;
						}

						if (this.pos == 0) {
							this.scollTo();
							this.pos++;
						}

						clearInterval(this.timer);
						//关闭loading
						this.isLoading = false;
						// 开启加载
						this.beginLoading = true;
					} else if (res.status == 500) {
						uni.showToast({
							title: '服务器出错',
							duration: 2000
						});
					}
				}
			});
		},
		//更新群未读消息数
		updateGroupMsg() {
			updateGroupMsg('/updateGroupMsg', { uid: this.uid, gid: this.friend.id, tip: 0 });
		},
		//修改一对一未读消息状态
		updateMsg() {
			updateMsg('/updateMsg', { uid: this.uid, fid: this.friend.id });
		},
		//时间处理
		dateChange(val) {
			return getTimeStringAutoShort(val, true);
		},
		//预览图片
		previewImg(url) {
			let index = this.msgImg.indexOf(url);
			// 预览图片
			uni.previewImage({
				current: index, //当前位置
				urls: this.msgImg,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		//播放音频
		playVoice(voice, i) {
			let curAudioInfo = this.audioList[i];
			// console.log(curAudioInfo);
			if (curAudioInfo.playFlag) {
				//当前正在播放，切换效果，暂停播放
				curAudioInfo.playFlag = false;
				innerAudioContext.pause();
				console.log('点击正在播放的语音，暂停播放');
				return;
			}
			//样式切换,把所有语音变为false
			this.audioList.forEach(item => {
				item.playFlag = false;
			});
			curAudioInfo.playFlag = true;
			// console.log(voice)
			innerAudioContext.src = voice; //音频地址
			innerAudioContext.play(); //执行播放
			innerAudioContext.onPlay(() => {
				console.log('开始播放');
			});
			innerAudioContext.onError(res => {
				console.log('Error');
				curAudioInfo.playFlag = false;
				uni.showToast({
					title: res.errCode + ',' + res.errMsg,
					icon: 'none'
				});
			});
			innerAudioContext.onPause(() => {
				console.log('pause');
				curAudioInfo.playFlag = false;
			});
			innerAudioContext.onEnded(() => {
				console.log('end');
				curAudioInfo.playFlag = false;
			});
			// innerAudioContext.src = voice;
			// innerAudioContext.play();
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../commons/css/mycss.scss';
.content {
	// height: 100%; //无法触发置底
	height: 100vh;
	background-color: rgba(244, 244, 244, 0.96);
}
.top-bar {
	border-bottom: 1px solid $uni-border-color;
	background-color: rgba(244, 244, 244, 1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	.top-bar-left {
		height: 88rpx;
		display: flex;
		align-items: center;
		margin-left: 10rpx;
		.back-img {
			height: 46rpx;
			width: 46rpx;
		}
	}
	.top-bar-center {
		height: 88rpx;
		line-height: 88rpx;
	}
	.top-bar-right {
		margin-right: 30rpx;
		.group-img {
			width: 68rpx;
			height: 68rpx;
			border-radius: 16rpx;
			margin-top: 10rpx;
		}
		.more-img {
			height: 88rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 52rpx;
				height: 12rpx;
			}
		}
	}
}

.chat {
	height: 100%;
	overflow: scroll;
	.chat-main {
		padding-left: $uni-spacing-col-base;
		padding-right: $uni-spacing-col-base;
		padding-top: 100rpx;
		// padding-bottom: 120rpx;
		display: flex;
		flex-direction: column;
	}
	.loading {
		text-align: center;
		image {
			width: 60rpx;
			height: 60rpx;
		}
	}
	.chat-ls:last-child {
		margin-bottom: 50rpx;
	}
	.chat-ls {
		.chat-time {
			font-size: $uni-font-size-sm;
			color: $uni-text-color;
			line-height: 34rpx;
			padding: 20rpx 0;
			text-align: center;
		}
		.msg-m {
			display: flex;
			padding: 20rpx 0;
		}
		.user-img {
			width: 80rpx;
			height: 80rpx;
			border-radius: $uni-border-radius-base;
			background-color: $uni-color-primary;
		}
		.message {
			max-width: 480rpx;
			.msg-text {
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
				padding: 18rpx 24rpx;
			}
			.msg-img {
				max-width: 400rpx;
				border-radius: $uni-border-radius-base;
			}

			.msg-map {
				width: 460rpx;
				background-color: #fff;
				.map-name {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx 0 24rpx;
					text-overflow: ellipsis; /*可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。*/
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 1; /* 设置文本超出的行数，显示省略号*/
					-webkit-box-orient: vertical;
				}
				.map-address {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					padding: 0 24rpx;
					text-overflow: ellipsis; /*可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。*/
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 1; /* 设置文本超出的行数，显示省略号*/
					-webkit-box-orient: vertical;
				}
				image {
					width: 100%;
					height: 250rpx;
				}
			}
		}
		.msg-voice {
			.voice {
				display: flex;
				align-items: center;
				justify-content: space-between;
				min-width: 80rpx;
				max-width: 400rpx;
				.voice-img {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
		.msg-left {
			flex-direction: row;
			position: relative;
			.msg-text {
				margin-left: 16rpx;
				background-color: #fff;
				border-radius: 0 20rpx 20rpx 20rpx;
			}
			.msg-img {
				margin-left: 16rpx;
			}
			.msg-map {
				margin-left: 16rpx;
			}
			.user-name {
				width: 200rpx;
				height: 60rpx;
				position: absolute;
				left: 100rpx;
				top: -30rpx;
				z-index: 10;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}

		.msg-right {
			flex-direction: row-reverse;
			.msg-text {
				margin-right: 16rpx;
				background-color: $uni-color-primary;
				border-radius: 20rpx 0rpx 20rpx 20rpx;
			}
			.msg-img {
				margin-right: 16rpx;
			}
			.msg-map {
				margin-right: 16rpx;
			}
		}
	}
}
</style>
