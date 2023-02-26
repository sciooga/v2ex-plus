// 每半小时自动签到一次

chrome.alarms.create(
    "checkin",
    { periodInMinutes: 30 }
)

chrome.alarms.onAlarm.addListener(
    async (e) => {
        if (e.name != "checkin") return
        console.log('判断是否开启了自动签到，如开启则签到')

        let data = await chrome.storage.sync.get("options")
        // 签到
        if (data.options.checkin) {
            await checkin()
        }
    }
)

async function checkin() {
    let data = await chrome.storage.sync.get("checkinDate")

    if (data.checkinDate == new Date().getUTCDate()) {
        console.log('今天已经成功领取奖励了')
        return
    }

    console.log('开始签到')
    let originUrl = window.location.origin
    let rep = await fetch(originUrl+'/mission/daily/redeem')
    let text = await rep.text()
    let sign = text.match("/signout(\\?once=[0-9]+)")
    sign = sign != null && sign[1] || "未登录"
    if (sign == "未登录") {
        return console.log('用户未登录，等待登录后重试')
    }
    rep = await fetch(`${originUrl}/mission/daily/redeem${sign}`)
    text = await rep.text()

    if (text.search("查看我的账户余额")) {
        let result = text.match(/已连续登录 (\d+?) 天/)
        let data = await chrome.storage.sync.get("options")
        if (data.options.chickinNote) {
            chrome.notifications.create(
                "checkin",
                {
                    type: "basic",
                    iconUrl: "icon/icon38_msg.png",
                    title: "v2ex plus 提醒您",
                    message: `签到成功，${result[0]}。\nTake your passion and make it come true.`,
                }
            )
        }
        chrome.storage.sync.set({checkinDate: new Date().getUTCDate()})
    }
}