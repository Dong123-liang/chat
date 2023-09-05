export default {
	friends: () => {
		let friendArr = [{
			id: 1,
			imgurl: 'R-C.jpg',
			tip: 2,
			name: '大海',
			email: '2324094523@qq.com',
			time: new Date(),
			news: '我是一只小小鸟'
		}, {
			id: 2,
			imgurl: 'R-C.jpg',
			tip: 2,
			name: '蘑菇',
			time: new Date(),
			email: '2324094523@qq.com',
			news: '我是一只小小鸟'
		}, {
			id: 3,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '石头',
			time: new Date(),
			email: '2324094523@qq.com',
			news: '我是一只小小鸟'
		}, {
			id: 4,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 5,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 6,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 7,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 8,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 9,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 10,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 11,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 12,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}, {
			id: 13,
			imgurl: 'OIP-C.jpg',
			tip: 2,
			name: '憨憨',
			time: new Date(),
			news: '我是一只小小鸟',
			email: '2324094523@qq.com',
		}]
		return friendArr
	},

	isFrinends() {
		let isfriends = [{
				userid: 1,
				friends: 2,
			},
			{
				userid: 1,
				friends: 5,
			},
			{
				userid: 1,
				friends: 6,
			},
			{
				userid: 1,
				friends: 8,
			}
		]
		return isfriends
	},
	message() {
		let msgs = [
			{
				id: 'b',
				imgurl: 'R-C.jpg',
				message: {
					name:'天安门城楼售票处',
					address:'东长安街天安门城楼内',
					latutide:'39.909473',
					longitude:'116.39730899999999'
				},
				types: 3,//0 文字 1图片 2音频
				time: new Date().getTime(),
				tip: 0
			},
			{
				id: 'a',
				imgurl: 'R-C.jpg',
				message: {
					voice:'a',
					time:20,
				},
				types: 2,//0 文字 1图片 2音频
				time: new Date().getTime()-1,
				tip: 1
			},
			{
				id: 'a',
				imgurl: 'R-C.jpg',
				message: {
					voice:'a',
					time:60,
				},
				types: 2,//0 文字 1图片 2音频
				time: new Date().getTime()-10,
				tip: 2
			},
			{
				id: 'a',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对接的都要废除了，要重新写接口重新联调了，你们那边是需要加个标题对吧，我们先用原先的加把？这样工作量小一些',
				types: 0,//0 文字 1图片 2音频
				time: new Date().getTime()-1000,
				tip: 3
			},
			{
				id: 'b',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对接的都要废除了，要重新写接口重新联调了，你们那边是需要加个标题对吧，我们先用原先的加把？这样工作量小一些',
				types: 1,
				time: new Date().getTime()-1000*60,
				tip: 4
			},
			{
				id: 'b',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对接的都要废除了，要重新写接口重新联调了，你们那边是需要加个标题对吧，我们先用原先的加把？这样工作量小一些',
				types: 0,
				time: new Date().getTime()-1000*65,
				tip: 5
			},
			{
				id: 'b',
				imgurl: 'R-C.jpg',
				message: {voice:'',time:60},
				types: 2,
				time: new Date().getTime()-1000*66,
				tip: 6
			},
			{
				id: 'c',
				imgurl: 'OIP-C.jpg',
				message: '嗯 这个改的话之前跟后端对接的都要废除了，要重新写接口重新联调了，你们那边是需要加个标题对吧，我们先用原先的加把？这样工作量小一些',
				types: 0,
				time: new Date().getTime()-1000*60*24*24,
				tip: 7
			},
			{
				id: 'd',
				imgurl: 'OIP-C.jpg',
				message: '嗯 这个改的话之前跟后端对接的都要废除了，要重新写接口重新联调了，你们那边是需要加个标题对吧，我们先用原先的加把？这样工作量小一些',
				types: 1,
				time: new Date().getTime()-1000*60*30*24,
				tip: 8
			},
			{
				id: 'e',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对',
				types: 0,
				time: new Date().getTime()-1000*60*35*10*5,
				tip: 9
			},
			{
				id: 'e',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对',
				types: 0,
				time: new Date().getTime()-1000*60*35*10*6,
				tip: 10
			},
			{
				id: 'e',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对',
				types: 0,
				time: new Date().getTime()-1000*60*35*10*7,
				tip: 11
			},
			{
				id: 'e',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对',
				types: 0,
				time: new Date().getTime()-1000*60*35*10*8,
				tip: 12
			},
			{
				id: 'e',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对',
				types: 0,
				time: new Date().getTime()-1000*60*35*10*9,
				tip: 13
			},
			{
				id: 'e',
				imgurl: 'R-C.jpg',
				message: '嗯 这个改的话之前跟后端对',
				types: 0,
				time: new Date().getTime()-1000*60*35*10*10,
				tip: 14
			},
		]
		return msgs
	}
}
