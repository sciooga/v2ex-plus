//倒三角图片
var triangle_img = triangle_img || 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAYAAAD37n+BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ\
                                    bWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp\
                                    bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6\
                                    eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0\
                                    NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo\
                                    dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw\
                                    dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv\
                                    IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS\
                                    ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD\
                                    cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFu\
                                    Y2VJRD0ieG1wLmlpZDo4Qzg5NDBERjEzNjgxMUU1QjFBNEJEQUY2OUQ1QUI3OSIgeG1wTU06RG9j\
                                    dW1lbnRJRD0ieG1wLmRpZDo4Qzg5NDBFMDEzNjgxMUU1QjFBNEJEQUY2OUQ1QUI3OSI+IDx4bXBN\
                                    TTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhDODk0MEREMTM2ODExRTVC\
                                    MUE0QkRBRjY5RDVBQjc5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhDODk0MERFMTM2ODEx\
                                    RTVCMUE0QkRBRjY5RDVBQjc5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4\
                                    bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+1nLxGAAAADtJREFUeNqMy8EOACAIAlD6c/6cys3m\
                                    aC056AEeJFH9EOugifYGCX6IuavghVg3DhzR+xHqDu2fTAEGABzG2i3onabOAAAAAElFTkSuQmCC'

//关注与屏蔽
function follow_or_bolck( _target, bash, undo, default_name ){
    var v = '撤销';
    _target.attr('value') == '撤销' && (bash = undo) && (v = default_name);
    _target.attr('value', '等待');
    $.get( bash+btn_key, function(){
        _target.attr('value', v);
    });
}

//隐藏个人信息
function hidden_user_info(){
    _user_info.css({'marginTop':'0px', 'opacity':'0'});
    setTimeout(function(){
        _user_info.css('visibility', 'hidden');
    },300);
    hidden_userInfo = null;
}


    $('body').append("<div id='userInfo' style='position:absolute; background:#fff; min-width:260px; max-width:360px; padding-bottom:10px; border-radius:3px; text-align:center; visibility:hidden; opacity:0; box-shadow:0px 3px 20px #8e8e8e; font-size:14px; line-height:1.6; transition:margin .3s, opacity .3s;'>\
                        <div style='background:url("+  chrome.extension.getURL('img/user_info_background.gif') +") 100% 100%; padding:18px 18px 18px 78px; border-radius:3px 3px 0px 0px; text-align:left; color:#fff; white-space:nowrap;'>\
                            <img  id='userAvatar' src='' style='width:48px; border-radius:4px; position:absolute; left:18px; margin-right:20px;'/>\
                            <span id='userName'></span>&emsp;<span id='userId'></span>号会员<br/>\
                            <span id='userLocation'></span>加入于&ensp;<span id='userCreated'></span><br/>\
                        </div>\
                        <p style='margin:6px;'>\
                            <span id='userTagline'></span>\
                            <span id='userWebsite'></span>\
                            <span id='userCompany'></span>\
                        </p>\
                        <input id='userFollow' type='button' value='关注' class='super special button'>&emsp;\
                        <input id='userBlock' type='button' value='屏蔽' class='super normal button'>\
                        <img src='"+ triangle_img +"' style='position:absolute; bottom:-6px; left:124px;'/>\
                      </div>");
    var _user_info = $('#userInfo');
    var _user_avatar = $('#userAvatar');
    var _user_name = $('#userName');
    var _user_id = $('#userId');
    var _user_location = $('#userLocation');
    var _user_created = $('#userCreated');
    var _user_tagline = $('#userTagline');
    var _user_website = $('#userWebsite');
    var _user_company = $('#userCompany');
    var _user_follow = $('#userFollow');
    var _user_block = $('#userBlock');
    var avatar_src;
    var btn_key;
    var hidden_userInfo;

    $('#Main .avatar').mouseenter(function(){
        var _this = $(this);
        var _cell = _this.parents("div[id^=r_]");
        var _reply_user_name = _this.parent().attr('href');
        _reply_user_name = _reply_user_name ? _reply_user_name.substr(8) : _cell.find('strong a').text();
        //todo 悬浮时等待的动画
        avatar_src = _this.attr('src');
        _this.attr('src', chrome.extension.getURL('img/loading.gif'));
        //_this.css({'transition':'border 1s', 'borderBottom':'2px solid #A4FF94'});
        //todo 判断是否是切换了其他头像 没切换用户的话就不 get 优化逻辑不用判断两次名字
        if (hidden_userInfo && _user_name.text() == _reply_user_name ){
            clearTimeout(hidden_userInfo);
            _user_info.css({"top":(_this.offset().top - 32 - _user_info.height()) + "px", "left":(_this.offset().left - 106) + "px", 'visibility':'visible', 'marginTop':'10px', 'opacity':'1'});
        }else if( _user_name.text() == _reply_user_name ){
            display_userInfo = setTimeout(function(){
                _user_info.css({"top":(_this.offset().top - 32 - _user_info.height()) + "px", "left":(_this.offset().left - 106) + "px", 'visibility':'visible', 'marginTop':'10px', 'opacity':'1'});
                setTimeout(function(){_this.attr('src', avatar_src);}, 280);
                },500);
        }else{
            display_userInfo = setTimeout(function(){
                //各种原因决定不用 API 以获得更多数据
                console.log('jiazai')
                $.get('https://www.v2ex.com/member/' + _reply_user_name, function(data){
                    data = data.substring(data.indexOf("id=\"Main\""), data.indexOf("class=\"fl\""))
                    //获取用户信息
                    var id = RegExp("V2EX 第 ([0-9]+?) 号会员").exec(data)[1];
                    var location = RegExp("maps\\?q=(.+?)\"").exec(data);
                    var created = RegExp("加入于 (.+?) ").exec(data)[1];
                    var tagline = RegExp("bigger\">(.+?)</span>").exec(data);
                    var website = RegExp("\"(.+?)\".*?alt=\"Website.*?&nbsp;(.+?)<").exec(data);
                    var company = RegExp("building\"></li> &nbsp; <strong>(.*?)</strong> (.*?)</span>").exec(data);
                    var online = RegExp("ONLINE").exec(data);
                    btn_key = RegExp("/([0-9]+?\\?t=[0-9]+?)';").exec(data);
                    var follow = RegExp("加入特别关注").test(data);
                    var block = RegExp("Block").test(data);
                    if(btn_key){
                        btn_key = btn_key[1];//鼠标悬浮在自己头像无法获取 key
                        follow && _user_follow.attr('value', '关注') || _user_follow.attr('value', '撤销');
                        block && _user_block.attr('value', '屏蔽') || _user_block.attr('value', '撤销');
                    }else{
                        _user_follow.attr('value', '本人');
                        _user_block.attr('value', '本人');
                    }

                    setTimeout(function(){_this.attr('src', avatar_src);}, 280);
                    _user_avatar.attr('src', avatar_src);
                    _user_name.text(_reply_user_name);
                    _user_id.text(id);
                    _user_location.html(location && location[1]+'&emsp;');
                    _user_created.text(created);
                    _user_tagline.html(tagline && tagline[1]+'<br/>');
                    _user_website.html(website && "<a href='"+ website[1] +"'>"+ website[2] +"</a><br/>");
                    _user_avatar.css('-webkit-filter', 'grayscale('+ (~~!online) +')');
                    _user_company.html( company && (company[1] + company[2]) );
                    _user_info.css({"top":(_this.offset().top - 32 - _user_info.height()) + "px", "left":(_this.offset().left - 106) + "px", 'visibility':'visible', 'marginTop':'10px', 'opacity':'1'});
                });
            }, 500);
        }
    });

    _user_follow.click(function(){
        follow_or_bolck( _user_follow, '/follow/', '/unfollow/', '关注' );
    });

    _user_block.click(function(){
        follow_or_bolck( _user_block, '/block/', '/unblock/', '屏蔽' );
        confirm('总免不了遇到一些糟糕的人和事，保持距离免得坏了心情: )\n是否刷新本页让屏蔽立即生效？') && location.reload();
    });

    $('#Main .avatar').mouseleave(function(){
        clearTimeout(display_userInfo);
        $(this).attr('src', avatar_src);
        hidden_userInfo = setTimeout(hidden_user_info,300);
    });

    _user_info.mouseleave(function(){
        hidden_userInfo = setTimeout(hidden_user_info,300);
    });

    _user_info.mouseenter(function(){
        clearTimeout(hidden_userInfo);
    });