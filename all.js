
//——————————————————————————————————双击回到顶部——————————————————————————————————
chrome.storage.sync.get(function(response) {
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

$("body").keyup(function(e) {
    if ($("textarea").is(":focus") || $("input").is(":focus")) return;

    if (e.keyCode == 37) {
        // 按下左键，上一页
        $("[title=上一页]").click();
    } else if (e.keyCode == 39) {
        // 按下右键，上一页
        $("[title=下一页]").click();
    }
});

//——————————————————————————————————方向键切换上下页——————————————————————————————————

//——————————————————————————————————504/502/500自动刷新——————————————————————————————————
//目前不能确定50x错误页的共性，所以使用判断title和<body>标签上bgcolor属性两种方式来判断是否是错误页
let error504 = $('head>title').text() === '504 Gateway Time-out';
let error502 = $('head>title').text() === '502 Bad Gateway';
let error500 = $('head>title').text() === '500 Internal Server Error';
let isBgcolor = $('body').attr('bgcolor') === 'white';
let isErrorPage = (error504 || error502 || error500) && isBgcolor;
if (isErrorPage) {
  let template = '<center>v2ex plus 将在<b class="second" style="color: #ed3f14;">3</b>s后刷新页面</center>';
  $('body').append(template);
  let time = setInterval(() => {
    let now = +$('body').find('b.second').text();
    $('body').find('b.second').text(--now);
    if (now === 0) {
      clearInterval(time);
      window.location.reload();
    }
  }, 1000)
}
//——————————————————————————————————504/502/500自动刷新——————————————————————————————————

//——————————————————————————————————使用 sov2ex 搜索——————————————————————————————————
chrome.storage.sync.get(function (response) {
  if (response.sov2ex){
    $("#q").attr("placeholder","sov2ex")
      .keyup(function () {
        $(this).val($(this).val().replace(/[#%&]/g,""));//用户输入不能包含特殊字符#%&
    })
      .keypress(function (e) {
        if(e.which == 13){//按enter触发搜索
          window.open("https://www.sov2ex.com/?q=" + $(this).val());
          return false;
        }
    })
  }
})

//——————————————————————————————————使用 sov2ex 搜索——————————————————————————————————