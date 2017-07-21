"use strict";
function saveChoice(e){
    localStorage.setItem(e.target.name, e.target.value);
}

window.onresize = function(){
    if(document.body.clientWidth < 790){
        document.getElementById("introduction").style.display="none";
    }else{
        document.getElementById("introduction").style.display="";
    }
};

window.onload = function(){
    const s = localStorage;

    /*
    * 重置所有设置
    * 消息提醒 默认开启
    * 图床设置 默认微博
    * 自动签到 默认关闭
    * 主题预览 默认开启
    * 自动折叠 默认开启
    * 回复楼层号 默认开启
    * 双击返回顶部 默认关闭
    * 定时激活微博 默认关闭
    * 新标签页浏览主题 默认关闭
    */
    function resetAll(){
        const defaults = {
            "newMsg": 1,
            "imageHosting": "weibo",
            "autoMission": 0,
            "preview": 1,
            "fold": 1,
            "dblclickToTop": 0,
            "replyUser" : 1,
            "autoLoginWeibo": 0,
            "newWindow": 0,
            "replyColor": "#fffff9",
            "replyA": 0.4,
            "thankColor": "#cccccc"
        };
        for (let key in defaults)
            s.setItem(key, defaults[key]);
        location.reload();
    }

    const settingButtons = {
        newMsg: document.newMsgSelect.newMsg,
        imageHosting: document.imageHostingSelect.imageHosting,
        autoMission: document.autoMissionSelect.autoMission,
        preview: document.previewSelect.preview,
        fold: document.foldSelect.fold,
        replyUser: document.replyUserSelect.replyUser,
        dblclickToTop: document.dblclickToTopSelect.dblclickToTop,
        autoLoginWeibo: document.autoLoginWeiboSelect.autoLoginWeibo,
        newWindow: document.newWindowSelect.newWindow
    };

    // Check if there is nothing in localStorage
    let noConfigIsMade = true;
    for (let opt in settingButtons){
        if (s.getItem(opt) !== null){
            noConfigIsMade = false;
            break;
        }
    }
    if (noConfigIsMade)
        resetAll();

    // Show saved settings
    for (let opt in settingButtons){
        settingButtons[opt].value = s.getItem(opt);
        for (let button of settingButtons[opt]){
            button.onclick = saveChoice;
            button.disabled = false;
        }
    }

    //楼主回复背景色 默认rgba('255', '255', '249', '0.4')
    const _replyColor = document.replyColorSelect.replyColor,
        _replyA = document.replyColorSelect.replyA,
        _replyAValue = document.getElementById("replyAValue");
    _replyColor.value = s.getItem("replyColor");
    _replyA.value = _replyAValue.textContent = s.getItem("replyA");

    _replyColor.onchange = function(){
        let hex = this.value.toLowerCase();
        s.setItem("replyColor", hex);
    };
    _replyA.onmousemove = function(){
        _replyAValue.textContent = this.value;
    };
    _replyA.onchange = function(e){
        _replyAValue.textContent = this.value;
        saveChoice(e);
    };
    _replyA.disabled = false;
    _replyColor.disabled = false;

    //感谢爱心颜色 默认rgba('204', '204', '204', '1')
    const _thankColor = document.thankColorSelect.thankColor;
    _thankColor.value = s.getItem("thankColor");
    _thankColor.onchange = function(){
        let hex = this.value.toLowerCase();
        s.setItem("thankColor", hex);
    };
    _thankColor.disabled = false;

    document.getElementById("allDefault").onclick = resetAll;

    //查看屏蔽列表
    document.getElementById("blockList").onclick = function(){
        chrome.runtime.sendMessage({action: "get_blockList"});
    };
};
