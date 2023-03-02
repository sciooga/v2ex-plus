import './background/notifications.js'; // 通知相关
import './background/checkin.js'; // 自动签到

console.log('hello world')

// 更新提醒
chrome.runtime.onInstalled.addListener(async (e) => {
    // 首次安装仅打开选项页
    if (e.reason === "install")
        chrome.runtime.openOptionsPage();
    if (e.reason === "update") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon/icon38_msg.png",
            title: "更新至 2.0.1",
            message: "增加双击返回顶部、右键 sov2ex、修复了自动签到失败的问题，如需反馈欢迎 @sciooga"
        });

        // 2.0.0 checkin typo
        let data = await chrome.storage.sync.get("options")
        if (data.options.chickin) {
            let options = data.options
            options.checkin = options.chickin
            chrome.storage.sync.set({ options })
        }
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

// 增加 sov2ex 右键菜单
chrome.contextMenus.create({
    id: "vplus.sov2ex",
    title: "使用 sov2ex 搜索 '%s'",
    contexts: ["selection"],
})

chrome.contextMenus.onClicked.addListener(e => {
    if (e.menuItemId != 'vplus.sov2ex') return
    chrome.tabs.create({ url: "https://www.sov2ex.com/?q=" + e.selectionText })
})