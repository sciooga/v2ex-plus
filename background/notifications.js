// 每 5 分钟检查一次未读消息、关注用户新帖、收藏主题新回复，同时判断登录状态
chrome.alarms.create(
    "notifications",
    { periodInMinutes: 5 }
)

chrome.alarms.onAlarm.addListener(
    async (e) => {
        if (e.name != "notifications") return
        console.log('判断是否开启了各项新消息通知，如开启则检查')
        let data = await chrome.storage.sync.get("options")
        // 未读消息
        if (data.options.msgNote) {
            await checkMsg()
        }

    }
)

// 检查未读消息
async function checkMsg() {
    console.log('开始检查未读消息')
    let originUrl = window.location.origin
    let rep = await fetch(originUrl+'/mission')
    let text = await rep.text()
    let sign = RegExp("([0-9]*?) (条未读提醒|unread)").exec(text)
    sign = sign != null && sign[1] || "未登录"
    if (sign == "未登录") {
        chrome.action.setIcon({ path: "icon/icon38_nologin.png" })
        chrome.action.setBadgeBackgroundColor({ color: '#666666' })
        chrome.action.setBadgeText({ text: '!' })
    } else if (sign != "0") {
        chrome.action.setIcon({ path: "icon/icon38_msg.png" })
        chrome.action.setBadgeText({ text: sign })
        chrome.action.setBadgeBackgroundColor({ color: '#eb2d2d' })
        // TODO 可以做一个不骚扰用户的通知
    } else {
        chrome.action.setIcon({ path: "icon/icon38.png" })
        chrome.action.setBadgeText({ text: '' })
    }
}