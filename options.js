function saveChoice(e){
    setCookie(this.name, this.value);
};

window.onload = function(){

    var _newMsg = document.newMsgSelect.newMsg;
    _newMsg[0].disabled= false;
    _newMsg[1].disabled= false;
    !getCookie('newMsg') && (_newMsg[0].checked = true) || (_newMsg[1].checked = true);
    _newMsg[0].onclick = saveChoice;
    _newMsg[1].onclick = saveChoice

    var _imageHosting = document.imageHostingSelect.imageHosting;
    _imageHosting[0].disabled= false;
    _imageHosting[1].disabled= false;
    getCookie('imageHosting') != 'imgur' && (_imageHosting[0].checked = true) || (_imageHosting[1].checked = true);
    _imageHosting[0].onclick = saveChoice;
    _imageHosting[1].onclick = saveChoice;

    var _autoMission = document.autoMissionSelect.autoMission;
    _autoMission[0].disabled= false;
    _autoMission[1].disabled= false;
    getCookie('autoMission') && (_autoMission[0].checked = true) || (_autoMission[1].checked = true);
    _autoMission[0].onclick = saveChoice;
    _autoMission[1].onclick = saveChoice
}