//获取被@的用户，列表开始于 index 1
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

//插入图片
function input_img( input_img_base64, this_img_id ){

    _upload_image.append("<div class='imgId"+ this_img_id +"'>\
                                <div><img src='"+ input_img_base64 +"' alt='上传图片'/></div>\
                                <span>上传中</span>\
                          </div>");
    _upload_image.slideDown(700);
    input_img_base64 = RegExp("base64,(.*)").exec(input_img_base64)[1];

    chrome.runtime.sendMessage({img_base64: input_img_base64}, function(response) {
        var _img_preview = $('.imgId'+ this_img_id);
        if (response.upload_status == '上传中' ){
            alert('仍有图片在上传中，请稍等...');
            _img_preview.find('span').text('请重新上传');
        }else{
            _upload_img_btn.text(' › 正在上传');
            //哎，下下策，谁有更好的办法一定要告诉我
            var get_img_id = setInterval(function(){
                chrome.runtime.sendMessage({get_img_id: 't'}, function(response) {
                    if ( response.img_id.indexOf('失败') != -1 ){
                        alert('图片上传失败，可能是未登录微博/imgur');
                        window.clearInterval( get_img_id );
                        _img_preview.find('span').text('请重新上传');
                        _upload_img_btn.text(' › 插入图片');
                    }else if( response.img_id != '上传中' ){
                        window.clearInterval( get_img_id );
                        img_list['图片'+this_img_id] = ' '+ response.img_id +' ';
                        _reply_textarea.val(function(i,origText){
                            return origText + "[:图片"+ this_img_id +":]";
                        });
                        _upload_img_btn.text(' › 插入图片');
                        _img_preview.find('span').text('[:图片'+ this_img_id +':]');
                        _img_preview.css({'background': 'rgba(246, 246, 246, 0.5)','borderColor': '#A4FF94'});
                    }
                });
            },1000);
        }
    });
}

//获取最近一条回复
function close_reply(no, name){
    var r = Array();
    for (var i=no; i; --i){
        if ( _reply_user_name_list[i] == name ){
                r['reply_content'] = _reply_content_list[i];
                r['reply_no'] = i;
            break;
        }
    }
    return r;
}

    //————————————————同一帖子翻页跳过主题————————————————

    var _t_num = RegExp("/t/(\\d+)");
    var _history_t_num = _t_num.exec(document.referrer);
    _history_t_num = _history_t_num!=null && _history_t_num[1] || 'none';
    var _current_t_num = _t_num.exec(window.location.href)[1] || ' none ';
    if ( _history_t_num == _current_t_num ){
        $('html, body').animate({scrollTop: ($('.topic_buttons').offset().top)}, 300);
    }

    //————————————————同一帖子翻页跳过主题————————————————

    //————————————————基本信息的获取及功能按钮初始化————————————————
    //图片功能的初始化放在图片功能内

    var page_current_num = $('.page_current').text();
    var page_previous_num = page_current_num && ~~(page_current_num)-1 || '0';
    var _key_user = $('.header small a:first-of-type').text();
    var _reply_user_name_list = Array();
    var _reply_content_list = Array();
    var r_i = 1;
    $('.topic_buttons').append(" &nbsp;<a href='#;' id='onlyKeyUser' class='tb'>只看楼主</a>");

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
        //设置按钮名称，是否出现，出现位置
        var btn_name = '';
        if ( _reply_at_name ){
            btn_name = '会话详情';
        }else{
            for (var i=r_i-2; i; --i){
                _reply_user_name_list[i] == _reply_user_name && (btn_name = '所有回复');
                break;
            }
        }
        if ( btn_name ){
            var _append_place;
            var _thanked = _this.find('.thanked');
            if ( _thanked.text() == '感谢已发送' ){
                _append_place = _thanked;
            }else{
                _append_place = _this.find('.no').prev();
            }
            _append_place.before(" &nbsp;<span class='replyDetailBTN'>"+ btn_name +"</span> &nbsp; &nbsp;");
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

    //————————————————基本信息的获取及初始化————————————————


//——————————————————————————————————会话详情 所有回复——————————————————————————————————

    var btn_id = 0;
    $('.replyDetailBTN').click(function(){
        var _this = $(this);
        var _cell = _this.parents("div[id^=r_]");//由于最后一条回复 class 为 inner 所以还是匹配 id 完整些
        var _reply_content = _cell.find('.reply_content').html();
        var btn_name = _this.text();
        _this.css('visibility', 'visible');

        //————————————————会话详情功能————————————————

        if ( btn_name == '会话详情'){
            _this.text('加载中...');
            _cell.after("<div class='replyDetail'></div>");

            var _replyDetail = _cell.next('.replyDetail');
            var _reply_user_name = _cell.find('strong a').text();
            var _reply_at_name_list = get_at_name_list( _reply_content );

            _replyDetail.append("<div class='smartMode' onclick=\"$(this).children('span').toggleClass('checked');$(this).siblings('.unrelated').slideToggle(300);\"><span class='checked'>智能模式</span></div>");

            for (var i=1; _reply_at_name_list[i]; ++i) {
                r_i = 1;
                var _no = ~~(_this.closest('td').find('.no').text());
                var have_main_reply = false;
                var main_reply = 0;
                _replyDetail.append("<p class='bubbleTitle' style='margin-top: 20px;padding-top: 20px;'>本页内 "+ _reply_user_name +" 与 "+ _reply_at_name_list[i] +" 的会话：</p>");
                while ( _reply_user_name_list[r_i] ){

                    if ( _reply_user_name_list[r_i] == _reply_user_name ){
                        var _bubble = "<div class='rightBubble";
                        !related_reply( _reply_content_list[r_i], _reply_user_name, _reply_at_name_list[i] ) && (_bubble+=' unrelated') && (++main_reply);
                        _bubble += "' style='text-align: right;'>\
                                <div>\
                                    "+ _reply_content_list[r_i] +"\
                                    <p class='bubbleName' style='text-align:right;'>\
                                        <span class='unrelatedTip'><span>&emsp;回复于"+ (r_i+page_previous_num*100) +"层&emsp;"+ _reply_user_name +"\
                                    </p>\
                                </div></div>";
                        _replyDetail.append( _bubble );

                    }else if ( _reply_user_name_list[r_i] == _reply_at_name_list[i] ){
                        var _bubble = "<div class='leftBubble";
                        !related_reply( _reply_content_list[r_i], _reply_user_name, _reply_at_name_list[i] ) && (_bubble+=' unrelated') || (have_main_reply=true);
                        ++main_reply;
                        _bubble += "' style='text-align: left;'>\
                                <div>\
                                    "+ _reply_content_list[r_i] +"\
                                    <p class='bubbleName' style=''>\
                                        "+ _reply_at_name_list[i] +"&emsp;回复于"+ (r_i+page_previous_num*100) +"层&emsp;<span class='unrelatedTip'><span>\
                                    </p>\
                                </div></div>";
                        _replyDetail.append( _bubble );
                    }
                    if ( _no-1 == r_i && !have_main_reply ){
                        _replyDetail.find('.unrelated').eq(main_reply-1).removeClass('unrelated');
                    }

                ++r_i;
                }
            }
            _this.addClass('btn_id'+btn_id);
            _replyDetail.append("<p class='bubbleName' style='margin-top: 20px;'><span class='replyDetailEnd item_node' \
                                        onclick='$(\".btn_id"+ btn_id +"\").click();\
                                                 $(\"html, body\").animate({scrollTop: ($(\".btn_id"+ btn_id++ +"\").offset().top-200)}, 600);'>\
                                        收起会话\
                                 </span></p>");
            _this.text('收起会话');
            _replyDetail.slideDown(800);

        //————————————————会话详情功能————————————————

        //————————————————所有回复功能————————————————

        }else if( btn_name == '所有回复' ){
            _this.text('加载中...');
            _cell.after("<div class='replyDetail'></div>");

            var _replyDetail = _cell.next('.replyDetail');
            var _reply_user_name = _cell.find('strong a').text();

            r_i = 1;
            _replyDetail.append("<p class='bubbleTitle' style='margin-top: 20px;padding-top: 20px;'>本页内 "+ _reply_user_name +" 的所有回复：</p>");
            while ( _reply_user_name_list[r_i] ){

                if ( _reply_user_name_list[r_i] == _reply_user_name ){
                    var _bubble = "<div class='rightBubble' style='text-align: right;'>\
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

            _this.addClass('btn_id'+btn_id);
            _replyDetail.append("<p class='bubbleName' style='margin-top: 20px;'>\
                                    <span class='replyDetailEnd item_node' \
                                        onclick='$(\".btn_id"+ btn_id +"\").click();$(\"html, body\").animate({scrollTop: ($(\".btn_id"+ btn_id++ +"\").offset().top-200)}, 600);'>\
                                        收起回复\
                                    </span>\
                                 </p>");
            _this.text('收起回复');
            _replyDetail.slideDown(800);

        //————————————————所有回复功能————————————————

        //————————————————收起功能————————————————

        }else{
            _this.css('visibility', '');
            btn_name=='收起会话' && _this.text('会话详情') || _this.text('所有回复');
            var _replyDetail = _cell.next('.replyDetail');
            setTimeout(function(){
                _replyDetail.remove();
            },800);
            _replyDetail.slideUp(800);
        }
    });

        //————————————————收起功能————————————————

    //————————————————快速查看最近一条回复————————————————

    $('body').append("<div id='foMouse'><div id='closeReply'></div></div>");
    var _close_reply = $('#closeReply');
    var _reply_link = $('div[id^=r_] .reply_content a');
    _reply_link.mouseenter(function(){
        var _this = $(this);
        var _no = ~~(_this.closest('td').find('.no').text()) - page_previous_num*100;
        var _hover_at_name = RegExp("/member/(.+)").exec( _this.attr('href') );
        if ( _hover_at_name != null ){
            _close_reply.html( "<div style='padding-bottom:6px;'>"+ (1+page_previous_num*100) + '层至'+ (_no+page_previous_num*100) +'层间未发现该用户的回复</div>' );
            for (var i=_no; i; --i){
                if ( _reply_user_name_list[i] == _hover_at_name[1] ){
                    _close_reply.html( _reply_content_list[i] + "<p class='bubbleName' style='text-align:right; padding-right:0px;'>\
                                        "+ _reply_user_name_list[i] +"&emsp;回复于"+ (i+page_previous_num*100) +"层&emsp;\
                                    </p>" );
                    break;
                }
            }
            _this.mousemove(function(e){
                if( _close_reply.html() ){
                    _close_reply.css({"top":(e.pageY - 30 - _close_reply.height()) + "px", "left":(e.pageX - 60) + "px", 'opacity':'0.98', 'display':'block'});
                }
            });
        }
    });

    _reply_link.mouseleave(function(){
        _close_reply.css({'opacity':'0'});
        setTimeout(function(){
            _close_reply.css('display', 'none');
        },500);
    });

    //————————————————快速查看最近一条回复————————————————

//——————————————————————————————————会话详情 所有回复——————————————————————————————————


//——————————————————————————————————图片功能——————————————————————————————————

    //————————————————初始化————————————————

    var _reply_textarea = $('#reply_content');
    _reply_textarea.attr('placeholder', '你可以在文本框内直接粘贴截图\n类似于 [:微笑:] 的图片标签可以优雅的移动');

    var _reply_textarea_top_btn = _reply_textarea.parents('.box').children('.cell:first-of-type');
    _reply_textarea_top_btn.append("<span class='inputBTN1'> › 表情</span><span class='inputBTN2'> › 插入图片</span><input type='file' style='display: none' id='imgUpload' accept='image/*' />");

    //————————————————初始化————————————————

    //————————————————表情功能————————————————

    _reply_textarea_top_btn.before(emoticon_list);
    var _emoticon = $(".emoticon");
    _reply_textarea_top_btn.after("<div class = 'uploadImage'></div>")
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

    //————————————————粘贴图片上传————————————————

    //————————————————选择图片上传————————————————

    var _upload_img_btn = $('.inputBTN2');
    var _imgUpload = $('#imgUpload');
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
                reader.onload = function(e) {
                    input_img( this.result, img_id++ );
                }
                reader.readAsDataURL(img_file);
//            }
        }else{
            alert('出错了，获取不到文件。');
        }
    });

    //————————————————选择图片上传————————————————

    //————————————————替换图片标签————————————————

    if (_reply_textarea.val()) {_reply_textarea_top_btn.append('&emsp;之前上传的图片可能已丢失，请重新上传。')};
    //#1是用来调试的，点击 textarea 模拟显示上传的字符串
    //_reply_textarea.click(function( e ){//#1
    _reply_textarea.parent().submit(function( e ){
        if ( _upload_img_btn.text().indexOf('正在上传') == -1 ){
            _reply_textarea.val(function(i,origText){
                var patt_emoticon_name = RegExp("\\[:(.+?):\\]", "g");
                origText = origText.replace(patt_emoticon_name, function(i,k){return img_list[k]});
                return origText;
            });
        }else{
            confirm('仍有图片未上传完成，确定要直接回复？\n未上传的图片将不被发送') || e.preventDefault();
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
        img.css('transform', 'rotate('+ 90*times +'deg) scale('+ scale +')');
        img.attr('times', times);
        _rotateImg.css('display', 'none');
    }

    $('body').append("<div id='rotateImg'><span id='rotateImgLBtn'>左旋</span>&emsp;<span id='rotateImgRBtn'>右旋</span>&emsp;</div>");

    var _rotateImg = $('#rotateImg');
    var _will_rotate_img;
    var _rotate_times;
    var _rotate_img = $('div[id^=r_] .reply_content img');
    _rotate_img.mouseenter(function(e){
        var _this = $(this);
        var width = _this.width();
        var height = _this.height();
        if( width>100 && height>30 ){
            _will_rotate_img = _this;
            _rotate_times = _this.attr('times') || (_this.attr('times', '0') && '0');
            var position = _this.offset();
            width = _rotate_times & 1 && (height*height/width) || _this.width();
            _rotateImg.css({'top':position.top, 'left':position.left + width - _rotateImg.width(), 'display': 'block'});
        }
    });

    $('#rotateImgLBtn').click(function(e){
        rotateImg(_will_rotate_img, --_rotate_times);
    });

    $('#rotateImgRBtn').click(function(e){
        rotateImg(_will_rotate_img, ++_rotate_times);
    });

    //移出图片时隐藏按钮，暂时没想到更好的方法
    _rotate_img.mouseleave(function(){
        _rotateImg.css('display', 'none');
    });

    _rotateImg.mouseenter(function(){
        _rotateImg.css('display', 'block');
    });
    _rotateImg.mouseleave(function(){
        _rotateImg.css('display', 'none');
    });


    //————————————————旋转图片————————————————

//——————————————————————————————————图片功能——————————————————————————————————
