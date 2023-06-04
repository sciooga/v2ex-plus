/*
    接收根节点，解析页面内的主题信息
    Topic = {
        spiderTime 爬取时间
        id 
        name 标题
        node 节点
        author 作者
        avatar 作者头像
        date 发布日期
        reply 回复数
        vote up投票数
        click 点击数
        thank 感谢数
        collect 收藏数
        score 评分 (点击数 + 回复数 * 10 + 收藏数 * 30 + 感谢数 * 100 + 投票数 * 300) * (1+ 点赞回复数/总回复数)

        content 正文
        append [
            多条补充
        ]
        replys: [ 点赞评论
            {
                spiderTime 爬取时间
                topicId 主题 ID
                topicPage 所在页码
                id 评论 ID
                author 作者
                avatar 作者头像
                date 发布日期
                thank 感谢数
                content 评论内容
            }
        ]
    }
 */


function regexGet(reg, text, _) {
    let result = reg.exec(text)
    if (result) return result[1]
    return _
}

function spider(dom, topicId, topicPage) {
    let spiderTime = new Date()

    let topic = {
        spiderTime: spiderTime,
        id: topicId,
        name: dom.querySelector('h1').innerText,
        node: dom.querySelector('.header > a[href^="/go"]').innerText,
        author: dom.querySelector('div.header small a[href^="/member"]').innerText,
        avatar: dom.querySelector('.header .avatar').src,
        date: new Date(dom.querySelector('div.header small span[title^="20"]').title),
        reply: +regexGet(/(\d+) 条回复/, dom.querySelector('span.gray').innerText, 0), // 可空
        vote: +dom.querySelector('.votes a').innerText, // 可空
        click: +regexGet(/(\d+) 次点击/, dom.querySelector('.topic_buttons').innerText, 0),
        collect: +regexGet(/(\d+) 人收藏/, dom.querySelector('.topic_buttons').innerText, 0),
        thank: +regexGet(/(\d+) 人感谢/, dom.querySelector('.topic_buttons').innerText, 0),
        score: 0, //评分

        content: dom.querySelector('.topic_content') ? dom.querySelector('.topic_content').innerHTML : '',
        append: Array.prototype.map.call(dom.querySelectorAll('.subtle'), el => el.innerHTML),
        replys: Array.prototype.map.call(dom.querySelectorAll('[alt="❤️"]'), el => {
            let cell = el.closest('.cell')
            return {
                spiderTime: spiderTime,
                topicId: topicId,
                topicPage: topicPage,
                id: +cell.id.slice(2),
                author: cell.querySelector('.avatar').alt,
                avatar: cell.querySelector('.avatar').src,
                date: new Date(cell.querySelector('.ago').title),
                thank: +el.nextSibling.nodeValue,
                content: cell.querySelector('.reply_content').innerHTML
            }
        }), // 点赞回复
    }

    // 点击数 + 回复数 * 10 + 点赞回复数 * 30 + 收藏数 * 30 + 感谢数 * 100 + 投票数 * 300
    topic.score = topic.click + topic.reply * 10 + topic.replys.length * 30 + topic.collect * 30 + topic.thank * 100 + topic.vote * 300

    return topic
}

const SPIDER_VERSION = '1.0.2'
// 1.0.0 首个记录版本
// 1.0.1 请求失败自动重试

// fetch 自动重试一次
async function request(url, options) {
    try {
        return await fetch(url, options)
    } catch (error) {
        return await fetch(url, options)
    }
}

async function get(url) {
    return await request(url, {
        headers: {
            'version': SPIDER_VERSION
        }
    })
}

async function post(url, data) {
    return await request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'version': SPIDER_VERSION
        },
        body: JSON.stringify(data)
    })
}

async function postTopicInfo(topic, sign) {
    let rep = await post(`${endpoint}/api/topic/info?task=${sign}`, topic)
    let repJson = await rep.json()
    if (repJson.code != 0) throw new Error('爬取错误')
}

let endpoint = 'https://vdaily.huguotao.com'

// 爬取基本信息
chrome.storage.sync.get("options", async (data) => {

    if (!data.options.vDaily) return
    if (document.querySelector('.tools [href="/notes"]').innerHTML != '记事本') return // 非中文语言、未登录

    try {
        let id = +regexGet(/\/t\/(\d+)/, location.pathname)
        let page = +regexGet(/p=(\d+)/, location.search, 1)
        let topic = spider(document.body, id, page)
        await postTopicInfo(topic)
    } catch (error) {
        console.error(error)
        await post(`${endpoint}/api/error/info`, {
            type: 'read', // 浏览
            url: location.href,
            error: error.stack,
            time: new Date()
        })
    }
})