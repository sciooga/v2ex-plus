"use strict";
const deleteBTN_img = chrome.extension.getURL("img/deleteBTN.jpg");

//插入图片
function input_img( input_img_base64, this_img_id ){
    $("#imgManage").append(
        $("<div>", {class:"imgId"+this_img_id}).append(
            $("<div>").append(
                $("<img>", {class:"imgPreview", src:input_img_base64, alt:"上传图片"})
            )
        ).append(
            $("<input>", {style: "text", onmouseover:"this.select();"})
        ).append(
            $("<img>",{class:"deleteBTN", src:deleteBTN_img, onclick:"$(\".imgId"+this_img_id+"\").remove();"})
        )
    );

    const img_base64 = input_img_base64.match("base64,(.*)")[1];
    chrome.runtime.sendMessage({img_base64: img_base64}, function(res) {
        const _img_preview = $(".imgId"+ this_img_id),
            _url_input = _img_preview.find("input");

        if (res.img_status !== "Failed")
            _img_preview.css({"background": "rgba(246, 246, 246, 0.5)","borderColor": "#A4FF94"});
        else
            alert("图片上传失败，可能是未登录微博/受 imgur 上传次数限制");
        _url_input.val(res.img_status);
    });
}

//————————————————初始化————————————————

$("body").append("<div id='imgFun'><div id='imgManage' class='box'>粘贴截图或<span id='imgUploadBtn' style='cursor: pointer;'>上传图片</span><input type='file' style='display:none;' id='imgUpload' accept='image/*' /></div><div id='imgFunBtn'>&emsp;<</div></div>");
const _imgFun = $("#imgFun");
const _imgFunBtn = $("#imgFunBtn");

//————————————————初始化————————————————

//————————————————弹出/收起图片管理————————————————

_imgFunBtn.click(function(){
    if (_imgFunBtn.text() === " >"){
        _imgFun.css("left", "6px");
        _imgFunBtn.text(" <");
    }else{
        _imgFun.css("left", "-200px");
        _imgFunBtn.text(" >");
    }
});

//————————————————弹出/收起图片管理————————————————

//————————————————粘贴图片上传————————————————

let img_id = 1;
//从剪切板上传
//只要粘贴就触发，不管在什么地方粘贴
document.onpaste = function(e) {
    for (let item of e.clipboardData.items) {
        if ( item.kind === "file" && /image\/\w+/.test(item.type) ) {
            _imgFunBtn.text() === " >" && _imgFunBtn.click();
            const imageFile = item.getAsFile();

            const fileReader = new FileReader();
            fileReader.onloadend = function() {
                input_img( this.result, img_id++ );
            };

            fileReader.readAsDataURL(imageFile);
            //阻止原有的粘贴事件以屏蔽文字
            e.preventDefault();
            //只黏贴一张图片
            break;
        }
    }
};

//————————————————粘贴图片上传————————————————

//————————————————选择图片上传————————————————
const _upload_img_btn = $("#imgUploadBtn");
const _imgUpload = $("#imgUpload");
_upload_img_btn.click(_imgUpload.click);

_imgUpload.change(function(e){
    const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
    if (files){
        const img_file = files[0];
        const reader = new FileReader();
        reader.onload = function() {
            input_img( this.result, img_id++ );
        };
        reader.readAsDataURL(img_file);
    }else{
        alert("出错了，获取不到文件。");
    }
});
//————————————————选择图片上传————————————————
