/*
超星学习通刷课脚本
作者：ZXinL-CN(github)
版本：1.0
功能：支持看完自动跳转下一节，暂停自动播放，倍速播放，不能自动答题
*/
var rate=1;//播放速度
var jobCount=document.getElementsByClassName('jobCount');//未完成的课程数组
var no_done_number=0;//未完成课的计数
var cp="";//这一章
var np="";//下一章
var timeout=0;//如果播放视频超时，或者没有视频，则跳过这一章节
var isplay=true;//是否播放

drawWindow();

 
function drawWindow(){//绘制窗口
	//加载css文件
	$('head').append('<link href="https://cdn.jsdelivr.net/gh/ZXinL-CN/xxt04@1.0/chaoxing.css" rel="stylesheet" type="text/css" />');

	//下面是标签拼接
	$("body").append("<div id='skdiv' class='skdiv mybody'></div>");
	$("#skdiv").html("<div id='guanbi' class='guanbi'></div><div id='biaoti' class='biaoti'></div> <p class='zhixian'></p> <div id='bofang' clsaa='bofang'></div><div id='jindu' class='jindu'></div> <p class='zhixian'></p> <div id='zhangjie' class='zhangjie'>");
	$("#biaoti").html("<strong>学习通刷课脚本</strong><br/><span>（可用鼠标拖动）</span>");
	$("#bofang").html("<strong id='rate_txt' class='rate_txt' >播放速度：1X</strong><button id='b1' class='mybutton'>△</button><button id='b2' class='mybutton'>▽</button><br/><button id='startplay' class='start' onclick=\"init()\">点击开始播放</button>");
	$("#jindu").html("<strong>当前进度:&nbsp;&nbsp;<span id='progress' class='progress'>0%</span></strong>");
	$("#zhangjie").html("<strong id='cp'>当前章节：</strong><br/><strong id='np'>下一章节：</strong>");

}

dragPanelMove();

//鼠标点击隐藏刷课框
function dragPanelMove(){
		var isGB = false;
		$('#guanbi').click(function(e){
			if(!isGB){
				$('#skdiv').animate({"width":"10px","height":"10px","left":"-5px","border-radius":"50%"},"slow");
				$('#guanbi').animate({"width":"100%","height":"100%","top":"0","right":"0","border-radius":"0"},"fast");
				isGB = true;
			} else{
				$('#skdiv').animate({"width":"200px","height":"260px","left":"0","border-radius":"5px"},"fast");
				$('#guanbi').animate({"width":"50px","height":"50px","top":"-25px","right":"-25px","border-radius":"50%"},"slow");
				isGB = false;
			}

		})
}
//初始化数据
function init(){
	console.log("正在加载...");
	
		$('#startplay').text("正在播放中...");
		//获取刷课顺序
		loadName();//加载章节名字
		clickNext();//点击视频
		if(jobCount==undefined){
			console.log("章节信息加载失败,或者已经完成课程");
			isplay==false;
		}

		//改变播放速度
		$("#b1").click(function(){
			if(rate<10)rate+=0.25;
			$("#rate_txt").text('播放速度：'+rate+"X");
		});
	
		$("#b2").click(function(){
			if(rate>1)rate-=0.25;
			$("#rate_txt").text('播放速度：'+rate+"X");
		});
		console.log("加载成功，开始播放");
}


//开始运行
function play(){

	var doc=$("#iframe").contents().find('iframe').contents();
	
	//检测课程是否完成
	if(no_done_number>jobCount.length){
		setTimeout("'视频已经播放完毕！'",5000);
		window.location.href='http://i.mooc.chaoxing.com/space/index.shtml';
		
		isplay=false;
	}else{
		
		//如果加载视频超时，直接强制跳过这个视频。
		if(timeout>100){
			clickNext();
			timeout=0;
		}
		
		//如果视频正在加载
		if(doc.find('#loading').css('visibility')!='hidden'){
			console.log("%c%s","color: red; font-size: 10px;","正在查找视频，如果不存在，将在："+((10000-timeout*100)/1000)+"  秒后跳过当前视频");
			timeout++;
			if(isplay==true)setTimeout("play()",100);
		}else{
				timeout=0;

		
				var noSound=doc.find('.vjs-vol-3').eq(0);//禁音按钮
				var playbutton=doc.find('.vjs-play-control').eq(0);//播放按钮
				var playRate=doc.find('.vjs-progress-holder').eq(0).attr('aria-valuenow');//播放完成百分比
		
				if(playbutton.text()==undefined||playRate==undefined){
					//视频信息获取失败
				}else{
					
					//点击播放按钮
					doc.find('#video button').eq(0).click();
			
					//静音
					if(noSound!=null)noSound.click();
		
					//如果暂停，点击播放
					if(playbutton.text()=="播放")setTimeout("$('#iframe').contents().find('iframe').contents().find('.vjs-play-control').eq(0).click();",100);
		
					//如果没有播放完毕，继续运行
					if(playRate!=100){
							//实时改变播放速度
							document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('video').playbackRate=rate;
							$('#progress').text(playRate+"%");
							$('#startplay').text("正在自动播放,无需其他操作");
					}else if(playRate==100){//如果播放结束
						//每次结束玩就点击下一个视频节点
						clickNext();
					}
				
				}
	
				if(isplay==true)setTimeout("play()",100);//继续运行progress
		
		}

		
	}
		

}

//点击下一个视频节点
function clickNext(){
	
	//点击视频连接
	jobCount[no_done_number].parentNode.getElementsByTagName('a')[0].click();//点击链接
	
	//点击视频按钮
	setTimeout("clickPlayButton();",1000);
	
	//如果视频已经播放完成
	setTimeout("isfinished()",2000);
	
}


//如果视频已经播放完成，就播放下一个视频
function isfinished(){
	if($('#iframe').eq(0).contents().find('.ans-job-finished').length==1){
		setTimeout(" clickNext()",2000);
		console.log("视频已经播放完毕，开始跳转下一节");
	}else{
		loadName();
		setTimeout("play()",2000); 
	}
	no_done_number++;
}

//加载章节名称
function loadName(){

	document.getElementsByClassName('jobCount')[0].parentNode.getElementsByTagName('span')[2].innerText
	cp=jobCount[no_done_number].parentNode.getElementsByTagName('span')[2].innerText;  //当前章节
	if(jobCount[no_done_number+1]!=undefined)np=jobCount[no_done_number+1].parentNode.getElementsByTagName('span')[2].innerText;  //下一章节
	else np="无";
	$("#cp").text("当前章节："+cp);
	$("#np").text("下一章节："+np);
		
	
}

//点击视频按钮
function clickPlayButton(){
	for(var i=0;i<$('.tabtags').find('span').length;i++){
		if($('.tabtags').find('span').eq(i).text().replace(/\s*/g,"")=="视频"){
			$('.tabtags').find('span').eq(i).click();
			break;
		}
	}
}

