"use strict";
function saveChoice(e){
    //console.log(e, e.target.checked);
    let name = e.target.name;
    let checked = e.target.checked;
    let value;
    if (name === "imageHosting") {
        value = checked ? "imgur" : "weibo";
    } else {
        value = checked ? 1 : 0;
    }
    // localStorage.setItem(name, value);
    setItemByKey(name, value);
}

function setItem(obj) {
    //console.log(obj);
    // let obj = {};
    // obj[key] = value;
    chrome.storage.sync.set(obj);
    chrome.storage.local.set(obj);
}

function setItemByKey(key, value) {
    //console.log(key, value);
    let obj = {};
    obj[key] = value;
    chrome.storage.sync.set(obj);
    chrome.storage.local.set(obj);
}

function getItem(obj, callback) {
    //console.log(chrome, chrome.storage);
    chrome.storage.sync.get(obj, callback);
}

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
    * 使用sov2ex搜索 默认关闭
    * 自动签到提醒 默认开启
    * 自定义节点 默认www(国内1)
    * Base64加密/解密 默认关闭
    * 深色主题 默认关闭
*/
const defaultSettings = {
    "newMsg": 1,
    "imageHosting": "weibo",
    "autoMission": 0,
    "preview": 1,
    "fold": 1,
    "dblclickToTop": 0,
    "replyUser" : 1,
    "autoLoginWeibo": 0,
    "followMsg": 1,
    "collectMsg": 0,
    "autoMissionMsg": 1,
    "newWindow": 0,
    "replyColor": "#fffff9",
    "replyA": 0.4,
    "thankColor": "#cccccc",
    "sov2ex": 0,
    "customNode": "-1",
    "base64": 0,
    "darkTheme": 0,
    "imageParsing": "auto-hide",
    "displayPostDate": 1
};

window.onload = function() {
    // const s = localStorage;

    initialDarkTheme();

    const settingButtons = {
        newMsg: document.querySelector(".newMsg"),
        imageHosting: document.querySelector(".imageHosting"),
        autoMission: document.querySelector(".autoMission"),
        preview: document.querySelector(".preview"),
        fold: document.querySelector(".fold"),
        replyUser: document.querySelector(".replyUser"),
        dblclickToTop: document.querySelector(".dblclickToTop"),
        autoLoginWeibo: document.querySelector(".autoLoginWeibo"),
        followMsg: document.querySelector(".followMsg"),
        collectMsg: document.querySelector(".collectMsg"),
        autoMissionMsg: document.querySelector(".autoMissionMsg"),
        newWindow: document.querySelector(".newWindow"),
        replyColor: document.querySelector(".replyColor"),
        replyA: document.querySelector(".replyA"),
        thankColor: document.querySelector(".thankColor"),
        replyAValue: document.getElementById("replyAValue"),
        sov2ex: document.querySelector(".sov2ex"),
        customNode: document.getElementById("customNode"),
        base64: document.querySelector(".base64"),
        darkTheme: document.querySelector(".darkTheme"),
        imageParsing: document.getElementById("imageParsing"),
        displayPostDate: document.querySelector(".displayPostDate")
    };

    function resetAll() {
        setItem(defaultSettings);
        location.reload();
    }

    // function initSetting() {
    //     getItem(defaultSettings, (settings) => {
    //         setItem(settings);
    //     });
    // }

    // Show saved settings
    function restoreSetting() {
        getItem(defaultSettings, (settings) => {
            //console.log(settings);
            for (let name in settings) {
                let value = settings[name];
                let button = settingButtons[name];
                let checked = true;
                switch (name) {
                case "replyColor":
                case "thankColor":
                case "customNode":
                    button.value = value;
                    setItemByKey(name,value);//如果用户从未改过，则设置一个默认值
                    button.onchange = function(e) {
                        //console.log(e, this, this.value);
                        let hex = this.value.toLowerCase();
                        setItemByKey(name, hex);
                    };
                    button.disabled = false;
                    break;
                case "imageParsing":
                    button.value = value;
                    setItemByKey(name,value);//如果用户从未改过，则设置一个默认值
                    button.onchange = function(e) {
                        let hex = this.value.toLowerCase();
                        setItemByKey(name, hex);
                    };
                    button.disabled = false;
                    break;
                case "replyA":
                    button.value = value;
                    settingButtons["replyAValue"].textContent = value;
                    setItemByKey(name,value);//如果用户从未改过，则设置一个默认值
                    button.onchange = function() {
                        settingButtons["replyAValue"].textContent = this.value;
                        setItemByKey(name, this.value);
                    };
                    button.disabled = false;
                    break;
                default:
                    if (name === "imageHosting") {
                        checked = value === "imgur";
                        setItemByKey(name,value);//设置storage中imgHosting的默认值
                    } else {
                        checked = !!parseInt(value);
                        setItemByKey(name,parseInt(value));//在storage中为各选项初始一个默认值
                    }
                    button.checked = checked;
                    button.onchange = saveChoice;
                    button.disabled = false;
                }
            }
        });
    }

    document.getElementById("allDefault").onclick = resetAll;

    //查看屏蔽列表
    document.getElementById("blockList").onclick = function(){
        chrome.runtime.sendMessage({action: "get_blockList"});
    };

    //切换深色主题
    document.querySelector(".darkTheme").onclick = function(){
        document.body.classList.toggle('dark-theme');
    };

    function initialDarkTheme () {
        getItem(['darkTheme'], function (result) {
            if (result.darkTheme) document.body.classList.add('dark-theme');
        })
    }

    restoreSetting();
};
