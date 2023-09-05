<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/group/back.png" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img"><image src="../../static/images/group/more1.png" mode=""></image></view>
			</view>
		</view>
		<!-- 头部切换 -->
		<view class="top-bar bg-bar" :animation="animationData">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/group/back1.png" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img"><image src="../../static/images/group/more.png" mode=""></image></view>
			</view>
		</view>

		<view class="bg"><image :src="groupDetail.avatar" class="bg-img" mode="aspectFill"></image></view>

		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="name">{{groupDetail.name}}</view>
					<view class="time">{{dateChange(groupDetail.createTime)}}</view>
					<view class="notice">{{groupDetail.notice}}</view>
				</view>

				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more">管理群成员</view>
						<image src="../../static/images/userdetails/right.png" mode="aspectFill" class="more-img"></image>
					</view>

					<view class="member-ls">
						<view class="member-li clearfix" v-for="(item, index) in user" :key="index">
							<view class="imgs">
								<image @tap="deleteGroupUser(item)" v-if="uid==groupDetail.userid" src="../../static/images/group/delete.png" mode="aspectFill" class="delete"></image>
								<image @tap="toUserDetail(item)" :src="item.avatar" mode="aspectFit" class="user-img"></image>
							</view>
							<view class="member-name">{{ item.name }}</view>
						</view>
						<!-- 邀请 -->
						<view class="member-li clearfix" @tap="invitate">
							<view class="imgs"><image src="../../static/images/group/add.png" mode="aspectFit" class="user-add"></image></view>
							<view class="member-name">邀请</view>
						</view>
					</view>

					<view class="mitem">
						<view class="row" @tap="modify($event,'群名称')">
							<view class="title">群名称</view>
							<view class="content">{{groupDetail.name}}</view>
							<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFit"></image></view>
						</view>
						
						<view class="row">
							<view class="title">群头像</view>
							<view class="content">
								<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
								<image :src="cropFilePath" @tap="upload" class="group-img" mode="aspectFill"></image>
							</view>
							<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFit"></image></view>
						</view>

						<view class="row" @tap="modify($event,'群公告')">
							<view class="title">群公告</view>
							<view class="content">
								{{groupDetail.notice}}
							</view>
							<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFit"></image></view>
						</view>

						<view class="row" @tap="modify($event,'群内名')">
							<view class="title">群内名</view>
							<view class="content">{{groupUserName}}</view>
							<view class="more"><image src="../../static/images/userdetails/right.png" mode="aspectFit"></image></view>
						</view>

						<view class="row">
							<view class="title">消息免打扰</view>
							<view class="content"></view>
							<view class="more"><switch class="switch" color="rgba(255,228,49,1)" :checked="checked" @change="switchChange" /></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn" @tap="deleteGroup" v-if="uid==groupDetail.userid">解散群聊</view>
		<view class="btn" @tap="logout" v-else>退出群聊</view>
		
		<view class="modify" :style="{ bottom: -modifyHeight + 'px' }" :animation="animationData1">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">{{ modifyTitle }}</view>
				<view class="define" @tap="update">确定</view>
			</view>
		
			<view class="modify-main">
				<textarea  v-model="text" class="modify-content"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
import { dateChange } from '../../commons/js/myFun.js';
import { nanoid } from 'nanoid';
import {uploadFile,getGroupDetail,getGroupUsers,deleteGroupUser,deleteGroup,updateGroupDetail,getGroupName,updateGroupName} from '../../api/index.js';
export default {
	components: {
		ImageCropper
	},
	data() {
		return {
			group: {},//传递的群信息
			user: [],
			groupDetail:{},//群详细信息
			top:0,
			groupUserName:'',//群内名称
			uid: uni.getStorageSync('userid'),
			animationData: {},
			animationData1:{},
			checked:false,
			cropFilePath:"../../static/images/img/OIP-C.jpg",
			tempFilePath:"",
			text:'',
			modifyTitle:'',
			modifyHeight:1000,
		};
	},
	onLoad(options) {
		// console.log(options)
		this.group = options;
		this.getGroupDetail()
		this.getGroupUsers()
		this.getGroupName()
	},
	onReady() {
		this.getTop()
		this.getElements()
		this.addAnimate()
	},
	onPageScroll() {
		// console.log(this.top)
		this.getTop()
		this.addAnimate()
	},
	methods: {
		//返回
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		//去往邀请页面
		invitate(){
			uni.navigateTo({
				url:`../Invitation/Invitation?gid=${this.group.gid}`
			})
		},
		//移出群聊
		deleteGroupUser(item){
			console.log(item)
			uni.showModal({
				title: '提示',
				content: '是否移除改用户',
				success:res=>{
					if (res.confirm) {
						deleteGroupUser('/deleteGroupUser',{uid:item.uid,gid:this.group.gid}).then(res=>{
							console.log(res)
							if(res.status==200){
								this.getGroupUsers()
							}
						})
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//时间处理
		dateChange(val) {
			return dateChange(val);
		},
		//获取群详细信息
		getGroupDetail(){
			getGroupDetail('/getGroupDetail',{gid:this.group.gid}).then(res=>{
				// console.log(res)
				if(res.status==200){
					res.result.avatar=this.$host.host+res.result.avatar
					this.groupDetail=res.result
					this.cropFilePath=res.result.avatar
				}
				
			})
		},
		//前往用户页
		toUserDetail(item){
			uni.navigateTo({
				url: '../userhome/userhome?id=' + item.uid
			});
		},
		//获取群成员
		getGroupUsers(){
			getGroupUsers('/getGroupUsers',{gid:this.group.gid,uid:this.uid}).then(res=>{
				console.log(res)
				if(res.status==200){
					let arr = res.result;
					arr.forEach(item => {
						item.avatar = this.$host.host + item.avatar;
						if(item.markname){
							item.name=item.markname
						}
					});
					this.user = arr;
				}
			})
		},
		//获取群内名称
		getGroupName(){
			getGroupName('/getGroupName',{uid:this.uid,gid:this.group.gid}).then(res=>{
				if(res.status==200){
					this.groupUserName=res.result.name
				}
			})
		},
		//退出群聊
		logout() {
			uni.showModal({
				title: '提示',
				content: '是否退出该群聊',
				success:res=>{
					if (res.confirm) {
						deleteGroupUser('/deleteGroupUser',{uid:this.uid,gid:this.group.gid}).then(res=>{
							console.log(res)
							if(res.status==200){
								uni.showToast({
									title: '退出成功',
									duration: 2000
								});
								setTimeout(()=>{
									uni.navigateTo({
										url: '../index/index'
									});
								},2000)
							}
						})
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//解散群聊
		deleteGroup(){
			uni.showModal({
				title: '提示',
				content: '是否解散该群聊',
				success:res=>{
					if (res.confirm) {
						deleteGroup('/deleteGroup',{uid:this.uid,gid:this.group.gid}).then(res=>{
							console.log(res)
							if(res.status==200){
								uni.showToast({
									title: '解散成功',
									duration: 2000
								});
								setTimeout(()=>{
									uni.navigateTo({
										url: '../index/index'
									});
								},2000)
							}
						})
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		switchChange(e) {
			console.log('switch1 发生 change 事件，携带值为', e.detail.value);
		},
		//获取高度
		getTop() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.main-inner')
				.boundingClientRect(data => {
					this.top = data.top
				})
				.exec();
		},
		//顶部切换动画
		addAnimate(){
			var animation = uni.createAnimation({
				duration: 500,
				timingFunction: 'linear'
			});
			if(this.top<200 || this.top==0){
				animation.opacity(1).step()
			}else{
				animation.opacity(0).step()
			}
			this.animationData = animation.export();
		},
		//弹框动画
		modify(e, type, data) {
			this.text = data;
			this.modifyTitle=type
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
		
			this.animationData1 = animation.export();
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
			uploadFile('/upload', this.cropFilePath, { name: nanoid(), url: 'group' }, 'image').then(res => {
				console.log(res);
				if (res) {
					updateGroupDetail('/updateGroupDetail', { gid: this.group.gid, type: 'avatar', data: res }).then(res => {
						if (res.status === 200) {
							uni.showToast({
								title: '修改成功',
								duration: 2000
							});
							this.getGroupDetail()
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
		//确定修改
		update(){
			if(this.modifyTitle=='群名称'){
				updateGroupDetail('/updateGroupDetail', { gid: this.group.gid, type: 'name', data: this.text }).then(res => {
					if (res.status === 200) {
						this.modify();
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
						this.getGroupDetail()
					} else {
						uni.showToast({
							title: '服务器异常',
							duration: 2000
						});
					}
				});
			}else if(this.modifyTitle=='群公告'){
				updateGroupDetail('/updateGroupDetail', { gid: this.group.gid, type: 'notice', data: this.text }).then(res => {
					if (res.status === 200) {
						this.modify();
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
						this.getGroupDetail()
					} else {
						uni.showToast({
							title: '服务器异常',
							duration: 2000
						});
					}
				});
			}else if(this.modifyTitle=='群内名'){
				updateGroupName('/updateGroupName',{uid:this.uid,gid:this.group.gid,name:this.text}).then(res=>{
					if (res.status === 200) {
						this.modify();
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
						this.getGroupName()
					} else {
						uni.showToast({
							title: '服务器异常',
							duration: 2000
						});
					}
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../commons/css/mycss.scss';
.clearfix ::after {
	clear: both;
	display: block;
	content: '';
}

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
.bg-bar{
	background-color: #fff;
	opacity: 0;
}
.bg {
	width: 100%;
	height: 100%;
	background-color: #fff;
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
	.bg-img {
		width: 100%;
		height: 750rpx;
	}
}
.main {
	padding-top: 360rpx;
	.main-inner {
		width: 100%;
		min-height: 720rpx;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		.inf {
			padding: $uni-spacing-row-base $uni-spacing-col-base 0;
			padding-bottom: 40rpx;
			box-sizing: border-box;
			border-bottom: 1px solid $uni-border-color;
		}
		.name {
			float: left;
			font-size: 48rpx;
			font-weight: 600;
			color: #272832;
			line-height: 66rpx;
		}
		.time {
			float: right;
			font-size: 28rpx;
			color: rgba(39, 40, 50, 0.5);
			line-height: 66rpx;
		}
		.notice {
			padding-top: 20rpx;
			font-size: 28rpx;
			color: #272832;
			line-height: 40rpx;
			clear: both;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}

	.member {
		.top {
			padding: $uni-spacing-row-base $uni-spacing-col-base 0;
			box-sizing: border-box;
			width: 100%;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.title {
				flex: 1;
				font-size: 36rpx;
				font-weight: 600;
				color: #272832;
			}
			.more {
				float: right;
				padding-right: 20rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: rgba(39, 40, 50, 0.6);
			}
			.more-img {
				width: 30rpx;
				height: 28rpx;
				margin-top: 5rpx;
			}
		}

		.member-ls {
			width: 100%;
			padding: 20rpx 16rpx;
			box-sizing: border-box;
			.member-li {
				padding-bottom: 32rpx;
				width: 20%;
				float: left;
				text-align: center;
				.imgs {
					display: inline-block;
					position: relative;
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
					background-color: $uni-color-primary;
					.user-img {
						width: 104rpx;
						height: 104rpx;
						border-radius: 20rpx;
					}
					.delete {
						width: 40rpx;
						height: 40rpx;
						position: absolute;
						top: -16rpx;
						right: -16rpx;
						z-index: 10;
					}
				}
				.member-name {
					padding: 0 8rpx;
					font-size: 28rpx;
					color: #272832;
					line-height: 40rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.user-add {
					width: 104rpx;
					height: 104rpx;
					padding: 31rpx;
					box-sizing: border-box;
				}
			}
		}

		.mitem {
			border-top: 1px solid $uni-border-color;
			border-bottom: 1px solid $uni-border-color;
			display: flex;
			flex-direction: column;
			padding-top: 22rpx;
			width: 100%;
			.row {
				display: flex;
			}
			.title {
				flex: none;
				padding-left: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				line-height: 112rpx;
				color: $uni-text-color;
			}
			.content {
				flex: auto;
				height: 112rpx;
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
			.group-img{
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				margin-top: 16rpx;
			}
			.switch{
				margin-right: 22rpx;
			}
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
