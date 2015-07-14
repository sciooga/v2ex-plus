var username = location.hash.split('=');
var block_list = username[1].split(',');
username = username[0].substr(1);
var userCreated;

function unblock(target, name, id, created){
    if (confirm('确认要解除对 '+ name +' 的屏蔽？')){
        $.get('https://www.v2ex.com/unblock/'+ id +'?t='+created, function(data, status){
            if(status == 'success'){
                target.text('已经解除');
            }else{
                alert('可能是网络原因解除屏蔽失败，请手动到该用户详情页面确认解除。');
            }
        });
    }
}

$(document).ready(function(){

    if (block_list[0]){
        for ( var i in block_list ){
            $.get('https://www.v2ex.com/api/members/show.json?id='+block_list[i], function(data, status){
                if(status == 'success'){
                    if( data.status == 'found'){
                        var created = new Date();
                        created.setTime(data.created*1000)
                        $('#blockList').append("<table>\
                                                    <tbody>\
                                                        <tr>\
                                                            <td style='width:48px;'>\
                                                                <img src='https://"+ data.avatar_large +"' class='avatar'>\
                                                            </td>\
                                                            <td style='width:230px; font-size:90%;'>\
                                                                "+ data.username +" 第 "+ data.id +" 号会员<br/>加入于 "+ created.toLocaleDateString() +"\
                                                            </td>\
                                                            <td>\
                                                                <a class='vplusBTN' href='"+ data.url +"' target='_blank' style='text-decoration:none;'>用户详情</a><br/>\
                                                                <span class='vplusBTN-unblock' key='"+ data.id +","+ data.username +"'>解除屏蔽</span>\
                                                            </td>\
                                                        </tr>\
                                                    </tbody>\
                                                </table>");
                    }else{
                        $('#blockList').append("<table><td>ID为 "+ block_list[i] +" 的用户似乎已经找不到，有可能是本次查询出错或查询次数超出限制或该用户已经被删除。</td></table>");
                    }

                }else{
                    $('#blockList').append("<table><td>ID为 "+ block_list[i] +" 的用户查询出错，很有可能是网络问题，请稍后再试。</td></table>");
                }
            });
        }
    }else{
        $('#blockList').append("<table><td>当前账号无任何屏蔽用户，请检查是否登录了正确的账号。</td></table>");
    }

    $(document).on("click", ".vplusBTN-unblock", function(){
        var _this = $(this);
        var id_name = _this.attr('key').split(',');
        if (userCreated){
            unblock(_this, id_name[1], id_name[0], userCreated);
        }else{
            $.get('https://www.v2ex.com/api/members/show.json?username='+username, function(data, status){
                if(status == 'success'){
                    userCreated = data.created;
                    unblock(_this, id_name[1], id_name[0], userCreated);
                }else{
                    alert('可能是网络原因获取用户 created 参数失败，请重试。');
                }
            });
        }
    });

    $('.vplusBTN-refresh').click(function(){
        chrome.runtime.sendMessage({get_blockList: 't'}, function(response) {
            window.close();
        });
    });

});