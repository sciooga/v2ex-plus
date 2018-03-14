// Avoid `chrome` namespace
if (typeof browser === "undefined" &&
    typeof chrome === "object"){
    //console.log("On Chrome");
    var browser = chrome;
}

browser.runtime.onInstalled.addListener(function(e){
    // Open options page to initialize localStorage
    if (e.reason === "install")
        browser.runtime.openOptionsPage();
    if (e.reason === "update" && e.previousVersion === "1.3.4"){
      browser.notifications.create({
        type   : 'basic',
        iconUrl: 'icon/icon38_msg.png',
        title  : '我们刚刚进行了更新',
        message: '重构了设置页UI界面，更美观大气上档次。'
      });
        // browser.runtime.openOptionsPage();
    }
});

//——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————
const s = localStorage;
const storage = chrome.storage.sync;

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if ( request.img_base64 ){
        var post_url, patt_id, url_start, url_end, data;
        var img_status;
        //——————————设置微博或 imgur 的信息——————————
        storage.get(function (response) {
            if ( response.imageHosting === "weibo" ){
                post_url = "http://picupload.service.weibo.com/interface/pic_upload.php?\
                    ori=1&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog";
                patt_id = "pid\":\"(.*?)\"";
                url_start = "https://ws2.sinaimg.cn/large/";
                url_end = ".jpg";
                data = {"b64_data": request.img_base64};
            }else{
                post_url = "https://api.imgur.com/3/image";
                patt_id = "id\":\"(.*?)\"";
                url_start = "https://i.imgur.com/";
                url_end = ".png";
                data = {"image": request.img_base64};
            }
            $.ajax({
                url: post_url,
                method: "POST",
                data: data,
                dataType: "text",
                beforeSend: (xhr) => {
                    if ( response.imageHosting === "imgur" ){

                        client_id = [
                            "442b04f26eefc8a",
                            "59cfebe717c09e4",
                            "60605aad4a62882",
                            "6c65ab1d3f5452a",
                            "83e123737849aa9",
                            "9311f6be1c10160"
                        ].sort(_ => 0.5 - Math.random())[0];

                        xhr.setRequestHeader("Authorization", "Client-ID " + client_id);
                    }
                },
                success: (data) => {
                    try{
                        img_status = url_start + RegExp(patt_id).exec(data)[1] + url_end;
                        //console.log("Succeed: "+ img_status);
                    } catch(e){
                        //console.error("Field not found");
                        img_status = "Failed";
                    }
                },
                error: () => {
                    img_status = "Failed";
                    //console.info("Request failed");
                },
                complete: () => {
                    sendResponse({img_status: img_status});
                }
            });
        });
        return true;
    }
    //——————————微博或 imgur 的信息完成——————————
    //——————————————————————————————————接收来自页面的图片数据上传并返回——————————————————————————————————


    //——————————————————————————————————返回设置选项——————————————————————————————————
    switch (request.action) {
    case "get_preview_status":
        sendResponse({preview_status: Number(s.getItem("preview"))});
        break;
    case "get_dblclickToTop":
        sendResponse({dblclickToTop: Number(s.getItem("dblclickToTop"))});
        break;
    case "get_replySetting":
        sendResponse({
            replyColor: s.getItem("replyColor"),
            replyA: s.getItem("replyA"),
            fold: Number(s.getItem("fold")),
            thankColor: s.getItem("thankColor")
        });
        break;
    case "get_newWindow_status":
        sendResponse({newWindow_status: Number(s.getItem("newWindow"))});
        break;
    case "get_replyUser":
        sendResponse({replyUser: Number(s.getItem("replyUser"))});
        break;
    case "get_blockList":
        $.get("https://www.v2ex.com",function(data,status){
            if(status == "success"){
                var block_list = /blocked = \[(.*?)\];/.exec(data);
                var username = /首页<\/a>&nbsp;&nbsp;&nbsp;<a href="\/member\/(.+?)"/.exec(data);
                if ( block_list && username ){
                    block_list = block_list[1];
                    username = username[1];
                    browser.tabs.create({url:"/page/block_list.html#"+username+"="+block_list});
                }else{
                    alert("扩展没有获取到任何信息 : (\n或许是您未登录 V2EX 账号");
                }
            }else{
                alert("扩展没有获取到任何信息 : (\n很有可能是网络问题，请稍后再试");
            }
        });
        sendResponse({blockList: "get"});
        break;
    case "get_collectList":
        window.collectNotified = false;
        sendResponse({cached: localStorage.collectTopicCachedReplyCountList, latest: localStorage.collectTopicLatestReplyCountList});
        break;
    case "clear_collect":
        localStorage.collectTopicCachedReplyCountList = request.list;
        localStorage.collectTopicLatestReplyCountList = request.list;
        sendResponse(null);
        break;
    case "sync_collect":
        localStorage.collectTopicCachedReplyCountList = request.cached;
        localStorage.collectTopicLatestReplyCountList = request.latest;
        break;
    default:
        throw "invaild action";
    }
});

//——————————————————————————————————返回设置选项——————————————————————————————————


//——————————————————————————————————定时任务初始化、获取自定义节点——————————————————————————————————
let urlPrefix = "";
storage.get(function (response) {
    Number(response.newMsg) && checkMsg();
    Number(response.followMsg) && followMsg();
    Number(response.collectMsg) && collectMsg();
    urlPrefix = response.customNode || "www";
    console.log(urlPrefix);
});

browser.alarms.create("checkMsg", {periodInMinutes: 5});
browser.alarms.create("autoMission", {periodInMinutes: 30});

browser.alarms.onAlarm.addListener(function( a ){
    switch (a.name){
    case "checkMsg":
        storage.get(function (response) {
            Number(response.newMsg) && checkMsg();
            Number(response.followMsg) && followMsg();
            Number(response.collectMsg) && collectMsg();
        });
        break;
    case "autoMission":
        storage.get(function (response) {
            Number(response.autoMission) && autoMission();
            Number(response.autoLoginWeibo) && autoLoginWeibo();
        });
        break;
    }
});

//——————————————————————————————————定时任务初始化——————————————————————————————————


//——————————————————————————————————检查关注人新主题——————————————————————————————————
function followMsg() {
    $.get("https://www.v2ex.com/my/following", function(data){
        var $html = $("<output>").append($.parseHTML(data));
        window.a = $html;
        var topics = $html.find("#Main .box:nth(0) table");
        if (!topics.length) return;

        var $firstOne = topics.eq(2);
        var topicId = $firstOne.find(".item_title a").attr("href").substr(3).split("#")[0];
        var topic = $firstOne.find(".item_title").text();
        var author = $firstOne.find(".small.fade > strong:nth-child(3)").text();

        storage.get(function (response) {
            if( response.followMsgTopicId == topicId ) return;
            storage.set({"followMsgTopicId":topicId});
            window.newFollowTopicId = topicId;
            browser.notifications.create(
                "newFollowTopic" ,
                {
                    type       : "basic",
                    iconUrl    : "icon/icon38_msg.png",
                    title      : "v2ex plus 提醒您",
                    message    : `${author} 创作了新主题：${topic}`,
                });
        });

    });
}

//——————————————————————————————————检查关注人新主题——————————————————————————————————


//——————————————————————————————————检查收藏主题新回复——————————————————————————————————
function collectMsg() {
    $.get("https://www.v2ex.com/my/topics", function(data){
        var $html = $("<output>").append($.parseHTML(data));
        var topics = $html.find("div.cell.item");
        if (!topics.length) return;

        var cachedReplyCountList = localStorage.collectTopicCachedReplyCountList;
        cachedReplyCountList = cachedReplyCountList ? JSON.parse(cachedReplyCountList) : {};
        var latestReplyCountList = localStorage.collectTopicLatestReplyCountList;
        latestReplyCountList = latestReplyCountList ? JSON.parse(latestReplyCountList) : {};

        var topicIds = [];
        var newReply = false;
        var topicIndex;
        for (topicIndex = 0; topicIndex < topics.length; topicIndex++){
            var topic = topics[topicIndex];
            var topicReplyCountEl = $(topic).find(".count_livid, .count_orange");
            var topicReplyCount = topicReplyCountEl.length ? Number(topicReplyCountEl[0].innerText) : 0;
            var topicId = Number($(topic).find(".item_title a")[0].href.match(/\/t\/(\d+)/)[1]);
            topicIds.push(topicId);

            if (cachedReplyCountList[topicId] === undefined){
                cachedReplyCountList[topicId] = topicReplyCount;
            }
            
            if (latestReplyCountList[topicId] === undefined){
                latestReplyCountList[topicId] = topicReplyCount;
            }else if (latestReplyCountList[topicId] != topicReplyCount){
                latestReplyCountList[topicId] = topicReplyCount;
                newReply = true;
            }
        }

        for (topicIndex in cachedReplyCountList){
            if(topicIds.indexOf(Number(topicIndex)) === -1){
                delete(cachedReplyCountList[topicIndex]);
            }
        }

        for (topicIndex in latestReplyCountList){
            if(topicIds.indexOf(Number(topicIndex)) === -1){
                delete(latestReplyCountList[topicIndex]);
            }
        }

        localStorage.collectTopicCachedReplyCountList = JSON.stringify(cachedReplyCountList);
        localStorage.collectTopicLatestReplyCountList = JSON.stringify(latestReplyCountList);

        if (!window.collectNotified && newReply){
            window.collectNotified = true;
            browser.notifications.create(
                "newCollectTopicReply" ,
                {
                    type       : "basic",
                    iconUrl    : "icon/icon38_msg.png",
                    title      : "v2ex plus 提醒您",
                    message    : "您收藏的主题有了新回复，点击查看",
                });
            //20分钟内最多提示一次
            setTimeout(function(){
                window.collectNotified = false;
            }, 1200000);
        }
    });
}

//——————————————————————————————————检查收藏主题新回复——————————————————————————————————


//——————————————————————————————————通知功能——————————————————————————————————

//现在是每5分钟刷新一次状态，除非点击了browserAction
function checkMsg(){
    $.get("https://www.v2ex.com/settings",function(data,status){
        if(status == "success"){
            var sign = RegExp("([0-9]*?) (条未读提醒|unread)").exec(data);
            sign = sign != null && sign[1] || "未登录";
            if ( sign == "未登录" ){
                browser.browserAction.setIcon({path: "icon/icon38_nologin.png"});
            }else if( sign!="0") {
                browser.browserAction.setIcon({path: "icon/icon38_msg.png"});
                browser.notifications.create(
                    "newMsg" ,
                    {
                        type       : "basic",
                        iconUrl    : "icon/icon38_msg.png",
                        title      : "v2ex plus 提醒您",
                        message    : "您有 V2EX 的未读新消息，点击查看。",
                    });
            }else{
                browser.browserAction.setIcon({path: "icon/icon38.png"});
            }
        }else{
            alert("V2EX消息获取失败：" + status);
        }
    });
}


//——————————————————————————————————通知功能——————————————————————————————————


//——————————————————————————————————通知/按钮点击反馈——————————————————————————————————

//清除通知图标，打开通知地址
function clean_msg(){
    browser.browserAction.setIcon({path: "icon/icon38.png"});
    browser.tabs.create({url:`https://${urlPrefix}.v2ex.com/notifications`});
}

browser.commands.onCommand.addListener(clean_msg);
browser.browserAction.onClicked.addListener(clean_msg);
browser.notifications.onClicked.addListener(function(notificationId){
    switch (notificationId){
    case "newMsg":
        clean_msg();
        break;
    case "autoMission":
        browser.tabs.create({url:`https://${urlPrefix}.v2ex.com/balance`});
        break;
    case "newFollowTopic":
        browser.tabs.create({url:`https://${urlPrefix}.v2ex.com/t/${window.newFollowTopicId}?p=1`});
        break;
    case "newCollectTopicReply":
        browser.tabs.create({url:`https://${urlPrefix}.v2ex.com/my/topics`});
        break;
    }
    browser.notifications.clear(notificationId);
});



//——————————————————————————————————通知/按钮点击反馈——————————————————————————————————


//——————————————————————————————————自动签到——————————————————————————————————
function autoMission(){
    storage.get(function (response) {
        if( response.autoMission == new Date().getUTCDate() ){
            //console.log('今天已经成功领取奖励了');
            return;
        }
        console.log("开始签到");
        $.ajax({
            url: "https://www.v2ex.com/",
            success: function(data){
                let sign = data.match("/signout(\\?once=[0-9]+)");
                sign = sign != null && sign[1] || "未登录";
                if ( sign != "未登录" ){
                    $.ajax({
                        url: "https://www.v2ex.com/mission/daily/redeem" + sign,
                        success: function(data){
                            if ( data.search("查看我的账户余额") ){
                                let result = data.match(/已连续登录 (\d+?) 天/);
                                if (response.autoMissionMsg) {
									browser.notifications.create(
										"autoMission" ,
										{
											type    : "basic",
											iconUrl : "icon/icon38_msg.png",
											title   : "v2ex plus 提醒您",
											message : `签到成功，${result[0]}。\nTake your passion and make it come true.`,
										}
									);
                                }
                                storage.set( {"autoMission" : new Date().getUTCDate()} );
                            }else{
                                alert("罕见错误！基本可以忽略，如果你遇见两次以上请联系开发者，当该提示已打扰到您，请关闭扩展的自动签到功能。");
                            }
                        },
                        error: function(){
                            alert("网络错误！今日奖励领取失败，等待一小时后自动重试或现在手动领取。");
                        }
                    });
                }
            },
            error: function(){
                alert("网络错误！今日奖励领取失败，等待一小时后自动重试或现在手动领取。");
            }
        });
    });

}
//——————————————————————————————————自动签到——————————————————————————————————


//——————————————————————————————————自动登陆微博——————————————————————————————————

function autoLoginWeibo(){
    //console.log('0.8 测试版！ 目前准备自动激活微博');
    $.get("http://weibo.com");
}

//——————————————————————————————————自动登陆微博——————————————————————————————————

//——————————————————————————————————右键使用 sov2ex 搜索——————————————————————————
function addToContextMenu () {
  chrome.contextMenus.create({
    id: 'sov2ex',
    title: "使用 sov2ex 搜索 '%s'",
    contexts: ['selection']
  });
}
chrome.storage.sync.get(function (response) {//初始时通过storage值判断是否添加
    if(response.sov2ex){
        addToContextMenu();
    }
});

function onChangedHandler (changes) {
	let keys = Object.keys(changes);
	for (let i = 0,len = keys.length; i < len; i++){
		let index = keys[i];
		let item = changes[index];
		switch (index){
			case "sov2ex":
			{
				if (item.newValue) {
					addToContextMenu();
				} else {
					chrome.contextMenus.remove("sov2ex");
				}
				break;
			}
            case "customNode":
            {
                urlPrefix = item.newValue;
            }
		}
	}
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
	if (namespace !== "sync") return;
	for(let key in changes){
		if (changes[key].oldValue == undefined){//new install no operation
			delete changes[key];
		}
	}
	onChangedHandler(changes);
});

chrome.contextMenus.onClicked.addListener(function (response) {//点击右键菜单相应选项触发搜索
    if(response.menuItemId === "sov2ex"){
        window.open("https://www.sov2ex.com/?q=" + response.selectionText);
    }
})
//——————————————————————————————————右键使用 sov2ex 搜索——————————————————————————
