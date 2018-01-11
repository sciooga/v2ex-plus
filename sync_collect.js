chrome.runtime.sendMessage({action: "get_collectList"}, function(response) {
    var _topicId = Number(document.location.href.match(/\/t\/(\d+)/)[1]);
    
    var _cachedReplyCountList = response.cached;
    _cachedReplyCountList = _cachedReplyCountList ? JSON.parse(_cachedReplyCountList) : {};
    
    var _latestReplyCountList = response.latest;
    _latestReplyCountList = _latestReplyCountList ? JSON.parse(_latestReplyCountList) : {};
    
    if (_cachedReplyCountList[_topicId] !== undefined){
        var replayCountEl = $(".box .cell .gray");
        var replayCount = Number(replayCountEl[0].innerText.match(/(\d+) 回复/)[1]);
        var shouldSync = false;
    
        if (replayCount !== _cachedReplyCountList[_topicId]){
            _cachedReplyCountList[_topicId] = replayCount;
            shouldSync = true;
        }
    
        if (replayCount !== _latestReplyCountList[_topicId]){
            _latestReplyCountList[_topicId] = replayCount;
            shouldSync = true;
        }
    
        if (shouldSync){
            chrome.runtime.sendMessage({action: "sync_collect", cached: JSON.stringify(_cachedReplyCountList), latest: JSON.stringify(_latestReplyCountList)});
        }
    }
});