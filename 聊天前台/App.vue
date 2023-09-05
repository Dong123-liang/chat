<script>
	import {judgeToken} from './api/index.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//解决用户关闭应用时，并退出登陆时再次打开会回到启动页(首页)
			if(uni.getStorageSync('token')){
				//校验token
				judgeToken('/judgeToken').then(res=>{
					// console.log(res)
					if(res.status==500){
						uni.clearStorage();
						uni.reLaunch({
						    url: "./pages/signin/signin",
						    success: () => {
								// #ifdef APP-PLUS
						        plus.navigator.closeSplashscreen();//关闭启动页
								// #endif
								uni.showToast({
									title:"token已过期,请重新登录",
									duration:1000
								})
						    }
						})
					}else if(res.status==200){
						//校验成功则关闭启动页进入首页
						// #ifdef APP-PLUS
						plus.navigator.closeSplashscreen();
						/*需在mainfest.json中更改
						"app-plus" : {
						     "splashscreen" : {
						         "alwaysShowBeforeRender" : false,
						         "autoclose" : false,
						     }
						 }*/
						// #endif
					}
				}).catch((err)=>{
					// console.log(err)
					uni.reLaunch({
					    url: "./pages/signin/signin",
					    success: () => {
							// #ifdef APP-PLUS
					        plus.navigator.closeSplashscreen();//关闭启动页
							// #endif
					    }
					})
				})
				
				
			}else{
				//不存在则跳转至登录页
				        uni.reLaunch({
				            url: "./pages/signin/signin",
						    success: () => {
								// #ifdef APP-PLUS
						        plus.navigator.closeSplashscreen();//关闭启动页
								// #endif
						    }
				    	})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
