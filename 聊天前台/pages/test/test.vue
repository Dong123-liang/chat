<template>
	<view>
		<view class="upload" @tap="upload">上传图片</view>
		<view class="upload" @tap="search">查询</view>
	</view>
	
</template>

<script>
import { nanoid } from "nanoid";
export default {
	data() {
		return {};
	},
	methods: {
		
		upload() {
			console.log(nanoid())
			uni.chooseImage({
				count: 6, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album','camera'], //从相册选择
				success: chooseImageRes => {
					const tempFilePaths = chooseImageRes.tempFilePaths;
					tempFilePaths.forEach(item=>{
						console.log(item)
						const uploadTask = uni.uploadFile({
							url: 'http://localhost:3000/v1/files/upload', //仅为示例，非真实的接口地址
							filePath: item,
							name: 'file',
							fileType:'image',
							formData: {
								name:nanoid(),
								url:'url'
							},
							success: uploadFileRes => {
								console.log(uploadFileRes.data);
							}
						});
						
						uploadTask.onProgressUpdate(res => {
							console.log('上传进度' + res.progress);
							console.log('已经上传的数据长度' + res.totalBytesSent);
							console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
						
							// 测试条件，取消上传任务。
							// if (res.progress > 50) {
							// 	uploadTask.abort();
							// }
						});
						
					})
					
				}
			});
		},
		search(){
			uni.request({
				// url: 'http://localhost:3000/v1/index/getUsers',
				url: 'http://localhost:3000/v1/index/getOneMsg',
				method: 'post',
				header: {
					Authorization: uni.getStorageSync('token')
				},
				// data: {uid:'625815f0fb3bd9e7d7db3405',state:0},
				data: {uid:'625815f0fb3bd9e7d7db3405',fid:'6256d32f78bd7623675fd0c3'},
				success: res => {
					console.log(res)
				},
				fail: err => {
					
				},
				complete: (e) => {
					
				}
			})
		}
	}
};
</script>

<style lang="scss">
.upload {
	text-align: center;
	padding-top: 20rpx;
}
</style>
