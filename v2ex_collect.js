chrome.runtime.sendMessage({action: "get_collectList"}, function(response) {
    var _cachedReplyCountList = response.cached;
    _cachedReplyCountList = _cachedReplyCountList ? JSON.parse(_cachedReplyCountList) : {};
    
    var _latestReplyCountList = response.latest;
    _latestReplyCountList = _latestReplyCountList ? JSON.parse(_latestReplyCountList) : {};
    
    var topicList = {};
    var topicEl = $(".cell.item");
    
    for (var _topicIndex = 0; _topicIndex < topicEl.length; _topicIndex++){
        var _replyCountEl = $(topicEl[_topicIndex]).find(".count_livid,.count_orange");
        var _topicId = Number($(topicEl[_topicIndex]).find(".item_title a")[0].href.match(/\/t\/(\d+)/)[1]);
    
        if (_replyCountEl.length){
            if (_cachedReplyCountList[_topicId] !== _latestReplyCountList[_topicId]){
                $(_replyCountEl[0]).attr("class", "count_orange");
            }
    
            topicList[_topicId] = Number(_replyCountEl[0].innerText);
        }else{
            topicList[_topicId] = 0;
        }
    }
    
    var _clearAll = $("<a href=\"#\">全部标为已读</a>");
    _clearAll.on("click", function(event){
        event.preventDefault();
        chrome.runtime.sendMessage({action: "clear_collect", list: JSON.stringify(topicList)}, function() {
            location.reload();
        });
    });
    $(".header .fr .snow").html("&nbsp;" + $(".header .fr .snow").html());
    $(".header .fr").prepend(_clearAll);
});