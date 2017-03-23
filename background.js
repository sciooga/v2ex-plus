// WebExtension is cross-platform
// Why would anyone call `chrome` api in it?
if (typeof browser === 'undefined' &&
    typeof chrome === 'object'){
        console.log("On Chrome");
        var browser = chrome;
    }

browser.runtime.onInstalled.addListener(function(e){
    // Open options page if it's first install
    if (e.reason === 'install')
        browser.runtime.openOptionsPage();

    // Versions before 1.2.0 use cookies and need reset
    // 1.2.0 was released without updating migration
    // Should be safe to remove after 1.3.0 is released
    if (e.reason === 'update' &&
        e.previousVersion === '1.2.0' ||
        e.previousVersion.substring(0,3) !== '1.2'){
        browser.notifications.create({
            type   : 'basic',
            iconUrl: 'icon/icon38_msg.png',
            title  : '我们刚刚进行了更新',
            message: '存储配置的方式得到了优化，但是先前的配置都将被重设。如有需要请在配置页面中重新设置。',
        });
        browser.runtime.openOptionsPage();
    }
});

//——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————
const s = localStorage;

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if ( request.img_base64 ){

        //——————————设置微博或 imgur 的信息——————————
        if ( s.getItem('imageHosting') === 'weibo' ){
            var post_url = 'http://picupload.service.weibo.com/interface/pic_upload.php?\
                        ori=1&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog',
                patt_id = "pid\":\"(.*?)\"",
                url_start = 'https://ws2.sinaimg.cn/large/',
                url_end = '.jpg',
                data = {'b64_data': request.img_base64};
        }else{
            var post_url = 'https://api.imgur.com/3/image',
                patt_id = "id\":\"(.*?)\"",
                url_start = 'https://i.imgur.com/',
                url_end = '.png',
                data = {'image': request.img_base64};
        }
        //——————————微博或 imgur 的信息完成——————————

        $.ajax({
            url: post_url,
            method: 'POST',
            data: data,
            dataType: 'text',
            beforeSend: (xhr) => {
                if ( s.getItem('imageHosting') === 'imgur' )
                    xhr.setRequestHeader('Authorization', 'Client-ID 9311f6be1c10160');
            },
            success: (data) => {
                try{
                    img_status = url_start + RegExp(patt_id).exec(data)[1] + url_end;
                    console.log("Succeed: "+ img_status);
                }
                catch(e){
                    console.error("Field not found");
                    img_status = "Failed";
                }
            },
            error: () => {
                img_status = "Failed";
                console.info("Request failed");
            },
            complete: () => {
                sendResponse({img_status: img_status});
            }
        });
        return true;
//——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————


//——————————————————————————————————返回设置选项——————————————————————————————————

    }else if ( request.get_preview_status ){
        sendResponse({preview_status: Number(s.getItem('preview'))});
    }else if ( request.get_allSetting ){
        sendResponse({dblclickToTop: Number(s.getItem('dblclickToTop'))});
    }else if ( request.get_replySetting ){
        sendResponse({replyColor: s.getItem('replyColor'), replyA: s.getItem('replyA'), fold: s.getItem('fold'), thankColor: s.getItem('thankColor')});
    }else if ( request.get_newWindow_status ){
        sendResponse({newWindow_status: Number(s.getItem('newWindow'))});
    }else if ( request.get_blockList ){
        $.get("https://www.v2ex.com",function(data,status){
            if(status == 'success'){
                var block_list = /blocked = \[(.*?)\];/.exec(data);
                var username = /首页<\/a>\&nbsp\;\&nbsp\;\&nbsp\;<a href="\/member\/(.+?)"/.exec(data);
                if ( block_list && username ){
                    block_list = block_list[1];
                    username = username[1];
                    browser.tabs.create({url:"/page/block_list.html#"+username+'='+block_list});
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


Number(s.getItem('newMsg')) && checkMsg();
Number(s.getItem('autoMission')) && autoMission();
browser.alarms.create('checkMsg', {periodInMinutes: 5});
browser.alarms.create('autoMission', {periodInMinutes: 60});

browser.alarms.onAlarm.addListener(function( a ){
    switch (a.name){
        case 'checkMsg':
            Number(s.getItem('newMsg')) && checkMsg();
            break;
        case 'autoMission':
            Number(s.getItem('autoMission')) && autoMission();
            Number(s.getItem('autoLoginWeibo')) && autoLoginWeibo();
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
                browser.browserAction.setIcon({path: 'icon/icon38_nologin.png'});
            }else if( sign!='0') {
                browser.browserAction.setIcon({path: 'icon/icon38_msg.png'});
                browser.notifications.create(
                'newMsg' ,
                {
                                type       : 'basic',
                                iconUrl    : 'icon/icon38_msg.png',
                                title      : 'v2ex plus 提醒您',
                                message    : '您有 V2EX 的未读新消息，点击查看。',
                });
            }else{
                browser.browserAction.setIcon({path: 'icon/icon38.png'});
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
    browser.browserAction.setIcon({path: 'icon/icon38.png'});
    browser.tabs.create({url:"https://www.v2ex.com/notifications"});
}

browser.browserAction.onClicked.addListener( clean_msg );
browser.notifications.onClicked.addListener(function(notificationId){
    switch (notificationId){
        case 'newMsg':
            clean_msg();
            break;
        case 'autoMission':
            browser.tabs.create({url:"https://www.v2ex.com/balance"});
            break;
    }
});

browser.commands.onCommand.addListener(function(command) {
    clean_msg();
});


//——————————————————————————————————通知/按钮点击反馈——————————————————————————————————


//——————————————————————————————————自动签到——————————————————————————————————

function autoMission(){
    // 延时 5 分钟签到 （有的用户开机自动打开 Chrome 此时还没有拨号成功）
    setTimeout(function(){
        if( s.getItem('autoMission') == new Date().getUTCDate() ){
            console.log('今天已经成功领取奖励了');
            return;
        }
        console.log('开始签到')
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
                                        browser.notifications.create(
                                            'autoMission' ,
                                            {
                                                type       : 'basic',
                                                iconUrl    : 'icon/icon38_msg.png',
                                                title      : 'v2ex plus 提醒您',
                                                message    : '今日的登陆奖励已领取。\nTake your passion and make it come true.',
                                            }
                                        );
                                        s.setItem( 'autoMission', new Date().getUTCDate() );
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
    }, 1000 * 60 * 5)
}

    //————————————————设置 http 头————————————————

    //直接 ajax http头是不带 referer 的
    //无 referer 将一直返回”今日的奖励已经领取了哦“并且有领取奖励按钮
    try {

        var requestfilter = {
            urls: ["*://*.v2ex.com/mission/daily/*"]
        };

        var extrainfospec = ['requestheaders', 'blocking'];
        var handler = function(details) {

            var isrefererset = false;
            var headers = details.requestheaders || [];
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

        browser.webrequest.onbeforesendheaders.addlistener(handler, requestfilter, extrainfospec);
    } catch(err) {
        var requestfilter = {
            urls: ["*://*.v2ex.com/mission/daily/*"]
        };

        var extrainfospec = ['requestHeaders', 'blocking'];
        var handler = function(details) {

            var isrefererset = false;
            var headers = details.requestHeaders || [];
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

            blockingresponse.requestHeaders = headers;
            return blockingresponse;
        };

        browser.webRequest.onBeforeSendHeaders.addListener(handler, requestfilter, extrainfospec);
    }
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
