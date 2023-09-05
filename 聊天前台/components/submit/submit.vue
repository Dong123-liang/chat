<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="changeBtn"><image :src="img" mode=""></image></view>
				<textarea @click="bottom" v-model="str" maxlength="300" auto-height="true" adjust-position="true" fixed="true" class="chat-send btn" v-if="!isRecord" />
				<view class="record btn" v-else @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">按住说话</view>
				<view class="bt-img" @tap="emoji"><image :src="img2"></image></view>
				<view class="bt-img" @tap="more" v-if="!isSend"><image src="../../static/images/chatroom/add.png"></image></view>
				<view class="send" v-if="isSend" @touchend.prevent="send">发送</view>
			</view>
			<!-- 表情 -->
			<view class="emoji" v-if="isEmoji"><emoji @sendEmoji="sendEmoji" @deleteEmoji="deleteEmoji"></emoji></view>
			<!-- 加按钮 -->
			<view class="more" v-if="isMore">
				<view class="more-list" @tap="sendImage('album')">
					<image src="../../static/images/chatroom/pic.png"></image>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendImage('camera')">
					<image src="../../static/images/chatroom/photo.png"></image>
					<view class="more-list-title">拍照</view>
				</view>
				<view class="more-list" @tap="chooseLocation">
					<image src="../../static/images/chatroom/map.png"></image>
					<view class="more-list-title">位置</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/chatroom/video.png"></image>
					<view class="more-list-title">视频</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/chatroom/file.png"></image>
					<view class="more-list-title">文件</view>
				</view>
			</view>
		</view>

		<view class="voice-bg" v-if="voice">
			<view class="bg-len">
				<view class="bg-time" :style="{ width: vlength / 0.6 + '%' }">{{ vlength }}″</view>
			</view>
			<view class="del-btn">上滑取消录音</view>
		</view>
	</view>
</template>

<script>
//录音
const recorderManager = uni.getRecorderManager();
import emoji from '../../components/emoji/emoji.vue';
export default {
	name: 'submit',
	data() {
		return {
			isRecord: false, //按住说话显示
			isEmoji: false, //表情页面显示
			isSend: false, //发送按钮显示
			isMore: false, //更多页面显示
			voice: false, //录音背景显示
			timer: null,
			vlength: 1,
			pageY: 0,
			str: '',
			firstHeight: 0,
			moduleHeight: 0,
			img: '../../static/images/chatroom/audio.png', //语音图片
			img2: '../../static/images/chatroom/mile.png' //表情图片
		};
	},
	watch: {
		str(val) {
			if (val !== '') {
				this.isSend = true;
			} else {
				this.isSend = false;
			}
		}
	},
	methods: {
		//开始说话
		touchstart(e) {
			this.pageY = e.changedTouches[0].pageY;
			let i = 1;
			this.voice = true;
			//开始录音
			recorderManager.start();
			this.timer = setInterval(() => {
				i++;
				this.vlength = i;
				if (i >= 60) {
					this.touchend();
				}
			}, 1000);
		},
		touchend() {
			//结束录音
			recorderManager.stop();
			clearInterval(this.timer);
			recorderManager.onStop(res => {
				let data = {
					voice: res.tempFilePath,
					time: this.vlength,
				};
				//判断上滑取消
				if (this.voice) {
					this.$emit('msgs', data, 2);
				}
				this.vlength = 1;
				this.voice = false;
				// console.log('recorder stop' + JSON.stringify(res));
			});
		},
		//上滑取消
		touchmove(e) {
			console.log(this.pageY, e.changedTouches[0].pageY);
			if (this.pageY - e.changedTouches[0].pageY > 100) {
				this.voice = false;
			}
		},
		//点击屏幕空白处，关闭所有打开页面
		close() {
			if(this.isRecord || this.isEmoji || this.isMore){
				this.isRecord = false;
				this.isEmoji = false;
				this.isMore = false;
				this.img2 = '../../static/images/chatroom/mile.png';
				this.img = '../../static/images/chatroom/audio.png';
				//复原距离
				setTimeout(() => {
					this.getElements();
				}, 100);
			}
		},
		//点击输入框时滚动到最后一条信息
		bottom() {
			this.$emit('bottom');
			//当点击输入框时，如果表情页面已经打开就关闭它
			if (this.isEmoji) {
				this.img2 = '../../static/images/chatroom/mile.png';
				this.isEmoji = false;
			} else if (this.isMore) {
				//当点击输入框时，如果更多页面已经打开就关闭它
				this.isMore = false;
			}
			//复原距离
			setTimeout(() => {
				this.getElements();
			}, 100);
		},
		//点击语音
		changeBtn() {
			if (this.isRecord) {
				this.img = '../../static/images/chatroom/audio.png';
				this.isRecord = false;
			} else {
				this.img = '../../static/images/chatroom/jianpan.png';
				this.isRecord = true;
			}
			this.isEmoji = false;
			this.img2 = '../../static/images/chatroom/mile.png';
			this.isMore = false;
			setTimeout(() => {
				this.getElements();
			}, 100);
		},
		//获取元素高度
		getElements() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.submit')
				.boundingClientRect(data => {
					this.$emit('getHeight', data.height);
				})
				.exec();
		},
		//点击表情
		emoji() {
			this.isRecord = false;
			if (this.isEmoji) {
				this.img2 = '../../static/images/chatroom/mile.png';
				this.isEmoji = false;
			} else {
				this.img2 = '../../static/images/chatroom/jianpan.png';
				this.isEmoji = true;
				this.isMore = false;
			}

			this.$nextTick(function() {
				setTimeout(() => {
					this.getElements();
				}, 100);
			});
		},
		//点击更多
		more() {
			this.isRecord = false;
			if (this.isMore) {
				this.isMore = false;
			} else {
				this.isMore = true;
				this.isEmoji = false;
				this.img2 = '../../static/images/chatroom/mile.png';
			}
			this.$nextTick(function() {
				setTimeout(() => {
					this.getElements();
				}, 100);
			});
		},
		//发送信息
		send() {
			this.$emit('msgs', this.str, 0);
			this.str = '';
		},
		//发送表情
		sendEmoji(emoji) {
			this.str += emoji;
		},
		//删除表情
		deleteEmoji() {
			console.log(this.str.length);
			if (this.str.length > 0) {
				//因为一个表情占两个长度
				this.str = this.str.substring(0, this.str.length - 2);
			}
		},
		//发送图片
		sendImage(e) {
			console.log(e);
			let count = 0;
			if (e === 'album') {
				count = 9;
			} else {
				count = 1;
			}
			uni.chooseImage({
				count, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: [e], //从相册,相机中选择
				success: res => {
					const filePaths = res.tempFilePaths;
					filePaths.forEach(item => {
						this.$emit('msgs', item, 1);
					});
					this.isMore = false;
					setTimeout(() => {
						this.getElements();
					}, 100);
					// console.log(JSON.stringify(res.tempFilePaths));
				}
			});
		},
		//获取位置
		chooseLocation() {
			uni.chooseLocation({
				success: res => {
					let data = {
						name: res.name,
						address: res.address,
						latitude: res.latitude,
						longitude: res.longitude,
					};
					// console.log(data)
					this.$emit('msgs', data, 3);

					// console.log('位置名称：' + res.name);
					// console.log('详细地址：' + res.address);
					// console.log('纬度：' + res.latitude);
					// console.log('经度：' + res.longitude);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.submit {
	background-color: rgba(244, 244, 244, 1);
	border-top: 1px solid $uni-border-color;
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: 1002;
	.submit-chat {
		width: 100%;
		display: flex;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		justify-content: space-around;
		align-items: center;
		.bt-img {
			display: flex;
			align-items: center;
			margin: 0 10rpx;
			image {
				width: 56rpx;
				height: 56rpx;
			}
		}
		.btn {
			// width: 100%;
			flex: auto;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx 0;
			padding-left: 20rpx;
			margin: 0 10rpx;
			overflow: scroll;
			max-height: 200rpx;
		}

		.record {
			text-align: center;
			font-size: 32rpx;
			color: $uni-text-color-grey;
		}
	}
	.send {
		height: 56rpx;
		width: 120rpx;
		margin-right: 20rpx;
		background-color: green;
		text-align: center;
		line-height: 56rpx;
		border-radius: 20rpx;
	}
	.emoji,
	.more {
		width: 100%;
		height: 460rpx;
		background-color: rgba(236, 237, 238, 1);
		box-shadow: 0 -1rpx 0px 0px rgba(0, 0, 0, 0.1);
		margin-top: 20rpx;
	}
	.more-list {
		width: 25%;
		text-align: center;
		float: left;
		padding: 20rpx 0;
		image {
			width: 72rpx;
			height: 72rpx;
			padding: 24rpx;
			background-color: #fff;
			border-radius: 20rpx;
		}
		.more-list-title {
			font-size: 24rpx;
			line-height: 24rpx;
		}
	}
}
.voice-bg {
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.3);
	position: fixed;
	top: 0;
	bottom: 0;
	z-index: 1000;
	.bg-len {
		height: 84rpx;
		width: 640rpx;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 42rpx;
		text-align: center;
		.bg-time {
			line-height: 84rpx;
			background-color: $uni-color-primary;
			border-radius: 42rpx;
			display: inline-block;
			min-width: 120rpx;
			max-width: 640rpx;
		}
	}
	.del-btn {
		position: absolute;
		bottom: 200rpx;
		width: 100%;
		text-align: center;
		font-size: $uni-font-size-base;
		color: #fff;
	}
}
</style>
