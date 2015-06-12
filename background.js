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
        var _response = '';
        data.append('b64_data', request.img_base64);
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4) {
                if (xhr.status === 200 ){
                    _response =  xhr.responseText;
                    _response = RegExp("pid\":\"(.*?)\"").exec( _response );
                    _response = _response != null && _response[1] || '失败';//以防 API 更改
                    img_status = _response;
                    console.log( "成功返回："+_response );// 返回成功数据
                }else{
                    img_status = '失败';
                    console.log( "失败返回" );// 返回成功数据
                }
            }
        };
        //参数 url、nick、logo用于水印内容
        xhr.open('POST', 'http://picupload.service.weibo.com/interface/pic_upload.php?\
                          &mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog');
        xhr.send(data);
    }else if ( request.get_img_id ){//收到图片状态询问
        sendResponse({img_id: img_status});
        img_status != '上传中' && (img_status = '空闲');
    }
});

//todo 打开 https://www.v2ex.com/notifications时 chrome.browserAction.setIcon({path: 'icon/icon.png'});
//现在是每5分钟刷新一次状态，除非点击了browserAction
checkMsg();
chrome.alarms.create('checkMsg', {periodInMinutes: 5});
chrome.alarms.onAlarm.addListener(checkMsg);
function checkMsg(){
    $.get("https://www.v2ex.com/settings",function(data,status){
        if(status == 'success'){
            var sign = RegExp("([0-9]*?) 条未读提醒").exec(data);
            sign = sign != null && sign[1] || '未登录';
            if ( sign == '未登录' ){
                alert('请登录 v2ex 账号以便获取新消息提醒，否则每5分钟将弹出此提示。');
            }else if( sign!='0') {
                chrome.browserAction.setIcon({path: 'icon/icon38_msg.png'});
            }else{
                chrome.browserAction.setIcon({path: 'icon/icon38.png'});
            }
        }else{
            alert('V2EX消息获取失败：' + status);
        }
    });
}

chrome.browserAction.onClicked.addListener(function(){
    chrome.browserAction.setIcon({path: 'icon/icon38.png'});
    window.open("https://www.v2ex.com/notifications");
});
