
chrome.storage.sync.get("options", (data) => {
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
})