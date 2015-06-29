

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
            data.append('base64s[]', request.img_base64);
            post_url = 'http://imgur.com/upload';
            patt_id = "hash\":\"(.*?)\"";
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
                    console.log( "失败返回" );// 返回成功数据
                }
            }
        };
        xhr.open('POST', post_url);
        xhr.send(data);
    }else if ( request.get_img_id ){//收到图片状态询问
        sendResponse({img_id: img_status});
        img_status != '上传中' && (img_status = '空闲');

//——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————


//——————————————————————————————————返回设置选项——————————————————————————————————

    }else if ( request.get_preview_status ){
        sendResponse({preview_status: getCookie('preview')});
    }else if ( request.get_keyReplyColor ){
        sendResponse({keyReplyColor: getCookie('keyReplyColor'), keyReplyA: getCookie('keyReplyA')});
    }else if ( request.get_newWindow_status ){
        sendResponse({newWindow_status: getCookie('newWindow')});
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
                alert('请登录 v2ex 账号以便获取新消息提醒，否则每5分钟将弹出此提示。');
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
    window.open("https://www.v2ex.com/notifications");
}

chrome.browserAction.onClicked.addListener( clean_msg );
chrome.notifications.onClicked.addListener(function(notificationId){
    switch (notificationId){
        case 'newMsg':
            clean_msg();
            break;
        case 'autoMission':
            window.open("https://www.v2ex.com/balance");
            break;
    }
});

//——————————————————————————————————通知/按钮点击反馈——————————————————————————————————


//——————————————————————————————————自动签到——————————————————————————————————

function autoMission(){

    if( getCookie('autoMission') == new Date().getUTCDate() ){
        console.log('今天已经成功领取奖励了');
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
                                    alert('罕见错误！如果你遇见两次以上请联系开发者。');
                                }
                            },
                            error: function(){
                                alert('网络错误！等待一小时后重试或手动领取。');
                            }
                        });
                    }
        },
        error: function(){
                    alert('网络错误！等待一小时后重试或手动领取。');
        }
    });
}

    //————————————————设置 http 头————————————————

    //直接 ajax http头是不带 referer 的
    //无 referer 将一直返回”今日的奖励已经领取了哦“并且有领取奖励按钮
    var requestFilter = {
        urls: ["*://*.v2ex.com/mission/daily/*"]
    };

    var extraInfoSpec = ['requestHeaders', 'blocking'];
    var handler = function(details) {

    var isRefererSet = false;
    var headers = details.requestHeaders;
    var blockingResponse = {};

    for (var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name == 'referer') {
            isRefererSet = true;
            break;
        }
    }

    if (!isRefererSet) {
        headers.push({
            name: "referer",
            value: "https://www.v2ex.com/mission/daily/"
        });
    }

    blockingResponse.requestHeaders = headers;
    return blockingResponse;
    };

    chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);

    //————————————————设置 http 头————————————————

//——————————————————————————————————自动签到——————————————————————————————————