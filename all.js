
//——————————————————————————————————双击回到顶部——————————————————————————————————
chrome.runtime.sendMessage({action: "get_dblclickToTop"}, function(response) {
    if (response.dblclickToTop){
        $("body").dblclick(function () {
            window.getSelection().removeAllRanges();
            $("html, body").animate({scrollTop: 0}, 300);
        });
    }
});

/*
$('.avatar').each(function(){
    var $this = $(this);
    if ($this.attr('src').indexOf('gravatar') != -1){
        $this.css('display', 'none')
    }
});
*/

//——————————————————————————————————双击回到顶部——————————————————————————————————


//——————————————————————————————————方向键切换上下页——————————————————————————————————

$('body').keyup(function(e) {
    if (e.keyCode == 37) {
        // 按下左键，上一页
        $('[title=上一页]').click()
    } else if (e.keyCode == 39) {
        // 按下右键，上一页
        $('[title=下一页]').click()
    }
})

//——————————————————————————————————方向键切换上下页——————————————————————————————————