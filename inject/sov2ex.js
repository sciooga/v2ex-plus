chrome.storage.sync.get("options", (data) => {
    if (data.options.sov2ex) {
        let oldSearch = document.querySelector('#search')
        let search = oldSearch.cloneNode()
        oldSearch.id = 'old-search'
        oldSearch.style.display = 'none'
        oldSearch.after(search)
        search.placeholder = "使用 sov2ex 搜索"
        search.addEventListener('input', () => {
            oldSearch.value = search.value
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
              
            oldSearch.dispatchEvent(event);
        })
        search.addEventListener('keyup', () => {
            let items = document.querySelectorAll('.search-item')
            let item = items[items.length - 1]
            item.href = 'https://www.sov2ex.com/?q=' + search.value
            item.innerText = 'sov2ex ' + search.value
        })
        search.addEventListener('keydown', (e) => {
            if (e.code == 'Enter' || e.code == 'NumpadEnter' || e.keyCode === 13) {
                window.location.href = "https://www.sov2ex.com/?q=" + search.value
            }
        })
    }
});