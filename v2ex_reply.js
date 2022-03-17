/*global img_list emoticon_list triangle_img setClipboardText*/
//获取被@的用户
function get_at_name_list(comment_content){
    const name_list = new Set(),
        patt_at_name = RegExp("@<a href=\"/member/(.+?)\">", "g");

    let match = patt_at_name.exec(comment_content);
    while (match) {
        name_list.add(match[1]);
        match = patt_at_name.exec(comment_content);
    }

    return name_list;
}

//判断是否为相关的回复
function related_reply( reply_content, _reply_user_name, _reply_at_name ){
    let reply_related = false;
    const at_name_list = get_at_name_list(reply_content);

    if (at_name_list.size === 0){
        return true;
    }

    for (let at_name of at_name_list) {
        if (at_name == _reply_user_name || at_name == _reply_at_name){
            reply_related = true;
        }
    }

    return reply_related;
}

//插入图片
function input_img(input_img_base64, this_img_id){
    _upload_image.append("<div class='imgId"+ this_img_id +"'>\
                                <div><img src='"+ input_img_base64 +"' alt='上传图片'/></div>\
                                <span>上传中</span>\
                        </div>");
    _upload_image.slideDown(700);

    const img_base64 = input_img_base64.match("base64,(.*)")[1];
    chrome.runtime.sendMessage({img_base64: img_base64}, function(res) {
        const _img_preview = $(".imgId"+ this_img_id);

        if (res.img_status !== "Failed"){
            img_list["图片"+this_img_id] = ` ${res.img_status} `;
            _reply_textarea.val((i,origText) => origText+"[:图片"+this_img_id+":]");
            _img_preview.find("span").text("[:图片"+ this_img_id +":]");
            _img_preview.css({"background": "rgba(246, 246, 246, 0.5)","borderColor": "#A4FF94"});
        } else{
            alert("图片上传失败，可能是未登录微博/受 imgur 上传次数限制");
            _img_preview.find("span").text("请重新上传");
        }
        _upload_img_btn.text(" ᕀ 插入图片");
    });
}

//————————————————基本信息的获取及功能按钮初始化————————————————
//图片功能的初始化放在图片功能内

var page_current_num = $(".page_current").eq(0).text() || "1";
var page_previous_num = ~~(page_current_num)-1;
var _key_user = $(".header small a:first-of-type").text();
var _topic = $("#Main > div:nth-of-type(2)");
var _topic_content = $(".cell .topic_content", _topic);
var _topic_buttons = $(".topic_buttons");
var _reply_user_name_list = Array();
var _reply_content_list = Array();
var r_i = 1;
var maxNestDivCount = 1;

_topic_buttons.append(" &nbsp;<a href='#;' id='onlyKeyUser' class='tb'>只看楼主</a>");

$("div[id^=r_]").each(function(){
    var _this = $(this);
    var _reply = _this.find(".reply_content");

    //———回复空格修复———
    _reply.css("whiteSpace", "pre-wrap").html(function(i, o){
        return o.replace(/\n<br>/g, "\n").replace(/<br>/g, "\n");
    });

    function lazyGist(element) {

    }
    //———回复空格修复———

    var _reply_content = _reply.html();
    var _reply_user_name = _this.find("strong a").text();
    var _reply_at_name = RegExp("<a href=\"/member/(.*?)\">").exec(_reply_content);

    if ( _key_user == _reply_user_name ){
        _this.addClass("keyUser");
    }else{
        _this.addClass("normalUser");
    }

    //判断高度是否超高
    var height = _reply.height();
    if ( height > 1000 ){
        _reply.addClass("waitForFold");
        _reply.attr("vPlus-height", height);
    }

    _reply_user_name_list[r_i] = _reply_user_name;
    _reply_content_list[r_i++] = _reply_content;
    //设置按钮名称，是否出现，出现位置
    var btn_name = "";
    if ( _reply_at_name ){
        btn_name = "会话详情";
    }else{
        for (var i=r_i-2; i; --i){
            _reply_user_name_list[i] == _reply_user_name && (btn_name = "所有回复");
            break;
        }
    }
    var _append_place;
    var _thanked = _this.find(".thanked");
    if ( _thanked.text() == "感谢已发送" ){
        _append_place = _thanked;
    }else{
        var itemAll = _this.find(".no");
        var item1 = itemAll[0];
        if (itemAll.length > maxNestDivCount){
            maxNestDivCount = itemAll.length;
        }
        _append_place = _this.find(item1).prev();
    }
    if ( btn_name ){
        _append_place.before(" &nbsp;<a role='button' tabindex='0' class='replyDetailBTN'>"+ btn_name +"</a> &nbsp; &nbsp;");
    }
    // console.log(page_current_num)
    _append_place.before(" &nbsp;<a role='button' tabindex='0' class='direct' data-clipboard-text='"
          + location.origin + location.pathname + "?p=" + page_current_num + "#" + _this.attr("id")
          + "'>楼层直链</a> &nbsp; &nbsp;");
});

// 修复因为恢复回复排版导致 gist 无法加载的问题
$('body').append("<script>$('.reply_content button').click(function(){lazyGist(this)})</script>")

// if (~~page_current_num > 1){
    //console.log('V2EX PLUS: 此主题有多页回复，正在加载所有回复。');
    $.get("https://www.v2ex.com/api/replies/show.json?topic_id="+/\/t\/([0-9]+)/.exec(window.location.href)[1],function(data){
        //console.log('V2EX PLUS: 所有回复加载完成。');
        for (var i in data){
            _reply_user_name_list[~~i+1] = data[i].member.username;
            _reply_content_list[~~i+1] = data[i].content_rendered;
        }
        page_previous_num = "0";
    });
// }

$(".direct").click(function () {
    setClipboardText($(this).data("clipboard-text"));
});

$("#onlyKeyUser").click(function(){
    var _this = $(this);
    if (_this.text() == "只看楼主"){
        _this.text("全部回复");
        $(".normalUser").slideUp(600);
    }else{
        _this.text("只看楼主");
        $(".normalUser").slideDown(600);
    }
});


chrome.storage.sync.get(function(response) {
    const topic_height = _topic.height(),
        r = parseInt((response.replyColor).substring(1,3),16),
        g = parseInt((response.replyColor).substring(3,5),16),
        b = parseInt((response.replyColor).substring(5,7),16),
        replyColor = `${r},${g},${b},${response.replyA}`;
    $(".keyUser").css("backgroundColor", `rgba(${replyColor})`);//设置楼主回复背景颜色

    if (response.fold){//折叠超长主题
        if (topic_height>1800){
            _topic_content.css({maxHeight:"600px", overflow:"hidden", transition:"max-height 2s"});
            $(".subtle", _topic).hide();
            const $showTopic = $("<div id='showTopic' style='padding:16px; color:#778087;'>\
                                            <button id='topicBTN'>展开主题</button>\
                                            <div style='height:10px;'></div>\
                                            <span style='font-size:0.6em'>主题超长已自动折叠，点击按钮显示完整的主题。</span>\
                                       </div>");
            if(_topic_buttons.length > 0){//用户未登录状态下，_topic_buttons不存在
                _topic_buttons.before($showTopic);
            } else {
                _topic.append($showTopic);
            }
            $("#topicBTN").click(function(){
                //乘2是由于当图片未加载完成时，预先记录的高度不准确（短于实际高度）
                _topic_content.css({maxHeight:topic_height*2});
                //还有可能是图片及其多，一开始保存的高度数值只有很少一部分图片的高度，所以在上面的两秒动画后还得再取消高度限制
                setTimeout(function(){
                    _topic_content.css({maxHeight:"none"});
                }, 2000);
                $(".subtle", _topic).slideDown(800);
                $("#showTopic").remove();
            });
        }
        var _reply = $(".waitForFold");
        _reply.css({maxHeight:"300px", overflow:"hidden", transition:"max-height 2s"});
        _reply.after("<div class='showReply' style='padding:20px 0px 10px; color:#778087; text-align:center; border-top:1px solid #e2e2e2'>\
                                            <span class='replyBTN'>展开回复</span>\
                                            <div style='height:16px;'></div>\
                                            <span>回复超长已自动折叠，点击按钮显示完整的回复。</span>\
                                  </div>");
        $(".replyBTN").click(function(){
            var _this = $(this);
            var _showReply = _this.parent();
            var _reply = _showReply.prev();
            _reply.css({maxHeight:2*~~(_reply.attr("vPlus-height"))+"px"});
            setTimeout(function(){
                _reply.css({maxHeight:"none"});
            }, 2000);
            _showReply.remove();
        });
    }

    //————————高亮感谢————————
    $(".box .small.fade").each(function(){
        if ($(this).text().indexOf("♥") !== -1)
            $(this).css("color", response.thankColor);
    });
    //————————高亮感谢————————


});

//————————同一帖子翻页跳过主题————————

var _t_num = RegExp("/t/([0-9]+)");
var _history_t_num = _t_num.exec(document.referrer);
_history_t_num = _history_t_num!=null && _history_t_num[1] || "none";
var _current_t_num = _t_num.exec(window.location.href)[1] || " none ";
if ( _history_t_num == _current_t_num ){
    $("html, body").animate({scrollTop: (_topic_buttons.offset().top)}, 300);
}

//————————同一帖子翻页跳过主题————————

//————————视频非 http 访问提示————————

if ( location.protocol == "https:" ){
    var iframe_list = _topic_content.find("iframe");
    iframe_list.each(function(){
        //判断是否为腾讯视频
        var _this = $(this);
        if (/http:\/\/v.qq.com/.test(_this.attr("src"))){
            _this.attr("src", function(index, oldvalue){
                return "https" + oldvalue.substring(4);
            });
            _this.before("v2ex plus 提醒您：<br/>由于您以 https 访问 v2ex，已将腾讯视频链接修改为 https 现可正常观看。");
            //判断是否为优酷视频
        }else if (/http:\/\/player.youku.com/.test(_this.attr("src"))){
            _this.before("v2ex plus 提醒您：<br/>由于您以 https 访问 v2ex，无法正常显示优酷视频，您可以访问此链接观看：<br/><br/>&emsp;&emsp;&emsp;&emsp;<a href='"+ _this.attr("src") +"' target='_blank'>新窗口观赏视频</a><br/><br/>");
            _this.remove();
        }
    });
}

//————————腾讯视频非 http 访问提示————————

//————————————————基本信息的获取及初始化————————————————




//——————————————————————————————————会话详情 所有回复——————————————————————————————————

var btn_id = 0;
$(".replyDetailBTN").click(function(){
    if(maxNestDivCount > 1){
        alert("可能与其他脚本或扩展有冲突，会话详情暂不可用！");
        return;
    }
    var _this = $(this);
    var _cell = _this.parents("div[id^=r_]");//由于最后一条回复 class 为 inner 所以还是匹配 id 完整些
    var _reply_user_name = _cell.find("strong a").text();
    var _reply_content = _cell.find(".reply_content").html();
    var btn_name = _this.text();
    var _bubble, _replyDetail;
    _this.css("visibility", "visible");

    //————————————————会话详情功能————————————————

    if ( btn_name == "会话详情"){
        _this.text("加载中...");
        _cell.after("<div class='replyDetail'></div>");

        _replyDetail = _cell.next(".replyDetail");
        var _reply_at_name_list = get_at_name_list( _reply_content );

        _replyDetail.append("<div class='smartMode' onclick=\"$(this).children('span').toggleClass('checked');$(this).siblings('.unrelated').slideToggle(300);\"><span class='checked'>智能模式</span></div>");

        for (let at_name of _reply_at_name_list) {
            r_i = 1;
            var _no = ~~(_this.closest("td").find(".no").text());
            var have_main_reply = false;
            _replyDetail.append("<p class='bubbleTitle' style='margin-top: 20px;padding-top: 20px;'>本页内 "+ _reply_user_name +" 与 "+ at_name +" 的会话：</p>");
            while ( _reply_user_name_list[r_i] ){
                if ( _reply_user_name_list[r_i] == _reply_user_name ){
                    _bubble = "<div class='rightBubble";
                    !related_reply( _reply_content_list[r_i], _reply_user_name, at_name ) && (_bubble+=" unrelated");
                    _bubble += "' style='text-align: right;'>\
                                <div>\
                                    "+ _reply_content_list[r_i] +"\
                                    <p class='bubbleName' style='text-align:right;'>\
                                        <span class='unrelatedTip'><span>&emsp;回复于"+ (r_i+page_previous_num*100) +"层&emsp;"+ _reply_user_name +"\
                                    </p>\
                                </div></div>";
                    _replyDetail.append( _bubble );

                }else if ( _reply_user_name_list[r_i] == at_name ){
                    _bubble = "<div class='leftBubble";
                    !related_reply( _reply_content_list[r_i], _reply_user_name, at_name ) && (_bubble+=" unrelated") || (have_main_reply=true);
                    _bubble += "' style='text-align: left;'>\
                                <div>\
                                    "+ _reply_content_list[r_i] +"\
                                    <p class='bubbleName' style=''>\
                                        "+ at_name +"&emsp;回复于"+ (r_i+page_previous_num*100) +"层&emsp;<span class='unrelatedTip'><span>\
                                    </p>\
                                </div></div>";
                    _replyDetail.append( _bubble );
                }
                //如果被@用户只有一条回复但回复是@其他不相干用户则显示这条回复
                if ( _no-1 == r_i && !have_main_reply && /(\S+?) 回复于\d+层/.exec(_replyDetail.children(".leftBubble").last().find(".bubbleName").text())[1] == at_name ){
                    _replyDetail.children(".leftBubble").last().removeClass("unrelated");
                }

                ++r_i;
            }
        }
        _this.addClass("btn_id"+btn_id);
        _replyDetail.append("<p class='bubbleName' style='margin-top: 20px;'><span class='replyDetailEnd item_node' \
                                        onclick='$(\".btn_id"+ btn_id +"\").click();\
                                                 $(\"html, body\").animate({scrollTop: ($(\".btn_id"+ btn_id++ +"\").offset().top-200)}, 600);'>\
                                        收起会话\
                                 </span></p>");
        _this.text("收起会话");
        _replyDetail.slideDown(800);

        //————————————————会话详情功能————————————————

        //————————————————所有回复功能————————————————

    }else if( btn_name == "所有回复" ){
        _this.text("加载中...");
        _cell.after("<div class='replyDetail'></div>");

        _replyDetail = _cell.next(".replyDetail");

        r_i = 1;
        _replyDetail.append("<p class='bubbleTitle' style='margin-top: 20px;padding-top: 20px;'>本页内 "+ _reply_user_name +" 的所有回复：</p>");
        while ( _reply_user_name_list[r_i] ){

            if ( _reply_user_name_list[r_i] == _reply_user_name ){
                _bubble = "<div class='rightBubble' style='text-align: right;'>\
                                        <div>\
                                            "+ _reply_content_list[r_i] +"\
                                            <p class='bubbleName' style='text-align:right;'>\
                                                <span class='unrelatedTip'><span>&emsp;回复于"+ (r_i+page_previous_num*100) +"层&emsp;"+ _reply_user_name +"\
                                            </p>\
                                        </div>\
                                   </div>";
                _replyDetail.append( _bubble );
            }
            ++r_i;
        }

        _this.addClass("btn_id"+btn_id);
        _replyDetail.append("<p class='bubbleName' style='margin-top: 20px;'>\
                                    <span class='replyDetailEnd item_node' \
                                        onclick='$(\".btn_id"+ btn_id +"\").click();$(\"html, body\").animate({scrollTop: ($(\".btn_id"+ btn_id++ +"\").offset().top-200)}, 600);'>\
                                        收起回复\
                                    </span>\
                                 </p>");
        _this.text("收起回复");
        _replyDetail.slideDown(800);

        //————————————————所有回复功能————————————————

        //————————————————收起功能————————————————

    }else{
        _this.css("visibility", "");
        btn_name=="收起会话" && _this.text("会话详情") || _this.text("所有回复");
        _replyDetail = _cell.next(".replyDetail");
        setTimeout(function(){
            _replyDetail.remove();
        },800);
        _replyDetail.slideUp(800);
    }
});

//————————————————收起功能————————————————

//————————————————快速查看最近一条回复————————————————

$("body").append("<div id='closeReply'></div>");
var _close_reply = $("#closeReply");
var _reply_link = $(".reply_content a");
var display_foMouse;
_reply_link.mouseenter(function(){
    var _this = $(this);
    var _no = ~~(_this.closest("td").find(".no").text()) - page_previous_num*100;
    var _hover_at_name = RegExp("/member/(.+)").exec( _this.attr("href") );
    if ( _hover_at_name != null ){
        display_foMouse = setTimeout(function(){
            _close_reply.html( "<div style='padding-bottom:6px;'>" + (1) + "层至" + (_no) + "层间未发现该用户的回复</div>" + "<img class='triangle' src='"+ triangle_img +"' />" );
            // 判断 @ 之后是否跟了 # 号
            var result = RegExp(" #(\\d+)").exec(_this[0].nextSibling.data);
            if (result && _reply_user_name_list[+result[1]] == _this.text()){
                var i = +result[1];
                _close_reply.html( _reply_content_list[i] + "<p class='bubbleName' style='text-align:right; padding-right:0px;'>\
                                                "+ _reply_user_name_list[i] +"&emsp;回复于"+ (i+page_previous_num*100) +"层&emsp;\
                                            </p><img class='triangle' src='"+ triangle_img +"' />" );
            } else {
                for (let i=_no - 1; i > 0; --i){
                    if ( _reply_user_name_list[i] == _hover_at_name[1] ){
                        _close_reply.html( _reply_content_list[i] + "<p class='bubbleName' style='text-align:right; padding-right:0px;'>\
                                                "+ _reply_user_name_list[i] +"&emsp;回复于"+ (i+page_previous_num*100) +"层&emsp;\
                                            </p><img class='triangle' src='"+ triangle_img +"' />" );
                        break;
                    }
                }
            }
            //判断弹出位置
            var _fo_triangle = $(".triangle", _close_reply);
            var reply_position = [1, 0];
            _fo_triangle.css({bottom:"-6px", top:"auto", transform:"rotate(0deg)"});
            //上方空间不够且下方空间足够则向下弹出
            if ( ( _this.offset().top - $(document).scrollTop() ) < ( _close_reply.height() + 50 ) && ( $(document).scrollTop() + $(window).height() - _this.offset().top ) > ( _close_reply.height() + 50 ) ){
                reply_position = [0, 16];
                _fo_triangle.css({top:"-6px", bottom:"auto", transform:"rotate(180deg)"});
            }
            _close_reply.css({"top":(_this.offset().top - reply_position[0]*(34 + _close_reply.height()) + reply_position[1] ) + "px", "left":(_this.offset().left - 80 + _this.width()/2) + "px", "visibility":"visible", "opacity":"1", "marginTop":"10px", "word-break": "keep-all"});
        },300);
    }
});

_reply_link.mouseleave(function(){
    clearTimeout(display_foMouse);
    _close_reply.css({"opacity":"0", "marginTop":"0px"});
    setTimeout(function(){
        _close_reply.css("visibility", "hidden");
    },300);
});

//————————————————快速查看最近一条回复————————————————

//——————————————————————————————————会话详情 所有回复——————————————————————————————————


//——————————————————————————————————图片功能——————————————————————————————————

//————————————————初始化————————————————

//var _reply_textarea = document.getElementById("reply_content");
//_reply_textarea.parentNode.replaceChild(_reply_textarea.cloneNode(true), _reply_textarea);
var _reply_textarea = $("#reply_content");

_reply_textarea.attr("placeholder", "你可以在文本框内直接粘贴截图或拖拽图片上传");
var _reply_textarea_top_btn = _reply_textarea
    .parents(".box")
    .children(".cell:first-of-type");

_reply_textarea_top_btn
    .children("div:first")
    .after(
        "<div class='inputBTN'><span class='inputBTN1'> ᕀ 表情</span><span class='inputBTN2'> ᕀ 插入图片</span><input type='file' style='display: none' id='imgUpload' accept='image/*' /></div>"
    );

$("script").each(function(){
    var $this = $(this);
    if ($this.attr("scr") || $this.attr("type") || $this.html().indexOf("textcomplete") == -1){
        return ;
    }

    var script = document.createElement("script");
    script.textContent = $this.html();
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
});

//————————————————初始化————————————————

//————————————————表情功能————————————————

_reply_textarea_top_btn.before(emoticon_list);
var _emoticon_board = $(".emoticon");
_reply_textarea_top_btn.after("<div class = 'uploadImage'></div>");
var _upload_image = $(".uploadImage");

$(".inputBTN1").click(function(){
    var _emoticon_switch = -1;
    _emoticon_board.is(":visible") || (_emoticon_switch=1);
    _emoticon_board.slideToggle(300);
    $("html, body").animate({scrollTop: ($(document).scrollTop()+66*_emoticon_switch)}, 300);
});

$(".emoticon li").click(function(){
    var _this = $(this);
    var _emoticon = window.navigator.userAgent.toLowerCase().indexOf("mac","iphone","ipod","ipad")>-1 ? " " + _this.text() + " " : _this.text();
    _reply_textarea.val(function(i,origText){
        return origText + _emoticon;//TODO:根据光标位置插入而不是直接追加到原有内容末尾
    });
    _reply_textarea.focus();
});

//————————————————表情功能————————————————

//————————————————粘贴图片上传————————————————

var img_id = 1;

//从剪切板上传
//只要粘贴就触发，不管在什么地方粘贴
document.body.addEventListener("paste", function(e) {
    for (var i = 0; i < e.clipboardData.items.length; ++i) {
        var this_item = e.clipboardData.items[i];
        if ( this_item.kind == "file" && /image\/\w+/.test(this_item.type) ) {
            var imageFile = this_item.getAsFile();

            var fileReader = new FileReader();
            fileReader.onloadend = function() {
                input_img( this.result, img_id++ );
            };

            fileReader.readAsDataURL(imageFile);
            //阻止原有的粘贴事件以屏蔽文字
            e.preventDefault();
            //只黏贴一张图片
            break;
        }
    }
});

//————————————————粘贴图片上传————————————————

//————————————————选择图片上传————————————————

var _upload_img_btn = $(".inputBTN2");
var _imgUpload = $("#imgUpload");
_upload_img_btn.click(function(){
    _imgUpload.click();
});
_imgUpload.change(function(e){
    var files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
    if (files){
        var img_file = files[0];
        //Chrome input file 支持 accepts 属性
        //            if(!/image\/\w+/.test(img_file.type)){
        //                alert("请上传图片文件");
        //                return false;
        //            }else{
        var reader = new FileReader();
        reader.onload = function() {
            input_img( this.result, img_id++ );
        };
        reader.readAsDataURL(img_file);
        //            }
    }else{
        alert("出错了，获取不到文件。");
    }
});

//————————————————选择图片上传————————————————

//————————————————替换图片标签————————————————

if (_reply_textarea.val()) {
    _reply_textarea_top_btn.append("&emsp;<span style=\"color:red;\">之前如有上传的图片则已丢失，请重新上传。</span>");
    //还原图片链接为标签
    _reply_textarea.val(function(i,origText){
        for (var img_key_name in img_list){
            origText = origText.replace(new RegExp(img_list[img_key_name],"g"), "[:"+img_key_name+":]");
        }
        return origText;
    });
}
//#1是用来调试的，点击 textarea 模拟显示上传的字符串
//_reply_textarea.click(function( e ){//#1
_reply_textarea.parent().submit(function( e ){
    if ( _upload_img_btn.text().indexOf("正在上传") === -1 ){
        _reply_textarea.val(function(i,origText){
            origText = origText.replace(new RegExp("\\[:(.+?):\\]", "g"), function(i,k){
                const img_url = img_list[k];
                if (img_url) {
                    return img_url;
                } else {
                    e.preventDefault();
                    return "[:此图片标签已失效删除后请重新上传" + k + ":]";
                }
            });
            return origText;
        });
    }else{
        confirm("仍有图片未上传完成，确定要直接回复？\n未上传的图片将不被发送") || e.preventDefault();
    }
});

//支持快捷键回复
_reply_textarea.keydown(function(e) {
    if ((e.ctrlKey || e.metaKey) && e.which === 13) {
        //e.preventDefault();
        _reply_textarea.parent().submit();
    }
});

//————————————————替换图片标签————————————————

//————————————————旋转图片————————————————

function rotateImg(img, times){
    var scale;
    if ( times & 1 ){
        scale = img.height()/img.width();
    }else{
        scale = 1;
    }
    img.css("transform", "rotate("+ 90*times +"deg) scale("+ scale +")");
    img.attr("times", times);
    _rotateImg.css("display", "none");
}

$("body").append("<div id='rotateImg'><span id='rotateImgLBtn'>左旋</span>&emsp;<span id='rotateImgRBtn'>右旋</span>&emsp;</div>");

var _rotateImg = $("#rotateImg");
var _will_rotate_img;
var _rotate_times;
var _rotate_img = $(".reply_content img");
_rotate_img.mouseenter(function(){
    var _this = $(this);
    var width = _this.width();
    var height = _this.height();
    if( width>100 && height>30 ){
        _will_rotate_img = _this;
        _rotate_times = _this.attr("times") || (_this.attr("times", "0") && "0");
        var position = _this.offset();
        width = _rotate_times & 1 && (height*height/width) || _this.width();
        _rotateImg.css({"top":position.top, "left":position.left + width - _rotateImg.width(), "display": "block"});
    }
});

$("#rotateImgLBtn").click(function(){
    rotateImg(_will_rotate_img, --_rotate_times);
});

$("#rotateImgRBtn").click(function(){
    rotateImg(_will_rotate_img, ++_rotate_times);
});

//移出图片时隐藏按钮，暂时没想到更好的方法
_rotate_img.mouseleave(function(){
    _rotateImg.css("display", "none");
});

_rotateImg.mouseenter(function(){
    _rotateImg.css("display", "block");
});
_rotateImg.mouseleave(function(){
    _rotateImg.css("display", "none");
});


//————————————————旋转图片————————————————

//——————————————————————————————————图片功能——————————————————————————————————


//——————————————————————————————————快捷键——————————————————————————————————
var _r_c=$("#reply_content");
var bottom = $("#Main .inner");
var tab_switch = false;

$(document).keydown(function(event) {
    var keyCode = event.which;
    if (keyCode == 9 && _r_c.length > 0 && bottom.length > 0) {
        if (!_r_c.attr("id") || tab_switch){
            $("html, body").animate({scrollTop: 0}, 300);
            _r_c.blur();
            tab_switch = false;
        }else{
            $("html, body").animate({scrollTop: (bottom.offset().top)}, 300);
            _r_c.focus();
            tab_switch = true;
        }
        window.event.returnValue = false;
    }
});

//——————————————————————————————————快捷键——————————————————————————————————


//——————————————————————————————————拖拽上传图片——————————————————————————————————

_r_c[0].addEventListener("drop",function(e){
    e.preventDefault();
    var fileReader = new FileReader();
    fileReader.onloadend = function() {
        input_img( this.result, img_id++ );
    };
    fileReader.readAsDataURL(e.dataTransfer.files[0]);
});
//——————————————————————————————————拖拽上传图片——————————————————————————————————


//——————————————————————————————————回复楼层号——————————————————————————————————
chrome.storage.sync.get(function(response) {
    if (response.replyUser){
        $("[alt=\"Reply\"]").click(function(){
            setTimeout(() => {
                const replyContent = $("#reply_content"),
                    oldContent = replyContent.val(),
                    prefix = "#" + $(this).parent().parent().find(".no").text() + " ";
                let newContent = "";
                if (oldContent.length > 0){
                    if (oldContent != prefix) {
                        newContent = oldContent + prefix;
                    }
                } else {
                    newContent = prefix;
                }
                replyContent.focus();
                replyContent.val(newContent);
            }, 100);
        });
    }
});
//——————————————————————————————————回复楼层号——————————————————————————————————


//——————————————————————————————————https 新浪图床修改——————————————————————————————————

if (location.protocol == "https:"){
    setTimeout(function () {
        $(".reply_content img").each(function(){
            var $this = $(this);
            if ($this[0].src.indexOf(".sinaimg.cn") != -1 && $this[0].src.indexOf("http://") != -1) {
                $this[0].src = "https" + $this[0].src.substr(4);
            }
            $this[0].src = $this[0].src.replace("https://ws2.sinaimg.cn","https://ww1.sinaimg.cn")
        });
    }, 100);
}




//——————————————————————————————————重新解析图片——————————————————————————————————
/*
默认情况下，v2ex中的评论只渲染来自imgur/weibo/v2ex的图片URL，用户体验非常不好。
需要解决两个问题：
1. 图床限制
2. 非标准的图片URL，以下是需要转换的URL
  - https://imgur.com/s9vHWcC
  - not starts with https://
*/

// Helper functions
var regex_common_imgurl = /\/.+\.(jpeg|jpg|gif|png)$/;
function is_common_img_url(url) { // 常见的图片URL
    return (url.match(regex_common_imgurl) != null);
}

var regex_imgur_imgurl = /^https?:\/\/imgur\.com\/[a-zA-Z0-9]{7}$/;
function is_imgur_url(url) { // 是否属于imgur的图片URL
    return (url.match(regex_imgur_imgurl) != null);
}

function is_img_url(url) {
    return (is_common_img_url(url) || is_imgur_url(url));
}

function has_img_url(text) {
    return (
        regex_common_imgurl.test(text) ||
        regex_imgur_imgurl.test(text)
    );
}

function convert_img_url(url) {
    url = url.replace(/ /g, '');
    // https://imgur.com/s9vHWcC
    if (is_imgur_url(url)) {
        url += ".png";
    }
    if (is_img_url(url)) {
        // not starts with `http`
        if (!(
                url.startsWith('//') ||
                url.startsWith('http://') ||
                url.startsWith('https://')
            )) {
            url = 'https://' + url;
        }
    }
    return url;
}


var regex_url = /((http(s)?:)?\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
function replacer_url2img(match, offset, string) {
    if (is_common_img_url(match)) {
        let t = `<a target="_blank" href="${match}"><img class="embedded_image" src="${match}" /></a>`;
        return t;
    }
    return match;
}

var regex_mdimg = /(?:!\[(.*?)\]\s*\((.*?)\))/g;
function replacer_mdimg2htmlimg(match, p1, p2, offset, string) {
    p2 = convert_img_url(p2);
    if (is_common_img_url(p2)) {
        show_parsed = true;
        let t = `<a target="_blank" href="${p2}"><img class="embedded_image" src="${p2}" alt="${p1}" /></a>`;
        return t;
    }
    return match;
}

var regex_html_imgtag = /&lt;img.*?src="(.*?)"[^\>]*&gt;/g;
function replacer_plainimgtag2imgtag(match, p, offset, string) {
    p = convert_img_url(p);
    return `<a target="_blank" href="${p}"><img class="embedded_image" src="${p}" /></a>`;
}

var regex_dirty_html = /<(?:\/|)script>/g;
function replace_dirty2escape(p, offset, string) {
    return p.startsWith("<s") ? "&lt;script&gt;" : "&lt;\/script&gt;";
}

function construct_separator_html(id, tip) { // tip: 显示/隐藏
    let html_part1 = `<p class="reply-separator">`,
        html_part2 = `</p>`;
    return html_part1 +
        `（本回复已由<a href="https://github.com/sciooga/v2ex-plus"> v2ex plus </a>重新解析）<a class="toggle_original_reply_link" reply-id="${id}">点击此处${tip}原始回复</a>` +
        html_part2;
}




// Main logic and code
/*
针对每个回复，拷贝其html，并作如下处理：
1. 恢复出原始文本
  1.1 用<img>中的src替换<img>
  1.2 用<a>中的text替换<a>

2. 重新解析文本
  2.1 转换markdown格式的图片: `![]()` -> <img />
  2.2 转换escaped <img>格式的图片: `&lt;img &gt;` -> <img />
  2.3 转换plain image url: *.jpg -> <img />

3.替换脏字符为转义字符

4. 判断是否展示
*/

chrome.storage.sync.get("imageParsing", function(settings) {
    var imageParsing = settings["imageParsing"];
    if (imageParsing == "off") {
        return;
    }

    var show_parsed = false;
    var replies = $(".reply_content");
    let i = 0,
        n_replies = replies.length;
    for (; i < n_replies; i++) {
        // for each reply

        let reply = $(replies[i]),
            reply_copy = reply.clone(true, true),
            j = 0;
        show_parsed = false;

        // 1. 恢复出原始文本

        let imgs = $(reply_copy).find("img"),
            n_imgs = imgs.length;
        for (j = 0; j < n_imgs; j++) { // 1.1 用<img>中的src替换<img>
            let img = $(imgs[j]),
                img_url = img.attr("src");
            img.replaceWith(img_url);
        }

        let links = $(reply_copy).find("a"),
            n_links = links.length;
        for (j = 0; j < n_links; j++) { // 1.2 用<a>中的text替换<a>
            let a = $(links[j]),
                href = a.attr("href"),
                text = a.text();
            text = text.replace(/ /g, "");
            if (is_img_url(href) && is_img_url(text)) {
                // or less strict: has_img_url(text)
                url = convert_img_url(text);
                a.replaceWith(url);
            }
        }

        // 2. 重新解析文本
        let html = $(reply_copy).html();
        html = html.replace(regex_mdimg, replacer_mdimg2htmlimg); // 2.1 转换markdown格式的图片![]()
        $(reply_copy).html(html);

        html = html.replace(regex_html_imgtag, replacer_plainimgtag2imgtag); // 2.2 转换html <img>格式的图片<img />
        $(reply_copy).html(html);

        let contents = $(reply_copy).contents();
        for (j = 0; j < contents.length; j++) { // 2.3 转换plain image url
            let content = $(contents[j]);
            if (content[0].nodeType == 3) {
                // text
                let text = $(content).text();
                if (regex_url.test(text)) {
                    text = text.replace(regex_url, replacer_url2img);
                    $(contents[j]).replaceWith(text);
                }
            }
        }

        //3.替换脏字符为转义字符
        html = $(reply_copy).html();
        html = html.replace(regex_dirty_html, replace_dirty2escape); // 3.1 将脏字符替换为转义字符
        $(reply_copy).html(html);


        // 4. 判断是否展示
        if (
            show_parsed ||
            reply.find("img").length < reply_copy.find("img").length
        ) {
            reply.wrapInner(
                `<div id="original-reply-${i}" class="original-reply"></div>`
            );
            if (imageParsing == "auto-hide") {
                $(`#original-reply-${i}`).toggle(false);
            }

            reply.append(`<div id="reply-separator-${i}-display"></div>`);
            reply.append(`<div id="reply-separator-${i}-hide"></div>`);
            $(`#reply-separator-${i}-display`).html(
                construct_separator_html(i, "显示")
            );
            $(`#reply-separator-${i}-hide`).html(
                construct_separator_html(i, "隐藏")
            );
            if (imageParsing == "auto-hide") {
                $(`#reply-separator-${i}-display`).toggle(true);
                $(`#reply-separator-${i}-hide`).toggle(false);
            } else {
                $(`#reply-separator-${i}-display`).toggle(false);
                $(`#reply-separator-${i}-hide`).toggle(true);
            }

            reply_copy.wrapInner(`<div id="parsed-reply${i}"></div>`);
            reply.append(reply_copy.contents());
        }
    }

    $(".toggle_original_reply_link").click(function(e) {
        setTimeout(() => {
            let target = $(e.target),
                id = target.attr("reply-id");
            $(`#original-reply-${id}`).toggle();
            $(`#reply-separator-${id}-display`).toggle();
            $(`#reply-separator-${id}-hide`).toggle();
        }, 100);
    });
});

