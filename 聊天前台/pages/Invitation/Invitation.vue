<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/common/back.png" class="back-img"></image></view>
			<view class="top-bar-center">选择好友</view>
			<view class="top-bar-right"><!-- <view class="more-img"><image src="../../static/images/userhome/more.png" mode=""></image></view> --></view>
		</view>

		<view class="main">
			<view class="user-list">
				<checkbox-group>
					<label class="label" v-for="item in users" :key="item.id" @tap="select(item)">
						<view><checkbox :value="item.value" :checked="item.checked" :disabled="item.disabled" /></view>
						<image :src="item.avatar" class="user-img"></image>
						<view class="name">{{ item.name }}</view>
					</label>
				</checkbox-group>
			</view>
		</view>

		<view class="bottom-bar">
			<button :disabled="disabled" class="bottom-btn" :class="{ disabled: disabled }" @tap="create">完成({{ num ? num : 0 }})</button>
		</view>
	</view>
</template>
<script>
import { getUsers, getGroupUsers, insertGroupUser } from '../../api/index.js';
export default {
	data() {
		return {
			uid: uni.getStorageSync('userid'),
			users: [],
			gid: '',
			disabled: true,
			groupUser: []
		};
	},
	onLoad(options) {
		// console.log(options)
		this.gid = options.gid;
		this.getUsers();
	},
	computed: {
		num() {
			let arr = this.users.filter(item => item.checked == true && item.disabled != true);
			return arr.length;
		}
	},
	watch: {
		num() {
			this.judgeStatus();
		}
	},
	methods: {
		//返回
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		//判断按钮是否可用
		judgeStatus() {
			if (this.num > 0) {
				this.disabled = false;
			} else {
				this.disabled = true;
			}
		},
		//动态选择
		select(item) {
			// console.log(item);
			if (item.checked && item.disabled !== true) {
				this.$set(item, 'checked', false);
			} else {
				this.$set(item, 'checked', true);
			}
		},
		//添加群成员
		create() {
			let arr = this.users.filter(item => item.checked == true && item.disabled != true);
			arr.map(item => {
				let obj= {
					userid: item.id,
					groupid: this.gid,
					createTime: new Date().getTime(),
					lastTime: new Date().getTime()
				}
				// console.log(obj)
				insertGroupUser('/insertGroupUser',obj).then(res=>{
					// console.log(res);
					if(res.status==200){
						uni.showToast({
							title: '邀请成功',
							duration: 2000
						});
						setTimeout(()=>{
							uni.navigateTo({
								url: '../index/index'
							});
						},2000)
					}
				})
			});
			
			
		},
		//获取好友列表
		getUsers() {
			getUsers('/getUsers', { uid: this.uid, state: 0 }).then(async res => {
				// console.log(res);
				if (res.status == 200) {
					let arr = res.result;
					if (arr.length > 0) {
						arr.forEach(item => {
							item.avatar = this.$host.host + item.avatar;
							if (item.markname) {
								item.name = item.markname;
							}
							this.users.push(item);
						});
					}
					await this.getGroupUsers();
				} else {
					uni.showToast({
						title: '服务器异常',
						duration: 2000
					});
				}
			});
		},
		//获取群成员
		getGroupUsers() {
			getGroupUsers('/getGroupUsers', { gid: this.gid,uid:this.uid }).then(res => {
				// console.log(res);
				if (res.status == 200) {
					let arr = res.result;
					// console.log(arr,this.users)
					arr.forEach(item => {
						item.avatar = this.$host.host + item.avatar;
						//判断好友是否在群聊
						this.users.forEach(item2 => {
							if (item.uid == item2.id) {
								this.$set(item2, 'disabled', true);
								this.$set(item2, 'checked', true);
							}
						});
					});
					this.groupUser = arr;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../commons/css/mycss.scss';
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
.main {
	margin-top: 88rpx;
	width: 100%;
	.user-list {
		padding-top: 20rpx;
		.label {
			display: flex;
			margin: 20rpx;
			align-items: center;
		}
		.user-img {
			width: 80rpx;
			height: 80rpx;
			border-radius: $uni-border-radius-base;
			background-color: #ffe431;
			margin-left: 20rpx;
		}
		.name {
			margin-left: 20rpx;
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
	background-color: #fff;
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
	.disabled {
		background-color: $uni-bg-color-grey;
	}
}
</style>
