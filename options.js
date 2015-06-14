function setImageHosting( e ){
    setCookie('imageHosting', e.target.value);
};

window.onload = function(){
    var _imageHosting = document.imageHostings.imageHosting;
    _imageHosting[0].disabled= false;
    _imageHosting[1].disabled= false;
    getCookie('imageHosting') == 'imgur' && (_imageHosting[1].checked = true) || (_imageHosting[0].checked = true);
    _imageHosting[0].onclick = setImageHosting;
    _imageHosting[1].onclick = setImageHosting;
}