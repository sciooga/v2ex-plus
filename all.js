
//——————————————————————————————————双击回到顶部——————————————————————————————————
chrome.runtime.sendMessage({get_allSetting: 't'}, function(response) {
    if (response.dblclickToTop){
        $('body').dblclick(function () {
            window.getSelection().removeAllRanges();
            $('html, body').animate({scrollTop: 0}, 300);
        });
    }
});

//——————————————————————————————————双击回到顶部——————————————————————————————————