/*!
 * clipboard.js v1.5.12
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.Clipboard=t()}}(function(){var t,e,n;return function t(e,n,o){function i(a,c){if(!n[a]){if(!e[a]){var s="function"==typeof require&&require;if(!c&&s)return s(a,!0);if(r)return r(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return i(n?n:t)},u,u.exports,t,e,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(t,e,n){var o=t("matches-selector");e.exports=function(t,e,n){for(var i=n?t:t.parentNode;i&&i!==document;){if(o(i,e))return i;i=i.parentNode}}},{"matches-selector":5}],2:[function(t,e,n){function o(t,e,n,o,r){var a=i.apply(this,arguments);return t.addEventListener(n,a,r),{destroy:function(){t.removeEventListener(n,a,r)}}}function i(t,e,n,o){return function(n){n.delegateTarget=r(n.target,e,!0),n.delegateTarget&&o.call(t,n)}}var r=t("closest");e.exports=o},{closest:1}],3:[function(t,e,n){n.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},n.nodeList=function(t){var e=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===e||"[object HTMLCollection]"===e)&&"length"in t&&(0===t.length||n.node(t[0]))},n.string=function(t){return"string"==typeof t||t instanceof String},n.fn=function(t){var e=Object.prototype.toString.call(t);return"[object Function]"===e}},{}],4:[function(t,e,n){function o(t,e,n){if(!t&&!e&&!n)throw new Error("Missing required arguments");if(!c.string(e))throw new TypeError("Second argument must be a String");if(!c.fn(n))throw new TypeError("Third argument must be a Function");if(c.node(t))return i(t,e,n);if(c.nodeList(t))return r(t,e,n);if(c.string(t))return a(t,e,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function i(t,e,n){return t.addEventListener(e,n),{destroy:function(){t.removeEventListener(e,n)}}}function r(t,e,n){return Array.prototype.forEach.call(t,function(t){t.addEventListener(e,n)}),{destroy:function(){Array.prototype.forEach.call(t,function(t){t.removeEventListener(e,n)})}}}function a(t,e,n){return s(document.body,t,e,n)}var c=t("./is"),s=t("delegate");e.exports=o},{"./is":3,delegate:2}],5:[function(t,e,n){function o(t,e){if(r)return r.call(t,e);for(var n=t.parentNode.querySelectorAll(e),o=0;o<n.length;++o)if(n[o]==t)return!0;return!1}var i=Element.prototype,r=i.matchesSelector||i.webkitMatchesSelector||i.mozMatchesSelector||i.msMatchesSelector||i.oMatchesSelector;e.exports=o},{}],6:[function(t,e,n){function o(t){var e;if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName)t.focus(),t.setSelectionRange(0,t.value.length),e=t.value;else{t.hasAttribute("contenteditable")&&t.focus();var n=window.getSelection(),o=document.createRange();o.selectNodeContents(t),n.removeAllRanges(),n.addRange(o),e=n.toString()}return e}e.exports=o},{}],7:[function(t,e,n){function o(){}o.prototype={on:function(t,e,n){var o=this.e||(this.e={});return(o[t]||(o[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){function o(){i.off(t,o),e.apply(n,arguments)}var i=this;return o._=e,this.on(t,o,n)},emit:function(t){var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),o=0,i=n.length;for(o;i>o;o++)n[o].fn.apply(n[o].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),o=n[t],i=[];if(o&&e)for(var r=0,a=o.length;a>r;r++)o[r].fn!==e&&o[r].fn._!==e&&i.push(o[r]);return i.length?n[t]=i:delete n[t],this}},e.exports=o},{}],8:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","select"],r);else if("undefined"!=typeof o)r(n,e("select"));else{var a={exports:{}};r(a,i.select),i.clipboardAction=a.exports}}(this,function(t,e){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=n(e),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},a=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),c=function(){function t(e){o(this,t),this.resolveOptions(e),this.initSelection()}return t.prototype.resolveOptions=function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action=e.action,this.emitter=e.emitter,this.target=e.target,this.text=e.text,this.trigger=e.trigger,this.selectedText=""},t.prototype.initSelection=function t(){this.text?this.selectFake():this.target&&this.selectTarget()},t.prototype.selectFake=function t(){var e=this,n="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return e.removeFake()},this.fakeHandler=document.body.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[n?"right":"left"]="-9999px",this.fakeElem.style.top=(window.pageYOffset||document.documentElement.scrollTop)+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,document.body.appendChild(this.fakeElem),this.selectedText=(0,i.default)(this.fakeElem),this.copyText()},t.prototype.removeFake=function t(){this.fakeHandler&&(document.body.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(document.body.removeChild(this.fakeElem),this.fakeElem=null)},t.prototype.selectTarget=function t(){this.selectedText=(0,i.default)(this.target),this.copyText()},t.prototype.copyText=function t(){var e=void 0;try{e=document.execCommand(this.action)}catch(n){e=!1}this.handleResult(e)},t.prototype.handleResult=function t(e){e?this.emitter.emit("success",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)}):this.emitter.emit("error",{action:this.action,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})},t.prototype.clearSelection=function t(){this.target&&this.target.blur(),window.getSelection().removeAllRanges()},t.prototype.destroy=function t(){this.removeFake()},a(t,[{key:"action",set:function t(){var e=arguments.length<=0||void 0===arguments[0]?"copy":arguments[0];if(this._action=e,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function t(){return this._action}},{key:"target",set:function t(e){if(void 0!==e){if(!e||"object"!==("undefined"==typeof e?"undefined":r(e))||1!==e.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&e.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(e.hasAttribute("readonly")||e.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=e}},get:function t(){return this._target}}]),t}();t.exports=c})},{select:6}],9:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","./clipboard-action","tiny-emitter","good-listener"],r);else if("undefined"!=typeof o)r(n,e("./clipboard-action"),e("tiny-emitter"),e("good-listener"));else{var a={exports:{}};r(a,i.clipboardAction,i.tinyEmitter,i.goodListener),i.clipboard=a.exports}}(this,function(t,e,n,o){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function s(t,e){var n="data-clipboard-"+t;if(e.hasAttribute(n))return e.getAttribute(n)}var l=i(e),u=i(n),f=i(o),d=function(t){function e(n,o){r(this,e);var i=a(this,t.call(this));return i.resolveOptions(o),i.listenClick(n),i}return c(e,t),e.prototype.resolveOptions=function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action="function"==typeof e.action?e.action:this.defaultAction,this.target="function"==typeof e.target?e.target:this.defaultTarget,this.text="function"==typeof e.text?e.text:this.defaultText},e.prototype.listenClick=function t(e){var n=this;this.listener=(0,f.default)(e,"click",function(t){return n.onClick(t)})},e.prototype.onClick=function t(e){var n=e.delegateTarget||e.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new l.default({action:this.action(n),target:this.target(n),text:this.text(n),trigger:n,emitter:this})},e.prototype.defaultAction=function t(e){return s("action",e)},e.prototype.defaultTarget=function t(e){var n=s("target",e);return n?document.querySelector(n):void 0},e.prototype.defaultText=function t(e){return s("text",e)},e.prototype.destroy=function t(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)},e}(u.default);t.exports=d})},{"./clipboard-action":8,"good-listener":4,"tiny-emitter":7}]},{},[9])(9)});

//倒三角图片
var triangle_img = chrome.extension.getURL("img/triangle.jpg");

//获取被@的用户，列表开始于 index 1
function get_at_name_list( str ){
    var name_list = Array();
    var patt_at_name = RegExp("<a.*?href=\"/member/(.*?)\">", "g");
    name_list[0] = 't';
    for (var i=1; name_list[i-1]; ++i){
        name_list[i] = patt_at_name.exec( str );
        name_list[i] = name_list[i]!=null && name_list[i][1] || '';
    }

    // 简单去重
    var  unique_name_list = Array();
    for (var i in name_list) {
        var item = name_list[i];
        if (unique_name_list.indexOf(item) === -1) {
            unique_name_list.push(item);
        }
    }

    return unique_name_list;
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
                        alert('图片上传失败，可能是未登录微博/受 imgur 上传次数限制');
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

    //————————————————基本信息的获取及功能按钮初始化————————————————
    //图片功能的初始化放在图片功能内

    var page_current_num = $('.page_current').eq(0).text() || '1';
    var page_previous_num = ~~(page_current_num)-1;
    var _key_user = $('.header small a:first-of-type').text();
    var _topic = $('#Main > div:nth-of-type(2)');
    var _topic_content = $('.cell .topic_content', _topic);
    var _topic_buttons = $('.topic_buttons');
    var _reply_user_name_list = Array();
    var _reply_content_list = Array();
    var r_i = 1;
    var keyReplyColor;

    _topic_buttons.append(" &nbsp;<a href='#;' id='onlyKeyUser' class='tb'>只看楼主</a>");

    $('div[id^=r_]').each(function(){
        var _this = $(this);
        var _reply = _this.find('.reply_content');

        //———回复空格修复———
        _reply.css('whiteSpace', 'pre-wrap').html(function(i, o){
            return o.replace(/<br>/g, '');
        });
        //———回复空格修复———

        var _reply_content = _reply.html();
        var _reply_user_name = _this.find('strong a').text();
        var _reply_at_name = RegExp("<a href=\"/member/(.*?)\">").exec(_reply_content);

        if ( _key_user == _reply_user_name ){
            _this.addClass('keyUser');
        }else{
            _this.addClass('normalUser');
        }

        //判断高度是否超高
        var height = _reply.height();
        if ( height > 1000 ){
            _reply.addClass('waitForFold');
            _reply.attr('vPlus-height', height);
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
            var _append_place;
            var _thanked = _this.find('.thanked');
            if ( _thanked.text() == '感谢已发送' ){
                _append_place = _thanked;
            }else{
                _append_place = _this.find('.no').prev();
            }
            if ( btn_name ){
                _append_place.before(" &nbsp;<span class='replyDetailBTN'>"+ btn_name +"</span> &nbsp; &nbsp;");
            }
            console.log(page_current_num)
            _append_place.before(" &nbsp;<span class='direct' data-clipboard-text='"
              + location.origin + location.pathname + "?p=" + page_current_num + '#' + _this.attr('id')
              + "'>楼层直链</span> &nbsp; &nbsp;");
    });

    if (~~page_current_num > 1){
        console.log('V2EX PLUS: 此主题有多页回复，正在加载所有回复。');
        $.get('https://www.v2ex.com/api/replies/show.json?topic_id='+/\/t\/([0-9]+)/.exec(window.location.href)[1],function(data){
            console.log('V2EX PLUS: 所有回复加载完成。');
            for (var i in data){
                _reply_user_name_list[~~i+1] = data[i].member.username;
                _reply_content_list[~~i+1] = data[i].content_rendered;
            }
            page_previous_num = '0';
        });
    }

    new Clipboard('.direct');
    $('.direct').click(function () {
        alert('此楼层直链已经复制到剪切板中')
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

    chrome.runtime.sendMessage({get_replySetting: 't'}, function(response) {
        var topic_height = _topic.height();
        keyReplyColor = response.keyReplyColor || '255,255,249';
        keyReplyColor += ',';
        keyReplyColor += response.keyReplyA || '0.4';
        $('.keyUser').css('backgroundColor', 'rgba('+ keyReplyColor +')');//设置楼主回复背景颜色
        if (!response.fold){//折叠超长主题
            if (topic_height>1800){
                _topic_content.css({maxHeight:'600px', overflow:'hidden', transition:'max-height 2s'});
                $('.subtle', _topic).hide();
                _topic_buttons.before("<div id='showTopic' style='padding:16px; color:#778087;'>\
                                            <span id='topicBTN'>展开主题</span>\
                                            <div style='height:10px;'></div>\
                                            <span style='font-size:0.6em'>主题超长已自动折叠，点击按钮显示完整的主题。</span>\
                                       </div>");
                $('#topicBTN').click(function(){
                    //乘2是由于当图片未加载完成时，预先记录的高度不准确（短于实际高度）
                    _topic_content.css({maxHeight:topic_height*2});
                    //还有可能是图片及其多，一开始保存的高度数值只有很少一部分图片的高度，所以在上面的两秒动画后还得再取消高度限制
                    setTimeout("_topic_content.css({maxHeight:'none'})", 2000);
                    $('.subtle', _topic).slideDown(800);
                    $('#showTopic').remove();
                });
            }
            var _reply = $('.waitForFold');
            _reply.css({maxHeight:'300px', overflow:'hidden', transition:'max-height 2s'});
            _reply.after("<div class='showReply' style='padding:20px 0px 10px; color:#778087; text-align:center; border-top:1px solid #e2e2e2'>\
                                            <span class='replyBTN'>展开回复</span>\
                                            <div style='height:16px;'></div>\
                                            <span>回复超长已自动折叠，点击按钮显示完整的回复。</span>\
                                  </div>");
            $('.replyBTN').click(function(){
                var _this = $(this);
                var _showReply = _this.parent();
                var _reply = _showReply.prev();
                _reply.css({maxHeight:2*~~(_reply.attr('vPlus-height'))+'px'});
                setTimeout(function(){
                    _reply.css({maxHeight:'none'});
                }, 2000);
                _showReply.remove();
            });
        }

        //————————高亮感谢————————

        $('.box .small.fade').each(function(){
            var $this = $(this);
            if ($this.text().indexOf('♥')!=-1) {
                $this.css('color', 'rgb(' + (response.thankColor || '204,204,204') + ')');
            }
        });

        //————————高亮感谢————————


    });

    //————————同一帖子翻页跳过主题————————

    var _t_num = RegExp("/t/([0-9]+)");
    var _history_t_num = _t_num.exec(document.referrer);
    _history_t_num = _history_t_num!=null && _history_t_num[1] || 'none';
    var _current_t_num = _t_num.exec(window.location.href)[1] || ' none ';
    if ( _history_t_num == _current_t_num ){
        $('html, body').animate({scrollTop: (_topic_buttons.offset().top)}, 300);
    }

    //————————同一帖子翻页跳过主题————————

    //————————视频非 http 访问提示————————

        if ( location.protocol == 'https:' ){
            var iframe_list = _topic_content.find('iframe');
            iframe_list.each(function(){
                //判断是否为腾讯视频
                var _this = $(this);
                if (/http:\/\/v.qq.com/.test(_this.attr('src'))){
                    _this.attr('src', function(index, oldvalue){
                        return 'https' + oldvalue.substring(4);
                    });
                    _this.before('v2ex plus 提醒您：<br/>由于您以 https 访问 v2ex，已将腾讯视频链接修改为 https 现可正常观看。');
                //判断是否为优酷视频
                }else if (/http:\/\/player.youku.com/.test(_this.attr('src'))){
                    _this.before("v2ex plus 提醒您：<br/>由于您以 https 访问 v2ex，无法正常显示优酷视频，您可以访问此链接观看：<br/><br/>&emsp;&emsp;&emsp;&emsp;<a href='"+ _this.attr('src') +"' target='_blank'>新窗口观赏视频</a><br/><br/>");
                    _this.remove();
                }
            });
        }

    //————————腾讯视频非 http 访问提示————————

    //————————————————基本信息的获取及初始化————————————————




//——————————————————————————————————会话详情 所有回复——————————————————————————————————

    var btn_id = 0;
    $('.replyDetailBTN').click(function(){
        var _this = $(this);
        var _cell = _this.parents("div[id^=r_]");//由于最后一条回复 class 为 inner 所以还是匹配 id 完整些
        var _reply_user_name = _cell.find('strong a').text();
        var _reply_content = _cell.find('.reply_content').html();
        var btn_name = _this.text();
        _this.css('visibility', 'visible');

        //————————————————会话详情功能————————————————

        if ( btn_name == '会话详情'){
            _this.text('加载中...');
            _cell.after("<div class='replyDetail'></div>");

            var _replyDetail = _cell.next('.replyDetail');
            var _reply_at_name_list = get_at_name_list( _reply_content );

            _replyDetail.append("<div class='smartMode' onclick=\"$(this).children('span').toggleClass('checked');$(this).siblings('.unrelated').slideToggle(300);\"><span class='checked'>智能模式</span></div>");

            for (var i=1; _reply_at_name_list[i]; ++i) {
                r_i = 1;
                var _no = ~~(_this.closest('td').find('.no').text());
                var have_main_reply = false;
                _replyDetail.append("<p class='bubbleTitle' style='margin-top: 20px;padding-top: 20px;'>本页内 "+ _reply_user_name +" 与 "+ _reply_at_name_list[i] +" 的会话：</p>");
                while ( _reply_user_name_list[r_i] ){

                    if ( _reply_user_name_list[r_i] == _reply_user_name ){
                        var _bubble = "<div class='rightBubble";
                        !related_reply( _reply_content_list[r_i], _reply_user_name, _reply_at_name_list[i] ) && (_bubble+=' unrelated');
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
                        _bubble += "' style='text-align: left;'>\
                                <div>\
                                    "+ _reply_content_list[r_i] +"\
                                    <p class='bubbleName' style=''>\
                                        "+ _reply_at_name_list[i] +"&emsp;回复于"+ (r_i+page_previous_num*100) +"层&emsp;<span class='unrelatedTip'><span>\
                                    </p>\
                                </div></div>";
                        _replyDetail.append( _bubble );
                    }
                    //如果被@用户只有一条回复但回复是@其他不相干用户则显示这条回复
                    if ( _no-1 == r_i && !have_main_reply && /(\S+?) 回复于\d+层/.exec(_replyDetail.children('.leftBubble').last().find('.bubbleName').text())[1] == _reply_at_name_list[i] ){
                        _replyDetail.children('.leftBubble').last().removeClass('unrelated');
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

    $('body').append("<div id='closeReply'></div>");
    var _close_reply = $('#closeReply');
    var _reply_link = $('.reply_content a');
    var display_foMouse;
    _reply_link.mouseenter(function(){
        var _this = $(this);
        var _no = ~~(_this.closest('td').find('.no').text()) - page_previous_num*100;
        var _hover_at_name = RegExp("/member/(.+)").exec( _this.attr('href') );
        if ( _hover_at_name != null ){
            display_foMouse = setTimeout(function(){
                _close_reply.html( "<div style='padding-bottom:6px;'>" + (1) + '层至' + (_no) + "层间未发现该用户的回复</div>" + "<img class='triangle' src='"+ triangle_img +"' />" );
                // 判断 @ 之后是否跟了 # 号
                var result = RegExp("@" + _this.text() + " #(\\d+)").exec(_this.parent().text())
                if (result && _reply_user_name_list[+result[1]] == _this.text()){
                    var i = +result[1]
                    _close_reply.html( _reply_content_list[i] + "<p class='bubbleName' style='text-align:right; padding-right:0px;'>\
                                                "+ _reply_user_name_list[i] +"&emsp;回复于"+ (i+page_previous_num*100) +"层&emsp;\
                                            </p><img class='triangle' src='"+ triangle_img +"' />" );
                } else {
                    for (var i=_no; i; --i){
                        if ( _reply_user_name_list[i] == _hover_at_name[1] ){
                            _close_reply.html( _reply_content_list[i] + "<p class='bubbleName' style='text-align:right; padding-right:0px;'>\
                                                "+ _reply_user_name_list[i] +"&emsp;回复于"+ (i+page_previous_num*100) +"层&emsp;\
                                            </p><img class='triangle' src='"+ triangle_img +"' />" );
                            break;
                        }
                    }
                }
                //判断弹出位置
                var _fo_triangle = $('.triangle', _close_reply);
                var reply_position = [1, 0];
                _fo_triangle.css({bottom:'-6px', top:'auto', transform:'rotate(0deg)'});
                //上方空间不够且下方空间足够则向下弹出
                if ( ( _this.offset().top - $(document).scrollTop() ) < ( _close_reply.height() + 50 ) && ( $(document).scrollTop() + $(window).height() - _this.offset().top ) > ( _close_reply.height() + 50 ) ){
                    reply_position = [0, 16];
                    _fo_triangle.css({top:'-6px', bottom:'auto', transform:'rotate(180deg)'});
                }
                _close_reply.css({"top":(_this.offset().top - reply_position[0]*(34 + _close_reply.height()) + reply_position[1] ) + "px", "left":(_this.offset().left - 80 + _this.width()/2) + "px", 'visibility':'visible', 'opacity':'1', 'marginTop':'10px'});
            },300);
        }
    });

    _reply_link.mouseleave(function(){
        clearTimeout(display_foMouse);
        _close_reply.css({'opacity':'0', 'marginTop':'0px'});
        setTimeout(function(){
            _close_reply.css('visibility', 'hidden');
        },300);
    });

    //————————————————快速查看最近一条回复————————————————

//——————————————————————————————————会话详情 所有回复——————————————————————————————————


//——————————————————————————————————图片功能——————————————————————————————————

    //————————————————初始化————————————————

    var _reply_textarea = document.getElementById('reply_content')
    _reply_textarea.parentNode.replaceChild(_reply_textarea.cloneNode(true), _reply_textarea);
    _reply_textarea = $('#reply_content');

    _reply_textarea.attr('placeholder', '你可以在文本框内直接粘贴截图或拖拽图片上传\n类似于 [:微笑:] 的图片标签可以优雅的移动');

    var _reply_textarea_top_btn = _reply_textarea.parents('.box').children('.cell:first-of-type');
    _reply_textarea_top_btn.append("<span class='inputBTN1'> › 表情</span><span class='inputBTN2'> › 插入图片</span><input type='file' style='display: none' id='imgUpload' accept='image/*' />");

    $('script').each(function(){
        var $this = $(this);
        if ($this.attr('scr') || $this.attr('type') || $this.html().indexOf('textcomplete') == -1){
            return ;
        }

        var script = document.createElement('script');
        script.textContent = $this.html();
        (document.head||document.documentElement).appendChild(script);
        script.parentNode.removeChild(script);
    });

    //————————————————初始化————————————————

    //————————————————表情功能————————————————

    _reply_textarea_top_btn.before(emoticon_list);
    var _emoticon = $(".emoticon");
    _reply_textarea_top_btn.after("<div class = 'uploadImage'></div>");
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

    if (_reply_textarea.val()) {
        _reply_textarea_top_btn.append('&emsp;<span style="color:red;">之前如有上传的图片则已丢失，请重新上传。</span>');
        //还原图片链接为标签
        _reply_textarea.val(function(i,origText){
            for (var img_key_name in img_list){
                origText = origText.replace(new RegExp(img_list[img_key_name],"g"), '[:'+img_key_name+':]');
            }
            return origText;
        });
    }
    //#1是用来调试的，点击 textarea 模拟显示上传的字符串
    //_reply_textarea.click(function( e ){//#1
    _reply_textarea.parent().submit(function( e ){
        if ( _upload_img_btn.text().indexOf('正在上传') == -1 ){
            _reply_textarea.val(function(i,origText){
                origText = origText.replace(new RegExp("\\[:(.+?):\\]", "g"), function(i,k){
                    var img_rul = img_list[k];
                    if (img_rul == undefined){
                        e.preventDefault();
                        return '[:此图片标签已失效删除后请重新上传' + k + ':]';
                    }else{
                        return img_rul;
                    }
                });
                return origText;
            });
        }else{
            confirm('仍有图片未上传完成，确定要直接回复？\n未上传的图片将不被发送') || e.preventDefault();
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
        img.css('transform', 'rotate('+ 90*times +'deg) scale('+ scale +')');
        img.attr('times', times);
        _rotateImg.css('display', 'none');
    }

    $('body').append("<div id='rotateImg'><span id='rotateImgLBtn'>左旋</span>&emsp;<span id='rotateImgRBtn'>右旋</span>&emsp;</div>");

    var _rotateImg = $('#rotateImg');
    var _will_rotate_img;
    var _rotate_times;
    var _rotate_img = $('.reply_content img');
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


//——————————————————————————————————快捷键——————————————————————————————————

// todo 判断是否有回复框
var _r_c=$("#reply_content");
var tab_switch = false;

$(document).keydown(function(event) {
    var keyCode = event.which;
    if (keyCode == 9) {
        if (!_r_c.attr('id') || tab_switch){
            $("html, body").animate({scrollTop: 0}, 300);
            _r_c.blur();
            tab_switch = false;
        }else{
            $("html, body").animate({scrollTop: (_r_c.offset().top)}, 300);
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
    fileReader.onloadend = function(e) {
        input_img( this.result, img_id++ );
    };
    fileReader.readAsDataURL(e.dataTransfer.files[0]);
});

//——————————————————————————————————拖拽上传图片——————————————————————————————————


//——————————————————————————————————拖拽上传图片——————————————————————————————————

$('[alt="Reply"]').click(function(){
    var self = this;
    setTimeout(function (){
        replyContent = $("#reply_content");
        oldContent = replyContent.val();
        prefix = "#" + $(self).parent().parent().find('.no').text() + ' ';
        newContent = ''
        if(oldContent.length > 0){
            if (oldContent != prefix) {
                newContent = oldContent + prefix;
            }
        } else {
            newContent = prefix
        }
        replyContent.focus();
        replyContent.val(newContent);
    }, 100)
})

//——————————————————————————————————拖拽上传图片——————————————————————————————————


//——————————————————————————————————https 新浪图床修改——————————————————————————————————

    if (location.protocol == 'https:'){
        setTimeout(function () {
            $('.reply_content img').each(function(){
                var $this = $(this)
                if ($this[0].src.indexOf('.sinaimg.cn') != -1 && $this[0].src.indexOf('http://') != -1) {
                    $this[0].src = 'https' + $this[0].src.substr(4)
                }
            })
        }, 100)
    }

//——————————————————————————————————https 新浪图床修改——————————————————————————————————
