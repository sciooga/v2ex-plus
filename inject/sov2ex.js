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
        // add slash icon to the search input
        const slashIcon = addSlashIcon();

        // setup
        const searchContainer = document.getElementById('search-container');
        const search = document.getElementById('search');
        const searchResult = document.getElementById('search-result');
        const searchContainerWidth = searchContainer.offsetWidth;

        searchContainer.style.transition = 'width 0.3s ease-in-out';

        search.addEventListener('focus', enlargeSearchBox);
        search.addEventListener('blur', shrinkSearchBox);

        // listen to '/' keydown event on the document
        document.addEventListener('keydown', function (e) {
            if (e.keyCode === 191) {
                // if the search input is not focused, focus on it.
                if (document.activeElement.id !== 'search') {
                    // add class 'active' to search-container
                    searchContainer.classList.add('active');
                    slashIcon.style.display = 'none';
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
            slashIcon.style.display = 'block';
        }
    }

    function addSlashIcon() {
        const searchContainer = document.getElementById('search-container');

        // create a new SVG element
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('width', '22');
        svgElement.setAttribute('height', '20');
        svgElement.setAttribute('aria-hidden', 'true');
        svgElement.classList.add('mr-1', 'header-search-key-slash');

        // create the path elements for the SVG
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('fill', 'none');
        path1.setAttribute('stroke', '#979A9C');
        path1.setAttribute('opacity', '.4');
        path1.setAttribute('d', 'M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z');
        svgElement.appendChild(path1);

        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('fill', '#979A9C');
        path2.setAttribute('d', 'M11.8 6L8 15.1h-.9L10.8 6h1z');
        svgElement.appendChild(path2);

        // append the SVG element to the search container
        searchContainer.appendChild(svgElement);

        // set the CSS for the SVG element
        svgElement.style.position = 'absolute';
        svgElement.style.top = '50%';
        svgElement.style.right = '10px';
        svgElement.style.transform = 'translateY(-50%)';
        svgElement.style.zIndex = '1';

        return svgElement;
    }
});
