chrome.storage.sync.get("options", (data) => {
    if (data.options.dblclickToTop) {
        document.addEventListener('dblclick', e => {
            window.getSelection().removeAllRanges()
            document.body.scrollIntoView()
        })
    }
})