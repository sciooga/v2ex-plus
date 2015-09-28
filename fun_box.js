

//——————————————————————————————————功能盒子——————————————————————————————————

    //————————————————盒子位置————————————————

    $('body').append("<div id='funBox' class='funBox box funBoxHide'>" +
                         "<div class='vPlusFun-1'>" +
                             "<input type='button' value='回到顶部' class='super normal button' onclick='$(\"html, body\").animate({scrollTop: 0}, 300);'>" +
                             "&emsp;&emsp;" +
                             "<input type='button' value='立即回复' class='super normal button' onclick='var _r_c=$(\"#reply_content\");$(\"html, body\").animate({scrollTop: (_r_c.offset().top)}, 300);_r_c.focus();'>" +
                         "</div>" +
                         "<div class='vPlusFun-2'>" +
                            "<input type='button' value='转为繁体' class='super normal button' id='translate'>&emsp;&emsp;实验性功能" +
                         "</div>" +
                     "</div>");
    var _funBox = $('#funBox');
    var _Rightbar = $('#Rightbar');

    var funBox_timer = null;
    $(document).scroll(function(){
        if (!funBox_timer){
            funBox_timer = setTimeout(function(){
                if ($(document).scrollTop()-_Rightbar.offset().top > _Rightbar.height()){
                    _funBox.addClass('funBoxShow');
                    _funBox.removeClass('funBoxHide');
                }else{
                    _funBox.addClass('funBoxHide');
                    _funBox.removeClass('funBoxShow');
                }
                funBox_timer = null;
            }, 200);
        }
    });

    var funBox_hover_timer = null;
    _funBox.mouseenter(function(){
        if (!funBox_hover_timer) {
            _funBox.css('top', function (index, oldvalue) {
                var top = parseInt(oldvalue);
                if (top != 20) {
                    return top - _funBox.height() + 24;
                }
                return;
            });
        }
    });

    _funBox.mouseleave(function(){
        _funBox.removeAttr("style");
        funBox_hover_timer = setTimeout('funBox_hover_timer = null', 560);
    });

    //————————————————盒子位置————————————————

    //————————————————翻译功能————————————————

    // TODO 权限需要使用自定义权限
    // TODO 使用更高效replace的函数功能
    // TODO html()也使用函数来返回？
    $('#translate').click(function(){
        // 翻译主题内容
        var topic_html = _topic_content.html();
        if (topic_html){
            $.get('https://openapi.baidu.com/public/2.0/bmt/translate?client_id=6LiVfG7sQlapastAGchcuXQk&from=zh&to=cht&q='+topic_html.replace(/ /g,'[s]').replace(/\n/g,'[r]'), function(data){
                _topic_content.html(data['trans_result'][0]['dst'].replace(/[“”]/g,'\'').replace(/(\[s\])/g, ' ').replace(/(\[r\])/g, '\n'));
            });
        }

        //翻译回复内容
        $('.reply_content').each(function(){
            var _this = $(this);
            var _this_html = _this.html();
            if (_this_html){
                $.get('https://openapi.baidu.com/public/2.0/bmt/translate?client_id=6LiVfG7sQlapastAGchcuXQk&from=zh&to=cht&q='+_this_html.replace(/ /g,'[s]').replace(/\n/g,'[r]'), function(data){
                    _this.html(data['trans_result'][0]['dst'].replace(/[“”]/g,'\'').replace(/(\[s\])/g, ' ').replace(/(\[r\])/g, '\n'));
                });
            }
        });
    });

    //————————————————翻译功能————————————————

//——————————————————————————————————功能盒子——————————————————————————————————




