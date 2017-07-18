//——————————————————————————————————新窗口浏览主题——————————————————————————————————


    var nwe_window;
    chrome.runtime.sendMessage({action: 'get_newWindow_status'}, function(response) {
        if ( response.newWindow_status ){
            $('.item_title a').attr('target', '_blank');
            $('.item_hot_topic_title a').attr('target', '_blank');
            nwe_window = "target='_blank'";
        }
    });

//——————————————————————————————————新窗口浏览主题——————————————————————————————————


//——————————————————————————————————预览功能——————————————————————————————————

    chrome.runtime.sendMessage({action: 'get_preview_status'}, function(response) {
        if (!response.preview_status)
            return;

        $('div#Main > div:nth-of-type(2) .cell').each(function(){
            if($(this).find('.fade').text().indexOf('...')!=-1){
                return ;
            }
            $(this).find('.fade').append(" &nbsp;•&nbsp; <span class='preview'>预览</span>");
        });

        var btn_id = 0;
        $('.preview').click(function(){
            var _this = $(this);
            var _cell = _this.parents(".cell");
            if (_this.text() == '预览'){
                _this.text('加载中...');
                _cell.after("<div class='previewWindow'></div>");
                var _href = _cell.find('.item_title a').attr('href');
                _href = location.origin + _href;
                $.get(_href, function(data){
                    var _previewWindow = _cell.next('.previewWindow');
                    data = data.substr(data.indexOf("header")+8);
                    //当匹配不到topic_conten时返回-1 substring 按0处理，既显示整个标题头部
                    data = data.substring(data.indexOf("<div class=\"topic_content\">"), data.indexOf("<div class=\"topic_buttons\">"));
                    data = data.replace('hljs.initHighlightingOnLoad();', '');
                    _this.addClass('btn_id'+btn_id);
                    _previewWindow.html(data+"<p class='previewWindowEnd'>\
                                                <a class='item_node' href='"+ _href +"' "+ nwe_window +">详细</a>\
                                                <span class='item_node' onclick='\
                                                    $(\".btn_id"+ btn_id +"\").click();$(\"html, body\").animate({scrollTop: ($(\".btn_id"+ btn_id++ +"\").offset().top-200)}, 600);'>收起\
                                                </span>\
                                              </p>");
                    var _next_cell = _previewWindow.next();
                    _next_cell.css('borderTop', _next_cell.css('borderBottom'));
                    _this.text('收起');
                    _previewWindow.slideDown(800);

                });
            }else{
                _this.text('预览');
                var _previewWindow = _cell.next('.previewWindow');
                setTimeout(function(){
                    _previewWindow.next().css('borderTop', 'none');
                    _previewWindow.remove();
                },800);
                _previewWindow.slideUp(800);
            }
        });

    });

//——————————————————————————————————预览功能——————————————————————————————————


//——————————————————————————————————一键领取登陆奖励——————————————————————————————————

    var _mission_btn = $('div#Rightbar > div:nth-of-type(4) a');
    if ( _mission_btn.text() == '领取今日的登录奖励' ){
        _mission_btn.attr('href', "/mission/daily/redeem" + RegExp("/signout(\\?once=[0-9]+)").exec($('div#Top').html())[1]);
        _mission_btn.html('一键领取今日的登录奖励 by vPlus<br/>Take your passion and make it come true. ')
    }

//——————————————————————————————————一键领取登陆奖励——————————————————————————————————
