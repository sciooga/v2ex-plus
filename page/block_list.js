"use strict";
const hash = location.hash.split("="),
    block_list = hash[1].split(","),
    username = hash[0].substr(1);
let userCreated;

function unblock(target, name, id, created){
    if (confirm("确认要解除对 "+ name +" 的屏蔽？")){
        $.get("https://www.v2ex.com/unblock/"+id+"?t="+created, function(data, status){
            if(status == "success"){
                target.text("已经解除");
            }else{
                alert("可能是网络原因解除屏蔽失败，请手动到该用户详情页面确认解除。");
            }
        });
    }
}

$(function(){
    if (block_list == ""){
        $("#blockList").append("<table><td>当前账号无任何屏蔽用户，请检查是否登录了正确的账号。</td></table>");
        return;
    }

    for (let user_id of block_list ){
        $.get("https://www.v2ex.com/api/members/show.json?id="+user_id, function(data, status){
            if(status == "success"){
                if( data.status == "found"){
                    var created = new Date();
                    created.setTime(data.created*1000);
                    $("#blockList").append(
                        $("<table>").append(
                            $("<tbody>").append(
                                $("<tr>").append(
                                    $("<td>", {"style":"width:48px;"}).append(
                                        $("<img>", {"src":"https://"+data.avatar_large, "class":"avatar"})
                                    )
                                ).append(
                                    $("<td>", {"style":"width:230px; font-size:90%;"}).append(
                                        $("<td>")
                                            .text(data.username+" 第 "+data.id+" 号会员<br/>加入于 "+created.toLocaleDateString())
                                            .text().replace(/\n/, "<br/>")
                                    )
                                ).append(
                                    $("<td>").append(
                                        $("<a>", {"class":"vplusBTN", "href":data.url, "target":"_blank", "style":"text-decoration:none;"})
                                            .text("用户详情")
                                    ).append(
                                        $("<br/>")
                                    ).append(
                                        $("<span>", {"class":"vplusBTN-unblock","id":data.id, "name": data.username})
                                            .text("解除屏蔽")
                                    )
                                )
                            )
                        )
                    );
                }else{
                    $("#blockList").append(
                        $("<table>").append(
                            $("<td>").text(
                                "ID为 "+user_id+" 的用户似乎已经找不到，有可能是本次查询出错或查询次数超出限制或该用户已经被删除。"
                            )
                        )
                    );
                }

            }else{
                $("#blockList").append(
                    $("<table>").append(
                        $("<td>").text(
                            "ID为 "+user_id+" 的用户查询出错，很有可能是网络问题，请稍后再试。"
                        )
                    )
                );
            }
        });
    }

    $(document).on("click", ".vplusBTN-unblock", function(){
        var _this = $(this);
        if (_this.text() === "已经解除"){
            alert("已解除对该用户的屏蔽，无需重复操作！");
            return;
        }

        const id = _this.attr("id"),
            name = _this.attr("name");
        if (userCreated){
            unblock(_this, name, id, userCreated);
        }else{
            $.ajax({
                url: "https://www.v2ex.com/api/members/show.json?username="+username,
                dataType: "json",
                success: (data) => {
                    userCreated = data.created;
                    unblock(_this, name, id, userCreated);
                },
                error: () => {
                    alert("可能是网络原因获取用户 created 参数失败，请重试。");
                }
            });
        }
    });

    $(".vplusBTN-refresh").click(function(){
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.runtime.sendMessage({action: "get_blockList"}, function() {
                chrome.tabs.remove(tabs[0].id);
            });
        });
    });
});
