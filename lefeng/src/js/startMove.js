/*
 * 运动函数
 * 参数：
 * 		elem：待操作的html元素
 * 		attr：html元素上的属性
 * 		target：属性的目标值
 * 参数说明：startMove能够让elem元素的attr属性以运动的形式，到达目标值
 */

function startMove(elem, json, callback){	
	clearInterval(elem.timer);
	elem.timer = setInterval(function(){
		var flag = true; // 假设每个属性都到达了目标值
		// 多属性同时运动
		for( var attr in json ){
			var target = json[attr];
			// 获取待移动的元素的当前属性值
			var v = getComputedStyle(elem)[attr];
			if( attr == "opacity" ){
				v = Math.round(v*100);
			}else{
				v = parseInt(v);
			}
			// 目标值与当前值的间距
			var dis = target-v;
			// 求移动时的步长
			var step = (dis/6);
			if( step > 0 ){
				step = Math.ceil(step);
			}else{
				step = Math.floor(step);
			}
			// 更新
			if( attr == "opacity" ){
				elem.style[attr] = (v+step)/100;
			}else{
				elem.style[attr] = v+step+"px";
			}
			// 只要有一个属性，没有到达目标值，flag就更新为false
			if( v+step != target ){
				flag = false;
			}
		}
		// 如果循环结束了，flag依然为真时，表示所有的属性都到达了目标值
		if( flag ){
			clearInterval(elem.timer);
			if( callback ){
				callback();
			}
		}
		
	}, 40);	
}
