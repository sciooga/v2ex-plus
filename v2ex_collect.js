chrome.runtime.sendMessage({action: "get_collectList"}, function(response) {
    var _cachedReplyCountList = response.cached
    _cachedReplyCountList = _cachedReplyCountList ? JSON.parse(_cachedReplyCountList) : {}
    
    var _latestReplyCountList = response.latest
    _latestReplyCountList = _latestReplyCountList ? JSON.parse(_latestReplyCountList) : {}
    
    var _replyCountEl = $('.count_livid,.count_orange')
    var topicList = {}
    
    for (var _replayCountIndex = 0; _replayCountIndex < _replyCountEl.length; _replayCountIndex++){
        var _topicId = Number(_replyCountEl[_replayCountIndex].href.match(/\/t\/(\d+)/)[1])
    
        if (_cachedReplyCountList[_topicId] !== _latestReplyCountList[_topicId]){
            $(_replyCountEl[_replayCountIndex]).attr('class', 'count_orange');
        }

        topicList[_topicId] = Number(_replyCountEl[_replayCountIndex].innerText)
    }
    
    var _clearAll = $('<a href="#">全部标为已读</a>')
    _clearAll.on('click', function(event){
        event.preventDefault()
        chrome.runtime.sendMessage({action: "clear_collect", list: JSON.stringify(topicList)}, function() {
            location.reload()
        })
    })
    $('.header .fr .snow').html('&nbsp;' + $('.header .fr .snow').html())
    $('.header .fr').prepend(_clearAll)
})