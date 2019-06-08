function getItem(obj, callback) {
    chrome.storage.sync.get(obj, callback);
}

function initialDarkTheme () {
    getItem(['darkTheme'], function (result) {
        if (result.darkTheme) document.body.classList.add('dark-theme');
    })
}

initialDarkTheme();