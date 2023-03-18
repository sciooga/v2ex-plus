
chrome.storage.sync.get("options", async (data) => {
    // 高亮被标记用户
    data.options.userMarkList.map((item) => {
        document.querySelectorAll(`img[alt="${item}"]`).forEach(el => {
            el.style.outline = '3px solid red'
        })
    })

    // 主题新窗口打开
    if (data.options.newWindow) {
        document.querySelectorAll('.item_title a, .item_hot_topic_title a').forEach((el) => {
            el.target = '_blank'
        })
    }

    // 主题预览
    if (data.options.preview) {
        // 增加预览按钮
        document.querySelectorAll('.topic_info').forEach((el) => {
            el.append(' \u00A0•\u00A0 ')
            let span = document.createElement('span')
            span.innerText = '预览'
            span.classList.add("btn")
            el.append(span)

            // 按钮点击事件
            span.addEventListener('click', async (e) => {
                let cell = el.closest('.cell')
                if (span.innerText == '预览') {
                    span.innerText = '收起'
                    let div = document.createElement('div')
                    div.classList.add("preview")
                    cell.append(div)
                    let a = cell.querySelector('.item_title a')
                    let rep = await fetch(a.href)
                    let text = await rep.text()
                    text = text.substr(text.indexOf("header") + 8);
                    //当匹配不到topic_conten时返回-1 substring 按0处理，既显示整个标题头部
                    text = text.substring(text.indexOf("<div class=\"topic_content\">"), text.indexOf("<div class=\"topic_buttons\">"));
                    text = text.replace("hljs.initHighlightingOnLoad();", "");
                    div.innerHTML = text
                } else {
                    span.innerText = '预览'
                    let preview = cell.querySelector('.preview')
                    preview.remove()
                }
            })
        })
    }

    // 主题忽略
    if (data.options.ignore) {
        // 增加忽略按钮
        document.querySelectorAll('.topic_info').forEach((el) => {
            el.append(' \u00A0•\u00A0 ')
            let span = document.createElement('span')
            span.innerText = '忽略'
            span.classList.add("btn")
            el.append(span)

            // 按钮点击事件
            span.addEventListener('click', async (e) => {
                if (confirm("确定不想再看到这个主题？")) {
                    let cell = el.closest('.cell')
                    let a = cell.querySelector('.item_title a')
                    url = a.href.replace("/t/", "/ignore/topic/");
                    var once = /signout\?once=([0-9]+)/.exec(document.body.innerHTML)[1];
                    url = url.replace("#", "?once=" + once + "#");
                    location.href = url;
                }
            })
        })
    }

    // vDaily 推荐主题和回复
    if (data.options.vDaily) {
        // 修复最近浏览
        let recentTopics = document.querySelector('#my-recent-topics .box')
        if (recentTopics) {
            let cellMeta
            recentTopics.querySelectorAll('.cell.from_').forEach(el => {
                cellMeta = el
                el.remove()
            })
            chrome.storage.sync.get('recentTopics', async (data) => {
                let topics = data.recentTopics || []
                topics.forEach(i => {
                    let cell = cellMeta.cloneNode(1)
                    let user = cell.querySelector('a[href^="/member/"]')
                    let avatar = user.querySelector('img')
                    let title = cell.querySelector('.item_hot_topic_title a')
                    user.href = `/member/${i['author']}`
                    avatar.src = i['avatar']
                    avatar.alt = i['username']
                    title.href = `/t/${i['id']}`
                    title.innerText = i['name']
                    recentTopics.append(cell)
                    document.querySelector('#my-recent-topics').style.display = 'block'
                })
            })
            recentTopics.querySelector('a[href="#;"]').addEventListener('click', e => {
                chrome.storage.sync.set({ recentTopics: [] })
            })
        }

        let TopicsHot = document.querySelector('#TopicsHot')
        if (!TopicsHot) return


        let replyBox = document.createElement('div')
        replyBox.classList.add('box')
        TopicsHot.after(replyBox)

        let replyTitle = document.createElement('div')
        replyTitle.classList.add('cell', 'fade')
        replyTitle.innerText = 'vDaily 高赞回复'
        replyBox.append(replyTitle)

        let sep20 = document.createElement('div')
        sep20.classList.add('sep20')
        TopicsHot.after(sep20)

        let topicBox = replyBox.cloneNode()
        TopicsHot.after(topicBox)
        TopicsHot.after(sep20.cloneNode())

        let topicTitle = replyTitle.cloneNode()
        topicTitle.innerText = 'vDaily 推荐主题'
        topicBox.append(topicTitle)

        let topicList = await fetch('https://vdaily.huguotao.com/api/topic/recommend')
        topicList = await topicList.json()
        topicList.map(i => {
            let cell = document.createElement('div')
            cell.classList.add('cell')
            let a = document.createElement('a')
            a.classList.add('item_hot_topic_title')
            cell.append(a)
            a.href = `/t/${i['id']}`
            a.innerText = `${i['score']} - ${i['name']}`
            topicBox.append(cell)
        })

        let replyList = await fetch('https://vdaily.huguotao.com/api/reply/recommend')
        replyList = await replyList.json()
        replyList.map(i => {
            let cell = document.createElement('div')
            cell.classList.add('cell', 'thank_reply')
            let a = document.createElement('a')
            a.classList.add('item_hot_topic_title')
            cell.append(a)
            a.href = `/t/${i['topicId']}?p=${i['topicPage']}#r_${i['id']}`
            a.innerHTML = `${i['thank']} - ${i['content']}`.replaceAll('<br>', ' ')
            replyBox.append(cell)
        })
    } else {
        document.querySelector('#my-recent-topics').style.display = 'block'
    }
})