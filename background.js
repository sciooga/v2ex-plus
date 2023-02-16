import './background/notifications.js'; // 通知相关
import './background/checkin.js'; // 自动签到

console.log('hello world')

// 更新提醒
chrome.runtime.onInstalled.addListener((e) => {
    // 首次安装仅打开选项页
    if (e.reason === "install")
        chrome.runtime.openOptionsPage();
    if (e.reason === "update") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon/icon38_msg.png",
            title: "我们刚刚进行了更新",
            message: "更新至了 2.0.0 版本，保留了核心功能且移除了部分已经失效的功能，如需反馈欢迎 @sciooga"
        });
    }
});

// 监听快捷键
chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case 'newV2EX':
            chrome.tabs.create({ url: 'https://www.v2ex.com' })
            break
        case 'newMsg':
            chrome.tabs.create({ url: 'https://www.v2ex.com/notifications' })
            break
    }
})

// 点击 icon
chrome.action.onClicked.addListener(() => {
    chrome.action.setIcon({ path: "icon/icon38.png" })
    chrome.action.setBadgeText({ text: '' })
    chrome.tabs.create({ url: 'https://www.v2ex.com/notifications' })
})