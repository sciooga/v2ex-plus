// 默认配置
let options = {
    // 签到
    checkin: 1, // 自动签到 默认开启

    // 提醒
    msgNote: 1, // 消息提醒 默认开启
    chickinNote: 1, // 签到成功提醒 默认开启

    // 浏览
    preview: 1, // 主题预览 默认开启
    ignore: 1, // 主题忽略 默认开启
    fold: 1, // 自动折叠 默认开启
    jump: 1, // 跳过主题 默认开启
    newWindow: 0, // 新标签页浏览主题 默认关闭

    // 回复    
    replyUserNum: 1, // 回复时增加楼层号 默认开启
    relateReply: 1, // 快速查看相关回复 默认开启
    imageParsing: 1, // 图片解析 默认开启并隐藏原回复
    replyColor: "#fff94d", // 楼主回复背景色
    replyA: 0.4, // 楼主回复背景色透明度
    thankColor: "#cccccc", // 感谢爱心颜色
    weekNewuser: 0, // 淡化新用户回复

    // 其他
    vDaily: 1, // 启用 vDaily 默认打开
    userinfo: 1, // 查看用户信息 默认打开
    userMarkList: [], // 标记用户列表
    sov2ex: 0, // 使用sov2ex搜索 默认关闭
    sov2exMenu: 0, // 右键 sov2ex 搜索 默认关闭
    searchShortcut: 1, // 搜索快捷键 默认开启
    dblclickToTop: 0, // 双击返回顶部 默认关闭
    base64: 1, // Base64解码 默认关闭
}

window.onload = async function () {
    let data = await chrome.storage.sync.get("options");
    if (data.options) {
        options = data.options
    } else {
        chrome.storage.sync.set({ options })
    }
    document.querySelectorAll('input').forEach((el) => {
        // 加载保存的配置
        if (el.type == "checkbox") {
            el.checked = options[el.name]
        } else {
            el.value = options[el.name]
        }
        el.disabled = false

        el.onchange = (e) => {
            options[el.name] = el.type == "checkbox" ? el.checked : el.value
            chrome.storage.sync.set({ options })
        }
    })

    document.querySelector('input[name=sov2exMenu]').addEventListener('change', e => {
        try {
            if (e.target.checked) {
                // 增加 sov2ex 右键菜单
                chrome.contextMenus.create({
                    id: "vplus.sov2ex",
                    title: "使用 sov2ex 搜索 '%s'",
                    contexts: ["selection"],
                })
            } else {
                // 移除
                chrome.contextMenus.remove("vplus.sov2ex")
            }
        } catch (error) {
            console.error('此错误可忽略', error)
        }
    })

    // 设置快捷键
    document.getElementById("shortcuts").onclick = function () {
        chrome.tabs.create({ url: "chrome://extensions/shortcuts" })
    }

    // 管理标记用户列表
    document.getElementById("highlightList").onclick = function () {
        chrome.tabs.create({ url: "/pages/manage/index.html?highlight" })
    }

    // 管理屏蔽用户列表
    document.getElementById("blockUserList").onclick = function () {
        chrome.tabs.create({ url: "/pages/manage/index.html?blockuser" })
    }

    // 管理屏蔽主题列表
    document.getElementById("blockTopicList").onclick = function () {
        chrome.tabs.create({ url: "/pages/manage/index.html?ignoretopic" })
    }

    // 重置设置
    document.getElementById("allDefault").onclick = () => {
        chrome.storage.sync.remove('options')
        location.reload()
    }
}