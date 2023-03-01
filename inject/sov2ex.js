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

    if (data.options.searchShortcut) {
        setupSearchSortcut();
    }

    function setupSearchSortcut() {
        // setup
        const searchContainer = document.getElementById('search-container');
        const search = document.getElementById('search');
        const searchResult = document.getElementById('search-result');
        const searchContainerWidth = searchContainer.offsetWidth;

        searchContainer.style.transition = 'width 0.3s ease-in-out';

        console.log(search);

        search.addEventListener('focus', enlargeSearchBox);

        search.addEventListener('blur', shrinkSearchBox);

        // listen to '/' keydown event on the document
        document.addEventListener('keydown', function (e) {
            if (e.keyCode === 191) {
                // if the search input is not focused, focus on it.
                if (document.activeElement.id !== 'search') {
                    // add class 'active' to search-container
                    searchContainer.classList.add('active');
                    search.focus();
                    search.addEventListener('keydown', function (e) {
                        if (e.keyCode === 27) {
                            search.blur();
                            // hide search-result
                            searchResult.style.display = 'none';

                            window.setTimeout(function () {
                                // remove 'active' class from search-container
                                searchContainer.classList.remove('active');
                            }, 300);
                        }
                    });
                    e.preventDefault();
                }
            }
        });

        function enlargeSearchBox() {
            // set the width of the search-container to 1.5 times of the original width
            searchContainer.style.width = searchContainerWidth * 1.5 + 'px';
        }

        function shrinkSearchBox() {
            // set the width of the search-container to the original width
            searchContainer.style.width = searchContainerWidth + 'px';
        }
    }
});