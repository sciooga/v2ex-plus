
//列表开始于 index 1
function get_at_name_list( str ){
    var name_list = Array();
    var patt_at_name = RegExp("<a href=\"/member/(.*?)\">", "g");
    name_list[0] = 't';
    for (var i=1; name_list[i-1]; ++i){
        name_list[i] = patt_at_name.exec( str );
        name_list[i] = name_list[i]!=null && name_list[i][1] || '';
    }
    return name_list
}

//判断是否为相关的回复
function related_reply( reply_content, _reply_user_name, _reply_at_name ){
    var _related_reply = false;
    var _this_reply_at_name_list = get_at_name_list( reply_content );
    if ( _this_reply_at_name_list[1] ){
        for ( var i = 1;  _this_reply_at_name_list[i]; ++i){
            if ( _this_reply_at_name_list[i] == _reply_user_name || _reply_at_name == _this_reply_at_name_list[i] ){
                _related_reply = true;
            }
        }
    }else{
        _related_reply = true;
    }
    return _related_reply;
}

//同一帖子翻页跳过主题
var _t_num = RegExp("/t/(\\d+)");
var _history_t_num = _t_num.exec(document.referrer);
_history_t_num = _history_t_num!=null && _history_t_num[1] || 'none';
var _current_t_num = _t_num.exec(window.location.href)[1] || ' none ';
if ( _history_t_num == _current_t_num ){
    $('html, body').animate({scrollTop: ($('.topic_buttons').offset().top)}, 300);
}

//插入图片
function input_img( input_img_base64, this_img_id ){

    _upload_image.fadeIn(1000);
    _upload_image.append("<div class='imgId"+ this_img_id +"'><div><img src='"+ input_img_base64 +"' alt='上传图片'/></div><span>上传中</span></div>");
    input_img_base64 = RegExp("base64,(.*)").exec(input_img_base64)[1];

    chrome.runtime.sendMessage({img_base64: input_img_base64}, function(response) {
        var _img_preview = $('.imgId'+ this_img_id);
        if (response.upload_status == '上传中' ){
            alert('仍有图片在上传中，请稍等...');
            _img_preview.find('span').text('请重新上传');
        }else{
            _upload_img_btn.text('正在上传');
            //哎，下下策，谁有更好的办法一定要告诉我
            var get_img_id = setInterval(function(){
                chrome.runtime.sendMessage({get_img_id: 't'}, function(response) {
                    if ( response.img_id == '失败' ){
                        alert('微博图片上传失败，可能是未登录微博');
                        window.clearInterval( get_img_id );
                        _img_preview.find('span').text('请重新上传');
                        _upload_img_btn.text('插入图片');
                    }else if( response.img_id != '上传中' ){
                        window.clearInterval( get_img_id );
                        img_list['图片'+this_img_id] = ' http://ww2.sinaimg.cn/large/'+ response.img_id +'.jpg ';
                        _reply_textarea.val(function(i,origText){
                            return origText + "[:图片"+ this_img_id +":]";
                        });
                        _upload_img_btn.text('插入图片');
                        _img_preview.find('span').text('[:图片'+ this_img_id +':]');
                        _img_preview.css({'background': 'rgba(246, 246, 246, 0.5)','borderColor': '#A4FF94'});
                    }
                });
            },1000);
        }
    });
}


//$(document).ready(function(){//取消注释开启延迟加载（注意上下括号都要取消注释）

//——————————————————————————————————会话详情——————————————————————————————————

    var page_current_num = ~~($('.page_current').text()) || '1';
    var _key_user = $('.header small a:first-of-type').text();
    var _reply_user_name_list = Array();
    var _reply_content_list = Array();
    var r_i = 1;
    $('.topic_buttons').append("<a href='#;' id='onlyKeyUser' class='tb'>只看楼主</a>");

    $('div[id^=r_]').each(function(){
        var _this = $(this);
        var _reply_content = _this.find('.reply_content').html();
        var _reply_user_name = _this.find('strong a').text();
        var _reply_at_name = RegExp("<a href=\"/member/(.*?)\">").exec(_reply_content);

        if ( _key_user == _reply_user_name ){
            _this.css('backgroundColor', 'rgba(255,255,249,0.4)');//设置楼主回复背景颜色
        }else{
            _this.addClass('normalUser');
        }

        _reply_user_name_list[r_i] = _reply_user_name;
        _reply_content_list[r_i++] = _reply_content;
        if( _reply_at_name ){
            _this.find('.sep5').before("<span class='replyDetailBTN fade small'>会话详情</span>");
        }
    });

    $('#onlyKeyUser').click(function(){
        var _this = $(this);
        if (_this.text() == '只看楼主'){
            _this.text('全部回复');
            $('.normalUser').slideUp(600);
        }else{
            _this.text('只看楼主');
            $('.normalUser').slideDown(600);
        }
    });

    var btn_id = 0;
    $('.replyDetailBTN').click(function(){
        var _this = $(this);
        var _cell = _this.parents("div[id^=r_]");//由于最后一条回复 class 为 inner 所以还是匹配 id 完整些
        var _reply_content = _cell.find('.reply_content').html();

        if (_this.text() == '会话详情'){
            _this.text('加载中...');
            _cell.after("<div class='replyDetail'></div>");

            var _replyDetail = _cell.next('.replyDetail');
            var _reply_user_name = _cell.find('strong a').text();
            var _reply_at_name_list = get_at_name_list( _reply_content );

            for (var i=1; _reply_at_name_list[i]; ++i) {
                r_i = 1;
                _replyDetail.append("<p class='bubbleTitle'>本页内 "+ _reply_user_name +" 与 "+ _reply_at_name_list[i] +" 的会话：</p>");
                while ( _reply_user_name_list[r_i] ){

                    if ( _reply_user_name_list[r_i] == _reply_user_name ){
                        var _bubble = "<div class='rightBubble";
                        !related_reply( _reply_content_list[r_i], _reply_user_name, _reply_at_name_list[i] ) && (_bubble+=' unrelated');
                        _bubble += "' style='text-align: right;'><div>"+ _reply_content_list[r_i] +"<p class='bubbleName' style='text-align:right;'><span class='unrelatedTip'><span>&emsp;回复于"+ (r_i+(page_current_num-1)*100) +"层&emsp;"+ _reply_user_name +"</p></div></div>";
                        _replyDetail.append( _bubble );

                    }else if( _reply_user_name_list[r_i] == _reply_at_name_list[i] ){
                        var _bubble = "<div class='leftBubble";
                        !related_reply( _reply_content_list[r_i], _reply_user_name, _reply_at_name_list[i] ) && (_bubble+=' unrelated');
                        _bubble += "' style='text-align: left;'><div>"+ _reply_content_list[r_i] +"<p class='bubbleName' style=''>"+ _reply_at_name_list[i] +"&emsp;回复于"+ (r_i+(page_current_num-1)*100) +"层&emsp;<span class='unrelatedTip'><span></p></div></div>";
                        _replyDetail.append( _bubble );
                    }

                r_i++;
                }
            }
            _this.addClass('btn_id'+btn_id);
            _replyDetail.append("<p class='bubbleName' style='margin-top: 20px; text-align: right; padding: 10px 4px 5px;'><span class='replyDetailEnd item_node' onclick='$(\".btn_id"+ btn_id +"\").click();$(\"html, body\").animate({scrollTop: ($(\".btn_id"+ btn_id++ +"\").offset().top-200)}, 600);'>收起会话</span></p>");
            _this.text('收起会话');
            _replyDetail.slideDown(800);

        }else{
            _this.text('会话详情');
            var _replyDetail = _cell.next('.replyDetail');
            setTimeout(function(){
                _replyDetail.remove();
            },800);
            _replyDetail.slideUp(800);
        }
    });

//——————————————————————————————————会话详情——————————————————————————————————


//——————————————————————————————————图片功能——————————————————————————————————

    var _reply_textarea = $('#reply_content');
    _reply_textarea.attr('placeholder', '你可以在文本框内直接粘贴图片\n类似于 [:微笑:] 的图片标签可以优雅的移动');

    var _reply_textarea_top_btn = _reply_textarea.parents('.box').children('.cell:first-of-type');
    _reply_textarea_top_btn.append("<span class='inputBTN1'> › 表情</span> <span class='inputBTN2'> › 插入图片</span><input type='file' style='display: none' id='imgUpload' />");

//————————————————表情功能————————————————

    _reply_textarea_top_btn.before(emoticon_list);
    var _emoticon = $(".emoticon");
    _reply_textarea_top_btn.after("<div class = 'uploadImage' style='display: none;padding-top: 8px;'></div>")
    var _upload_image = $('.uploadImage');

    $('.inputBTN1').click(function(){
        var _emoticon_switch = -1;
        _emoticon.is(":visible") || (_emoticon_switch=1);
        _emoticon.slideToggle(300);
        $("html, body").animate({scrollTop: ($(document).scrollTop()+66*_emoticon_switch)}, 300);
    });

    $('.emoticon img').click(function(){
        var _this = $(this);
        var _emoticon_name = _this.attr('alt');
        _reply_textarea.val(function(i,origText){
            return origText + "[:"+ _emoticon_name +":]";
        });
        _reply_textarea.focus();
    });

//————————————————表情功能————————————————

//————————————————上传图片————————————————

    var img_id = 1;

    //从剪切板上传
    //只要粘贴就触发，不管在什么地方粘贴
    document.body.addEventListener("paste", function(e) {
        for (var i = 0; i < e.clipboardData.items.length; i++) {
            var this_item = e.clipboardData.items[i];
            if ( this_item.kind == "file" && /image\/\w+/.test(this_item.type) ) {
                var imageFile = this_item.getAsFile();

                var fileReader = new FileReader();
                fileReader.onloadend = function(e) {
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


    //选择图片上传
    var _upload_img_btn = $('.inputBTN2');
    var _imgUpload = $('#imgUpload');
    _upload_img_btn.click(function(){
        _imgUpload.click();
    });
    _imgUpload.change(function(e){
        var files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
        if (files){
            var img_file = files[0];
            if(!/image\/\w+/.test(img_file.type)){
                alert("请上传图片文件");
                return false;
            }else{
                var reader = new FileReader();
                reader.onload = function(e) {
                    input_img( this.result, img_id++ );
                }
                reader.readAsDataURL(img_file);
            }
        }else{
            alert('出错了，获取不到文件。');
        }
    });

//————————————————上传图片————————————————


//————————————————替换图片标签————————————————

if (_reply_textarea.val()) {_reply_textarea_top_btn.append('&emsp;之前上传的图片可能已丢失，请重新上传。')};
//#1是用来调试的，点击 textarea 模拟显示上传的字符串
//    _reply_textarea.click(function(){//#1
    _reply_textarea.parent().submit(function(){
        _reply_textarea.val(function(i,origText){
            var patt_emoticon_name = RegExp("\\[:(.+?):\\]", "g");
            origText = origText.replace(patt_emoticon_name, function(i,k){return img_list[k]});
            return origText;
        });
    });

//————————————————替换图片标签————————————————


//——————————————————————————————————图片功能——————————————————————————————————

//});//取消注释开启延迟加载（注意上下括号都要取消注释）