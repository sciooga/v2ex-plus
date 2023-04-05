chrome.storage.sync.get("options", (data) => {
    if (data.options.base64) {
        function isPrintable(str) {
            // 检查字符串中是否包含非打印字符
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                if (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13) {
                    // 非打印字符（排除了制表符、换行符、回车符）
                    return false;
                }
            }
            return true;
        }

        document.onmouseup = function (e) {
            let selection = document.getSelection()
            let selectionText = selection.toString()
            if (selectionText) {
                // 12 个文字以内的不解析
                if (selectionText.length < 12) return
                // 不是 4 的倍数跳过
                if (selectionText.length % 4) return

                try {
                    let result = atob(selectionText)
                    if (!isPrintable(result)) return
                    try {
                        result = decodeURIComponent(escape(result))
                    }
                    catch (err) {

                    }
                    let popDiv = document.createElement('div')
                    popDiv.innerText = result
                    document.body.append(popDiv)
                    popDiv.style.cssText = `
                    max-width: 602px;
                    border-radius: 10px;
                    padding: 6px 10px 6px;
                    position: absolute;
                    font-size: 12px;
                    background: #fff;
                    box-shadow: 0 2px 6px var(--menu-shadow-color, #8e8e8e);
                    opacity: 0;
                    transition: opacity .3s, margin .3s;
                    `
                    popDiv.style.top = e.target.getBoundingClientRect().top + document.documentElement.scrollTop - popDiv.offsetHeight + 'px'
                    popDiv.style.left = e.target.getBoundingClientRect().left + document.documentElement.scrollLeft + 'px'
                    popDiv.style.opacity = 1
                    setTimeout(() => {
                        popDiv.remove()
                    }, 5000)
                } catch (err) {
                    return false;
                }

            }
        }
    }
})