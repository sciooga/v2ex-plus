// 通知相关
try {
    importScripts('./background/notifications.js')
} catch (error) {
    console.error(error)
}

// 自动签到
try {
    importScripts('./background/checkin.js')
} catch (error) {
    console.error(error)
}


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
            title: "更新至 2.0.3",
            message: "增加 vDaily 推荐主题及评论，数据在不断完善，如需反馈欢迎 @sciooga"
        });

        // 2.0.0 checkin typo
        let data = await chrome.storage.sync.get("options")
        if (data.options.chickin) {
            let options = data.options
            options.checkin = options.chickin
            chrome.storage.sync.set({ options })
        }

        // 2.0.3 增加新功能
        if (!data.options.vDaily) {
            let options = data.options
            options.vDaily = 1
            chrome.storage.sync.set({ options })
        }
    }

    try {
        // 增加 sov2ex 右键菜单
        chrome.contextMenus.create({
            id: "vplus.sov2ex",
            title: "使用 sov2ex 搜索 '%s'",
            contexts: ["selection"],
        })
    } catch (error) {
        console.log('此错误可忽略')
        console.error(error)
    }
})

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

// 右键 sov2ex 搜索
chrome.contextMenus.onClicked.addListener(e => {
    if (e.menuItemId != 'vplus.sov2ex') return
    chrome.tabs.create({ url: "https://www.sov2ex.com/?q=" + e.selectionText })
})