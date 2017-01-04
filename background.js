

//——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————

var img_status = '空闲';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if ( request.img_base64 ){
        if ( img_status != '空闲'){
            sendResponse({upload_status: '上传中'});//让他稍等
        }else{
            sendResponse({upload_status: '空闲'});//没问题，来吧
        }
        //开始上传
        img_status = '上传中';
        var xhr = new XMLHttpRequest();
        var data = new FormData();
        var _response = '',

        //——————————设置微博或 imgur 的信息——————————

        //参数 url、nick、logo用于水印内容
        post_url = 'http://picupload.service.weibo.com/interface/pic_upload.php?\
                    &mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog',
        patt_id = "pid\":\"(.*?)\"",
        url_start = 'http://ww2.sinaimg.cn/large/',
        url_end = '.jpg';

        if ( getCookie('imageHosting') != 'imgur' ){
            data.append('b64_data', request.img_base64);
        }else{
            data.append('image', request.img_base64);
            post_url = 'https://api.imgur.com/3/image';
            patt_id = "id\":\"(.*?)\"";
            url_start = 'https://i.imgur.com/';
            url_end = '.png';
        }

        //——————————微博或 imgur 的信息完成——————————

        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4) {
                if (xhr.status === 200 ){
                    _response =  xhr.responseText;
                    _response = RegExp( patt_id ).exec( _response );
                    _response = _response != null && _response[1] || '失败';//以防 API 更改
                    img_status = url_start + _response + url_end;
                    //console.log( "成功返回："+_response );// 返回成功数据
                }else{
                    img_status = '失败';
                    //console.log( "失败返回"+_response );// 返回成功数据
                }
            }
        };
        xhr.open('POST', post_url);
        if ( getCookie('imageHosting') == 'imgur' ){
	    xhr.setRequestHeader('Authorization', 'Client-ID 9311f6be1c10160');
	}
        xhr.send(data);
    }else if ( request.get_img_id ){//收到图片状态询问
        sendResponse({img_id: img_status});
        img_status != '上传中' && (img_status = '空闲');

//——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————


//——————————————————————————————————返回设置选项——————————————————————————————————

    }else if ( request.get_preview_status ){
        sendResponse({preview_status: getCookie('preview')});
    }else if ( request.get_allSetting ){
        sendResponse({dblclickToTop: getCookie('dblclickToTop')});
    }else if ( request.get_replySetting ){
        sendResponse({keyReplyColor: getCookie('keyReplyColor'), keyReplyA: getCookie('keyReplyA'), fold: getCookie('fold'), thankColor: getCookie('thankColor')});
    }else if ( request.get_newWindow_status ){
        sendResponse({newWindow_status: getCookie('newWindow')});
    }else if ( request.get_blockList ){
        $.get("https://www.v2ex.com",function(data,status){
            if(status == 'success'){
                var block_list = /blocked = \[(.*?)\];/.exec(data);
                var username = /首页<\/a>\&nbsp\;\&nbsp\;\&nbsp\;<a href="\/member\/(.+?)"/.exec(data);
                if ( block_list && username ){
                    block_list = block_list[1];
                    username = username[1];
                    chrome.tabs.create({url:"/block_list.html#"+username+'='+block_list});
                }else{
                    alert('扩展没有获取到任何信息 : (\n或许是您未登录 V2EX 账号');
                }
            }else{
                alert('扩展没有获取到任何信息 : (\n很有可能是网络问题，请稍后再试');
            }
        });
        sendResponse({blockList: 'get'});
    }
});

//——————————————————————————————————返回设置选项——————————————————————————————————


//——————————————————————————————————定时任务初始化——————————————————————————————————

!getCookie('newMsg') && checkMsg();
getCookie('autoMission') && autoMission();
chrome.alarms.create('checkMsg', {periodInMinutes: 5});
chrome.alarms.create('autoMission', {periodInMinutes: 60});
chrome.alarms.onAlarm.addListener(function( a ){
    switch (a.name){
        case 'checkMsg':
            !getCookie('newMsg') && checkMsg();
            break;
        case 'autoMission':
            getCookie('autoMission') && autoMission();
            getCookie('autoLoginWeibo') && autoLoginWeibo();
            break;
    }
});

//——————————————————————————————————定时任务初始化——————————————————————————————————


//——————————————————————————————————通知功能——————————————————————————————————

//现在是每5分钟刷新一次状态，除非点击了browserAction
function checkMsg(){
    $.get("https://www.v2ex.com/settings",function(data,status){
        if(status == 'success'){
            var sign = RegExp("([0-9]*?) (条未读提醒|unread)").exec(data);
            sign = sign != null && sign[1] || '未登录';
            if ( sign == '未登录' ){
                chrome.browserAction.setIcon({path: 'icon/icon38_nologin.png'});
            }else if( sign!='0') {
                chrome.browserAction.setIcon({path: 'icon/icon38_msg.png'});
                chrome.notifications.create(
                'newMsg' ,
                {
                                type       : 'basic',
                                iconUrl    : 'icon/icon38_msg.png',
                                title      : 'v2ex plus 提醒您',
                                message    : '您有 V2EX 的未读新消息，点击查看。',
                });
            }else{
                chrome.browserAction.setIcon({path: 'icon/icon38.png'});
            }
        }else{
            alert('V2EX消息获取失败：' + status);
        }
    });
}


//——————————————————————————————————通知功能——————————————————————————————————


//——————————————————————————————————通知/按钮点击反馈——————————————————————————————————

//清除通知图标，打开通知地址
function clean_msg(){
    chrome.browserAction.setIcon({path: 'icon/icon38.png'});
    chrome.tabs.create({url:"https://www.v2ex.com/notifications"});
}

chrome.browserAction.onClicked.addListener( clean_msg );
chrome.notifications.onClicked.addListener(function(notificationId){
    switch (notificationId){
        case 'newMsg':
            clean_msg();
            break;
        case 'autoMission':
            chrome.tabs.create({url:"https://www.v2ex.com/balance"});
            break;
    }
});

chrome.commands.onCommand.addListener(function(command) {
    clean_msg();
});


//——————————————————————————————————通知/按钮点击反馈——————————————————————————————————


//——————————————————————————————————自动签到——————————————————————————————————

function autoMission(){

    if( getCookie('autoMission') == new Date().getUTCDate() ){
        //console.log('今天已经成功领取奖励了');
        return;
    }

    $.ajax({
    url: "http://www.v2ex.com/settings",
    success: function(data){
                    var sign = RegExp("/signout(\\?once=[0-9]+)").exec(data);
                    sign = sign != null && sign[1] || '未登录';
                    if ( sign != '未登录' ){
                        $.ajax({
                            url: "http://www.v2ex.com/mission/daily/redeem" + sign,
                            success: function(data){
                                if (RegExp("查看我的账户余额").exec(data) != null ){
                                    chrome.notifications.create(
                                        'autoMission' ,
                                        {
                                            type       : 'basic',
                                            iconUrl    : 'icon/icon38_msg.png',
                                            title      : 'v2ex plus 提醒您',
                                            message    : '今日的登陆奖励已领取。\nTake your passion and make it come true.',
                                        }
                                    );
                                    setCookie( 'autoMission', new Date().getUTCDate() );
                                }else{
                                    alert('罕见错误！基本可以忽略，如果你遇见两次以上请联系开发者，当该提示已打扰到您，请关闭扩展的自动签到功能。');
                                }
                            },
                            error: function(){
                                alert('网络错误！今日奖励领取失败，等待一小时后自动重试或现在手动领取。');
                            }
                        });
                    }
        },
        error: function(){
                    alert('网络错误！今日奖励领取失败，等待一小时后自动重试或现在手动领取。');
        }
    });
}

    //————————————————设置 http 头————————————————

    //直接 ajax http头是不带 referer 的
    //无 referer 将一直返回”今日的奖励已经领取了哦“并且有领取奖励按钮
    var requestfilter = {
        urls: ["*://*.v2ex.com/mission/daily/*"]
    };

    var extrainfospec = ['requestheaders', 'blocking'];
    var handler = function(details) {

	var isrefererset = false;
	var headers = details.requestheaders;
	var blockingresponse = {};

	for (var i = 0, l = headers.length; i < l; ++i) {
	    if (headers[i].name == 'referer') {
		isrefererset = true;
		break;
	    }
	}

	if (!isrefererset) {
	    headers.push({
		name: "referer",
		value: "http://www.v2ex.com/mission/daily/"
	    });
	}

	blockingresponse.requestheaders = headers;
	return blockingresponse;
    };

    chrome.webrequest.onbeforesendheaders.addlistener(handler, requestfilter, extrainfospec);
/*
//针对 imgur 的测试
    var requestfilter = {
        urls: ["*://*.imgur.com/*"]
    };

    var extrainfospec = ['requestheaders', 'blocking'];
    var handler = function(details) {

	var isrefererset = false;
	var headers = details.requestheaders;
	var blockingresponse = {};

	for (var i = 0, l = headers.length; i < l; ++i) {
	    if (headers[i].name == 'referer') {
		isrefererset = true;
		break;
	    }
	}

	if (!isrefererset) {
	    headers['Origin'] = 'http://imgur.com';
	    headers.push({
		name: "referer",
		value: "http://imgur.com/"
	    });
	}

	blockingresponse.requestheaders = headers;
	return blockingresponse;
    };

    chrome.webrequest.onbeforesendheaders.addlistener(handler, requestfilter, extrainfospec);
*/

    //————————————————设置 http 头————————————————

//——————————————————————————————————自动签到——————————————————————————————————


//——————————————————————————————————自动登陆微博——————————————————————————————————

function autoLoginWeibo(){
    //console.log('0.8 测试版！ 目前准备自动激活微博');
    $.get('http://weibo.com');
}

//——————————————————————————————————自动登陆微博——————————————————————————————————
