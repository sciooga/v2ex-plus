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
            title: "更新至 2.1.1",
            message: "新版默认关闭 vDaily，老版本用户可按需手动关闭，移除 vDaily 获取老主题数据的功能，如需反馈欢迎 @sciooga"
        })

        // 2.0.0 checkin typo
        let data = await chrome.storage.sync.get("options")
        let options = data.options

        if (options.chickin) {
            options.checkin = options.chickin
            chrome.storage.sync.set({ options })
        }

        // 2.0.3 增加新功能
        if (options.vDaily === undefined) {
            options.vDaily = 1
            chrome.storage.sync.set({ options })
        }

        // 2.0.4 新增加功能
        if (options.searchShortcut === undefined) {
            options.searchShortcut = 1
            chrome.storage.sync.set({ options })
        }

        // 2.0.6 新增加功能
        if (!options.sov2exMenu) {
            chrome.contextMenus.update(
                "vplus.sov2ex", {
                documentUrlPatterns: ['<all_urls>']
            })
        }

        // 2.0.7 新增加功能
        if (options.nestedComment === undefined) {
            options.nestedComment = 1
            chrome.storage.sync.set({ options })
        }
        if (options.markColor === undefined) {
            options.markColor = '#ff0000'
            chrome.storage.sync.set({ options })
        }

        // 2.1.1 版本重置 vDaily 为关闭
        if (e.previousVersion && e.previousVersion == '2.1.0') {
            options.vDaily = 0
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