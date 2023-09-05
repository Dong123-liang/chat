//测试
export function dataTime(time) {
	let old = new Date(time);
	let now = new Date();
	//获取old具体时间
	let d = old.getTime();
	let h = old.getHours();
	let m = old.getMinutes();
	let Y = old.getFullYear();
	let M = old.getMonth() + 1;
	let D = old.getDate();
	//获取now具体时间
	let nd = now.getTime();
	let nh = now.getHours();
	let nm = now.getMinutes();
	let nY = now.getFullYear();
	let nM = now.getMonth() + 1;
	let nD = now.getDate();
	//如果年月日都相等(当天时间)
	if (D === nD && Y === nY && M === nM) {
		if (h < 10) {
			h = '0' + h
		}
		if (m < 10) {
			m = '0' + m
		}
		return h + ":" + m
	}
	//前一天时间
	if (D + 1 === nD && Y === nY && M === nM) {
		if (h < 10) {
			h = '0' + h
		}
		if (m < 10) {
			m = '0' + m
		}
		return '昨天' + h + ":" + m
	} else if (Y === nY) {
		//今年
		if (h < 10) {
			h = '0' + h
		}
		if (m < 10) {
			m = '0' + m
		}
		return M + '月' + D + '日' + h + ":" + m
	} else {
		//大于今年
		if (h < 10) {
			h = '0' + h
		}
		if (m < 10) {
			m = '0' + m
		}
		return Y + '年' + M + '月' + D + '日' + h + ":" + m
	}
}

//详细时间
export function dateChange(time) {
	let old = new Date(time);
	let d = old.getTime();
	let h = old.getHours();
	let m = old.getMinutes();
	let Y = old.getFullYear();
	let M = old.getMonth() + 1;
	let D = old.getDate();
	if (M < 10) {
		M = '0' + M
	}
	if (D < 10) {
		D = '0' + D
	}
	if (h < 10) {
		h = '0' + h
	}
	if (m < 10) {
		m = '0' + m
	}

	return Y + '-' + M + '-' + D + ' ' + h + ':' + m
}

//创建文件夹时间
export function fileName(time) {
	let old = new Date(time);
	let d = old.getTime();
	let h = old.getHours();
	let m = old.getMinutes();
	let Y = old.getFullYear();
	let M = old.getMonth() + 1;
	let D = old.getDate();
	if (M < 10) {
		M = '0' + M
	}
	if (D < 10) {
		D = '0' + D
	}

	return Y + M + D
}

// 仿微信时间显示格式转换 @time 时间戳毫秒
export function weChatTimeFormat(time) {
	const today = new Date().getTime()
	// 当前时间减去获取到的时间
	const sub = today - time
	const day = 1000 * 60 * 60 * 24
	const timeDate = new Date(time)
	const currentYear = new Date().getFullYear()
	const getYear = new Date(time).getFullYear()
	const HHmm = `${formatTime2("hh", timeDate)}:${formatTime2("mm", timeDate)}`
	const showWeekDay = isShowWeekDay(sub, timeDate.getDay())
	if (currentYear > getYear) {
		return `${formatTime2("yyyy年MM月dd日", timeDate)} ${todayTimeFormat(timeDate.getHours())} ${formatTime2("hh:mm", timeDate)}`
	} else if (showWeekDay) {
		return `${weekFormat(timeDate.getDay())} ${HHmm}`
	} else if (sub > day && sub < day * 2) {
		return `昨天 ${HHmm}`
	} else if (sub <= day) {
		return HHmm
	} else {
		return `${formatTime2("MM月dd日", timeDate)} ${todayTimeFormat(timeDate.getHours())} ${formatTime2("hh:mm", timeDate)}`
	}
}

// 星期格式转换 0-6：周日到周六
function weekFormat(e, prefix = "周") {
	switch (e) {
		case 0:
			return prefix + "日"
			break;
		case 1:
			return prefix + "一"
			break;
		case 2:
			return prefix + "二"
			break;
		case 3:
			return prefix + "三"
			break;
		case 4:
			return prefix + "四"
			break;
		case 5:
			return prefix + "五"
			break;
		case 6:
			return prefix + "六"
			break;
		default:
			return ""
			break;
	}
}
// 转换今日的时辰格式
function todayTimeFormat(e) {
	if (e >= 0 && e < 7) {
		return "凌晨"
	} else if (e >= 7 && e < 11) {
		return "上午"
	} else if (e >= 11 && e < 13) {
		return "中午"
	} else if (e >= 13 && e < 18) {
		return "下午"
	} else if (e >= 18 && e < 24) {
		return "晚上"
	} else {
		return ""
	}
}

// 是否显示周几
function isShowWeekDay(sub, weekDay) {
	const currentWeekDay = new Date().getDay()
	const dayTime = 1000 * 60 * 60 * 24
	// 1.当前时间与消息时间相差必须大于2天小于7天
	// 2.当前时间距离本周一相差必须大于2天且小于当前距离周一的天数
	// 3.消息时间不可能是0-周日，因为周日没有给后面时间留空间，不会走这里的逻辑，而是走今天的逻辑
	if (sub >= dayTime * 2 && weekDay !== 0 && sub <= dayTime * currentWeekDay) {
		return true
	} else {
		return false
	}
}

//时间格式化兼容 ios
function formatTime2(fmt, timestamp) {
	let date = new Date(timestamp) // 兼容safari
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
		'q+': Math.floor((date.getMonth() + 3) / 3),
		'S': date.getMilliseconds()
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
		}
	}
	return fmt
}



/**
 * 对Date的扩展，将 Date 转化为指定格式的String。
 *
 *  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)。
 *
 *  【示例】：
 *  common.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
 *  common.formatDate(new Date(), 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
 *  common.formatDate(new Date(), 'hh:mm:ss.S')            ==> 08:09:04.423
 *  
 *  @author 即时通讯网([url=http://www.52im.net]http://www.52im.net[/url])
 */
let _formatDate = function(date, fmt) {
	let o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
			"00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

/**
 * 仿照微信中的消息时间显示逻辑，将时间戳（单位：毫秒）转换为友好的显示格式.
 *
 * 1）7天之内的日期显示逻辑是：今天、昨天(-1d)、前天(-2d)、星期？（只显示总计7天之内的星期数，即<=-4d）；
 * 2）7天之外（即>7天）的逻辑：直接显示完整日期时间。
 *
 * @param  {[long]} timestamp 时间戳（单位：毫秒），形如：1550789954260
 * @param {boolean} mustIncludeTime true表示输出的格式里一定会包含“时间:分钟”
 * ，否则不包含（参考微信，不包含时分的情况，用于首页“消息”中显示时）
 *
 * @return {string} 输出格式形如：“刚刚”、“10:30”、“昨天 12:04”、“前天 20:51”、“星期二”、“2019/2/21 12:09”等形式
 * @author 即时通讯网([url=http://www.52im.net]http://www.52im.net[/url])
 * @since 1.1
 */
export function getTimeStringAutoShort(timestamp, mustIncludeTime) {

	// 当前时间
	let currentDate = new Date();
	// 目标判断时间
	let srcDate = new Date(timestamp);
	// console.log(srcDate)

	let currentYear = currentDate.getFullYear();
	let currentMonth = (currentDate.getMonth() + 1);
	let currentDateD = currentDate.getDate();

	let srcYear = srcDate.getFullYear();
	let srcMonth = (srcDate.getMonth() + 1);
	let srcDateD = srcDate.getDate();

	let ret = "";

	// 要额外显示的时间分钟
	let timeExtraStr = (mustIncludeTime ? " " + _formatDate(srcDate, "hh:mm") : "");

	// 当年
	if (currentYear == srcYear) {
		let currentTimestamp = currentDate.getTime();
		let srcTimestamp = timestamp;
		// 相差时间（单位：毫秒）
		let deltaTime = (currentTimestamp - srcTimestamp);

		// 当天（月份和日期一致才是）
		if (currentMonth == srcMonth && currentDateD == srcDateD) {
			// 时间相差60秒以内
			if (deltaTime < 60 * 1000)
				ret = "刚刚";
			// 否则当天其它时间段的，直接显示“时:分”的形式
			else
				ret = _formatDate(srcDate, "hh:mm");
		}
		// 当年 && 当天之外的时间（即昨天及以前的时间）
		else {
			// 昨天（以“现在”的时候为基准-1天）
			let yesterdayDate = new Date();
			yesterdayDate.setDate(yesterdayDate.getDate() - 1);

			// 前天（以“现在”的时候为基准-2天）
			let beforeYesterdayDate = new Date();
			beforeYesterdayDate.setDate(beforeYesterdayDate.getDate() - 2);

			// 用目标日期的“月”和“天”跟上方计算出来的“昨天”进行比较，是最为准确的（如果用时间戳差值
			// 的形式，是不准确的，比如：现在时刻是2019年02月22日1:00、而srcDate是2019年02月21日23:00，
			// 这两者间只相差2小时，直接用“deltaTime/(3600 * 1000)” > 24小时来判断是否昨天，就完全是扯蛋的逻辑了）
			if (srcMonth == (yesterdayDate.getMonth() + 1) && srcDateD == yesterdayDate.getDate())
				ret = "昨天" + timeExtraStr; // -1d
			// “前天”判断逻辑同上
			else if (srcMonth == (beforeYesterdayDate.getMonth() + 1) && srcDateD == beforeYesterdayDate.getDate())
				ret = "前天" + timeExtraStr; // -2d
			else {
				// 跟当前时间相差的小时数
				let deltaHour = (deltaTime / (3600 * 1000));

				// 如果小于或等 7*24小时就显示星期几
				if (deltaHour <= 7 * 24) {
					let weekday = new Array(7);
					weekday[0] = "星期日";
					weekday[1] = "星期一";
					weekday[2] = "星期二";
					weekday[3] = "星期三";
					weekday[4] = "星期四";
					weekday[5] = "星期五";
					weekday[6] = "星期六";

					// 取出当前是星期几
					let weedayDesc = weekday[srcDate.getDay()];
					ret = weedayDesc + timeExtraStr;
				}
				// 否则直接显示完整日期时间
				else
					ret = _formatDate(srcDate, "yyyy/M/d") + timeExtraStr;
			}
		}
	}
	// 往年
	else {
		ret = _formatDate(srcDate, "yyyy/M/d") + timeExtraStr;
	}

	return ret;
};
/*调用方式
// 用于首页“消息”界面时
getTimeStringAutoShort(1550789954260, false);
// 用于聊天内容界面时
getTimeStringAutoShort(1550789954260, true);
*/
//防抖 延时搜索
export function debounce(fn,t){
	let delay = t || 500
	let timer;
	return function(){
		let args =arguments
		if(timer){
			clearInterval(timer)
		}
		timer=setTimeout(()=>{
			timer=null
			fn.apply(this,args)
		},delay)
	}
}

//排序
export function mysort(arr,obj,tip){
	let s;
	if(tip==0){
		//降序排序
		for(let i=1;i<arr.length;i++){
			for(let j=i;j>0;j--){
				if(arr[j][obj]>arr[j-1][obj]){
					s=arr[j]
					arr[j]=arr[j-1]
					arr[j-1]=s
				}
			}
		}
	}else if(tip==1){
		//升序
		for(let i=1;i<arr.length;i++){
			for(let j=i;j>0;j--){
				if(arr[j][obj]<arr[j-1][obj]){
					s=arr[j]
					arr[j]=arr[j-1]
					arr[j-1]=s
				}
			}
		}
	}
	return arr
}