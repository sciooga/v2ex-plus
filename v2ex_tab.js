
//——————————————————————————————————预览功能——————————————————————————————————

    var i = 0;
    $('div#Main > div:nth-of-type(2) .cell').each(function(){
        var _this = $(this);
        //由于上面是对 box 内所有 div 操作（省事），所有在节点内（/go/*）会产生两个 preview 所以需要一个判断。
        _this.find('.preview').length>0 || _this.find('.fade').append(" &nbsp;•&nbsp; <span class='preview'>预览</span>");
    });

    i = 0;
    $('div#Rightbar div.box').each(function(){
        var _this = $(this);
    });

    var btn_id = 0;
    $('.preview').click(function(){
        var _this = $(this);
        var _cell = _this.parents(".cell");
        if (_this.text() == '预览'){
            _this.text('加载中...');
            _cell.after("<div class='previewWindow'></div>");
            var _href = _cell.find('.item_title a').attr('href');
            $.get(_href, function(data){
                var _previewWindow = _cell.next('.previewWindow');
                var data = data.substr(data.indexOf("header"));
                var data = data.substring(data.indexOf("<div class=\"topic_content\">"), data.indexOf("<div class=\"topic_buttons\">"))
                _this.addClass('btn_id'+btn_id);
                _previewWindow.html(data+"<p class='previewWindowEnd'>\
                                            <a class='item_node' href='"+ _href +"'>详细</a>\
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

//——————————————————————————————————预览功能——————————————————————————————————


//——————————————————————————————————一键领取登陆奖励——————————————————————————————————

    var _mission_btn = $('div#Rightbar > div:nth-of-type(4) a');
    if ( _mission_btn.text() == '领取今日的登录奖励' ){
        _mission_btn.attr('href', "/mission/daily/redeem" + RegExp("/signout(\\?once=\\d+)").exec($('div#Top').html())[1]);
        _mission_btn.html('一键领取今日的登录奖励 by vPlus<br/>Take your passion and make it come true. ')
    }

//——————————————————————————————————一键领取登陆奖励——————————————————————————————————