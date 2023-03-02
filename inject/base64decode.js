chrome.storage.sync.get("options", (data) => {
    if (data.options.base64) {
        document.onmouseup = function (e) {
            let selection = document.getSelection()
            let selectionText = selection.toString()
            if (selectionText) {
                // 12 个文字以内的不解析
                if (selectionText.length < 12) return
                // 不是 4 的倍数跳过
                if (selectionText.length % 4) return

                let content = selection.extentNode.textContent
                try {
                    let result = atob(selectionText)
                    try {
                        result = decodeURIComponent(escape(result)) 
                    }
                    catch (err) {

                    }
                    selection.extentNode.textContent = content.replace(selectionText, `${selectionText}(${result})`)
                } catch (err) {
                    return false;
                }

            }
        }
    }
})