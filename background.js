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
            title: "更新至 2.0.6",
            message: "Base64 Decode 改为弹窗、启用右键 sov2ex 时在所有网页生效，如需反馈欢迎 @sciooga"
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

        // 2.0.4 新增加功能
        if (!data.options.searchShortcut) {
            let options = data.options
            options.searchShortcut = 1
            chrome.storage.sync.set({ options })
        }

        // 2.0.6 新增加功能
        if (!data.options.sov2exMenu) {
            chrome.contextMenus.update(
                "vplus.sov2ex", {
                documentUrlPatterns: ['<all_urls>']
            })
        }

        // 2.0.7 新增加功能
        if (data.options.nestedComment === undefined) {
            let options = data.options
            options.nestedComment = 1
            chrome.storage.sync.set({ options })
        }
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