/******************************************************************************************************
 * clipboard.js -- copy text to clipboard with Javascript
 * From: http://ourcodeworld.com/articles/read/143/how-to-copy-text-to-clipboard-with-javascript-easily
 * The script that on https://clipboardjs.com/ is not working correctly in firefox
 * Author: xhhjin
******************************************************************************************************/
/* exported setClipboardText */
function setClipboardText(text) {
    var id = "v2ex-custom-clipboard-textarea-hidden-id";
    var existsTextarea = document.getElementById(id);

    if (!existsTextarea) {
        var textarea = document.createElement("textarea");
        textarea.id = id;
        // Place in top-left corner of screen regardless of scroll position.
        textarea.style.position = "fixed";
        textarea.style.top = 0;
        textarea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textarea.style.width = "1px";
        textarea.style.height = "1px";

        // We don't need padding, reducing the size if it does flash render.
        textarea.style.padding = 0;

        // Clean up any borders.
        textarea.style.border = "none";
        textarea.style.outline = "none";
        textarea.style.boxShadow = "none";

        // Avoid flash of white box if rendered for any reason.
        textarea.style.background = "transparent";
        document.querySelector("body").appendChild(textarea);
        existsTextarea = document.getElementById(id);
    } 

    existsTextarea.value = text;
    existsTextarea.select();

    try {
        var status = document.execCommand("copy");
        if (!status) {
            //console.error('Cannot copy text');
            alert("复制失败！");
        } else {
            //console.log('The text is now on the clipboard: '+ text);
            alert("此楼层直链已经复制到剪切板中");
        }
    } catch (err) {
    //console.log('Unable to copy.');
        alert("复制出现错误！");
    }
}