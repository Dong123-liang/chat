<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="back"><image src="../../static/images/common/back.png" class="back-img"></image></view>
			<view class="top-bar-center">创建群聊</view>
			<view class="top-bar-right"></view>
		</view>
		
		<view class="main">
			<view class="top">
				<!-- 群头像 -->
				<view class="group-img">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					<image src="../../static/images/group/change.png"  class="pan"></image>
				</view>
				<!-- 群名字 -->
				<view class="group-name">
					<input v-model="name" @blur="judgeStatus" class="group-name-input" type="text" placeholder="取个名字吧" placeholder-style="color:#aaa;font-weight:400">
				</view>
				
				<view class="title">用户</view>
			</view>
			
			<!-- 选择用户 -->
			<view class="friends">
				<view class="user" v-for="(item,index) in friends" :key="index" @tap="selectFriend(item)">
					<view class="selected" :class="{active:item.selected}">
						<image src="../../static/images/group/choose.png" v-if="item.selected" class="selected-img"></image>
					</view>
					<image :src="item.avatar" class="user-img"></image>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
			
			<view class="bottom-bar">
				<button :disabled="disabled" class="bottom-btn" :class="{disabled:disabled}" @tap="create">创建({{num}})</button>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
	import {uploadFile,getUsers,createGroup} from '../../api/index.js';
	import { nanoid } from 'nanoid';
	export default {
		data() {
			return {
				tempFilePath:"",
				cropFilePath:"../../static/images/group/group.png",
				avatar:'/group/group.png',//默认提交
				disabled:true,
				name:'',
				uid: uni.getStorageSync('userid'),
				friends:[],//好友数组
				user:[],//已选择好友数组
			};
		},
		components: {
			ImageCropper
		},
		onLoad() {
			this.getUser()
		},
		computed:{
			num(){
				let arr=this.friends.filter(item=>item.selected==true)
				return arr.length
			}
		},
		watch:{
			num(){
				this.judgeStatus()
			}
		},
		methods:{
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			//创建群
			create(){
				//先过滤出数组
				let arr=this.friends.filter(item=>{
					if(item.selected==true){
						return item
					}
				})
				//然后再搞出id
				this.user=arr.map(item=>{
					if(item.selected==true){
						return item.id
					}
				})
				//添加群主
				this.user.push(this.uid)
				// console.log(this.user)
				createGroup('/createGroup',{uid:this.uid,name:this.name,avatar:this.avatar,user:this.user}).then(res=>{
					if(res.status==200){
						uni.showToast({
							title: '创建成功',
							duration: 2000
						});
						setTimeout(()=>{
							uni.navigateTo({
								url: '../index/index'
							});
						},2000)
					}
				})
			},
			//获取好友列表
			getUser() {
				getUsers('/getUsers', { uid: this.uid, state: 0 }).then(res => {
					// console.log(res);
					if (res.status == 200) {
						let arr = res.result;
						if (arr.length > 0) {
							arr.forEach(item => {
								item.avatar = this.$host.host + item.avatar;
								item.selected=false
								if (item.markname) {
									item.name = item.markname;
								}
								this.friends.push(item);
							});
						}
					} else {
						uni.showToast({
							title: '服务器异常',
							duration: 2000
						});
					}
				});
			},
			//判断按钮是否可用
			judgeStatus(){
				if(this.num>0 &&this.name!=''){
					this.disabled=false
				}else{
					this.disabled=true
				}
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
					this.cropFilePath=this.$host.host+res
					this.avatar=res
				});
			},
			cancel() {
				console.log('canceled');
				this.tempFilePath = '';
			},
			//动态选择用户
			selectFriend(item){
				if(item.selected){
					this.$set(item,'selected',false)
				}else{
					this.$set(item,'selected',true)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
@import '../../commons/css/mycss.scss';
.top-bar {
	border-bottom: 1px solid $uni-border-color;
	.top-bar-left {
		float: left;
		width: 88rpx;
		.back-img {
			height: 46rpx;
			width: 46rpx;
			margin-left: 21rpx;
			padding-top: 25rpx;
		}
	}

	.top-bar-center {
		line-height: 88rpx;
		text-align: center;
	}

	.top-bar-right {
		padding-right: 14rpx;
		float: right;
	}
}

.main{
	display: flex;
	flex-direction: column;
	.top{
		padding-top: 148rpx;
		position: fixed;
		width: 100%;
		z-index: 100;
		background-color: #fff;
	}
	.group-img{
		margin: 0 auto;
		width: 196rpx;
		height: 196rpx;
		background-color: #FFE431;
		box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39, 40, 50, 0.1);
		border-radius: 40rpx;
		position: relative;
		.user-img{
			width: 196rpx;
			height: 196rpx;
			border-radius: 40rpx;
			background-color: #FFE431;
		}
		.pan{
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			width: 56rpx;
			height: 56rpx;
			z-index: 10;
			margin: auto;
		}
	}
	.group-name{
		padding: 62rpx $uni-spacing-col-base 0;
		.group-name-input{
			text-align: center;
			height: 92rpx;
			background-color: $uni-bg-color-grey;
			border-radius: 46rpx;
			color: $uni-text-color;
			font-size: 32rpx;
		}
	}
	.title{
		padding: $uni-spacing-col-base $uni-spacing-row-base 20rpx;
		font-size: 44rpx;
		font-weight: 600;
		color: $uni-text-color;
		line-height: 60rpx;
	}
	.friends{
		padding: 600rpx $uni-spacing-col-base 100rpx;
		.user{
			display: flex;
			align-items: center;
			height: 120rpx;
			.selected{
				flex: none;
				width: 48rpx;
				height: 48rpx;
				background-color: rgba(255,248,49,0.5);
				border-radius: 24rpx;
				margin-right: 30rpx;
				position: relative;
				.selected-img{
					width: 30rpx;
					height: 20rpx;
					position: absolute;
					position: absolute; left: 50%; top: 50%;
					transform: translate(-50%, -50%);    /* 50%为自身尺寸的一半 */
				}
			}
			.active{
				background-color: rgba(255,248,49,1);
			}
			.user-img{
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
				background-color: #FFE431;
			}
			.name{
				padding-left: 32rpx;
				font-size: 36rpx;
				color: $uni-text-color;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
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
		.disabled{
			background-color:$uni-bg-color-grey;
		}
	}
}
</style>
