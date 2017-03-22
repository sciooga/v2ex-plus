// WebExtension is cross-platform
// Why would anyone call `chrome` api in it?
if (typeof browser === 'undefined' &&
    typeof chrome === 'object')
    browser = chrome;

// Open options page if it's first install
browser.runtime.onInstalled.addListener(function(e){
    console.log(e);
    if (e.reason === "install")
        browser.runtime.openOptionsPage()
});
//——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————
const s = localStorage;
var img_status = '空闲';

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
                    ori=1&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog',
        patt_id = "pid\":\"(.*?)\"",
        url_start = 'https://ws2.sinaimg.cn/large/',
        url_end = '.jpg';

        if ( s.getItem('imageHosting') === 'weibo' ){
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
                    console.log( "成功返回："+_response );// 返回成功数据
                }else{
                    img_status = '失败';
                    console.log( "失败返回"+_response );// 返回成功数据
                }
            }
        };
        xhr.open('POST', post_url);
        if ( s.getItem('imageHosting') === 'imgur' ){
	    xhr.setRequestHeader('Authorization', 'Client-ID 9311f6be1c10160');
	}
        xhr.send(data);
    }else if ( request.get_img_id ){//收到图片状态询问
        sendResponse({img_id: img_status});
        img_status != '上传中' && (img_status = '空闲');

//——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————


//——————————————————————————————————返回设置选项——————————————————————————————————

    }else if ( request.get_preview_status ){
        sendResponse({preview_status: Number(s.getItem('preview'))});
    }else if ( request.get_allSetting ){
        sendResponse({dblclickToTop: Number(s.getItem('dblclickToTop'))});
    }else if ( request.get_replySetting ){
        sendResponse({keyReplyColor: s.getItem('replyColor'), keyReplyA: s.getItem('replyA'), fold: s.getItem('fold'), thankColor: s.getItem('thankColor')});
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
                    browser.tabs.create({url:"/block_list.html#"+username+'='+block_list});
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
browser.alarms.create('checkMsg', {periodInMinutes: 5});
browser.alarms.create('autoMission', {periodInMinutes: 30});

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
    if( s.getItem('autoMission') == new Date().getUTCDate() ){
        console.log('今天已经成功领取奖励了');
        return;
    }
    console.log('开始签到')
    $.ajax({
        url: "https://www.v2ex.com/",
        success: function(data){
            let sign = data.match('/signout(\\?once=[0-9]+)');
            sign = sign != null && sign[1] || '未登录';
            if ( sign != '未登录' ){
                $.ajax({
                    url: 'https://www.v2ex.com/mission/daily/redeem' + sign,
                    success: function(data){
                        if ( data.search('查看我的账户余额') ){
                            browser.notifications.create(
                                'autoMission' ,
                                {
                                    type    : "basic",
                                    iconUrl : "icon/icon38_msg.png",
                                    title   : "v2ex plus 提醒您",
                                    message : "今日的登陆奖励已领取。\nTake your passion and make it come true.",
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
}
//——————————————————————————————————自动签到——————————————————————————————————


//——————————————————————————————————自动登陆微博——————————————————————————————————

function autoLoginWeibo(){
    //console.log('0.8 测试版！ 目前准备自动激活微博');
    $.get('http://weibo.com');
}

//——————————————————————————————————自动登陆微博——————————————————————————————————
