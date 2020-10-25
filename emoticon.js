//表情包
"use strict";

const img_list = {
    0: null,
    "爱心":   " https://i.v2ex.co/8oRV15Jy.png ",
    "心碎":   " https://i.v2ex.co/9n9Ya75P.png ",
    "外星人": " https://i.v2ex.co/j4r79fiI.png ",
    "恶魔":   " https://i.v2ex.co/x867Mwqp.png ",
    "悠闲":   " https://i.v2ex.co/wITAgO6V.png ",
    "吃惊":   " https://i.v2ex.co/0BiZ83YV.png ",
    "口罩":   " https://i.v2ex.co/946oH9ug.png ",
    "瞪眼":   " https://i.v2ex.co/J7slPvg5.png ",
    "不屑":   " https://i.v2ex.co/HQitjRsV.png ",
    "心虚":   " https://i.v2ex.co/6qkEmGZF.png ",
    "微笑":   " https://i.v2ex.co/VZ7jf9my.png ",
    "笑脸":   " https://i.v2ex.co/LEIWqZdu.png ",
    "苦瓜脸": " https://i.v2ex.co/yz4KxCP6.png ",
    "生气":   " https://i.v2ex.co/37nCwTP4.png ",
    "鬼脸":   " https://i.v2ex.co/sqToHiDZ.png ",
    "花痴":   " https://i.v2ex.co/9Ndn75sI.png ",
    "害怕":   " https://i.v2ex.co/ob562zBU.png ",
    "我汗":   " https://i.v2ex.co/FJ3A9q18.png ",
    "尴尬":   " https://i.v2ex.co/Thy5Oqk6.png ",
    "奸笑":   " https://i.v2ex.co/uN704852.png ",
    "忧郁":   " https://i.v2ex.co/o2nq1EN2.png ",
    "呲牙":   " https://i.v2ex.co/5Aap1iN6.png ",
    "媚眼":   " https://i.v2ex.co/88Qu418X.png ",
    "难受":   " https://i.v2ex.co/cX2ligJM.png ",
    "纠结":   " https://i.v2ex.co/0shfB89W.png ",
    "瞌睡":   " https://i.v2ex.co/6IBSQ8xv.png ",
    "吐舌":   " https://i.v2ex.co/9j4yR89H.png ",
    "刺瞎":   " https://i.v2ex.co/u7E0N0mV.png ",
    "大哭":   " https://i.v2ex.co/2rPV8B6J.png ",
    "激动":   " https://i.v2ex.co/9kZ3y873.png ",
    "难过":   " https://i.v2ex.co/ROBUTUW7.png ",
    "害羞":   " https://i.v2ex.co/MsV5eSJ5.png ",
    "大笑":   " https://i.v2ex.co/W979C9Ry.png ",
    "愤怒":   " https://i.v2ex.co/PeEcsF6x.png ",
    "亲亲":   " https://i.v2ex.co/qjH0raTX.png ",
    "飞吻":   " https://i.v2ex.co/7QYI6CMn.png ",
    "渴望":   " https://i.v2ex.co/BlBl22Ow.png ",
    "开心":   " https://i.v2ex.co/OJTA1nf8.png ",
    "挖鼻":   " https://i.v2ex.co/ni1vw0o2.png ",
    "doge":   " https://i.v2ex.co/504J5BO2.png ",
    "滑稽":   " https://i.v2ex.co/92IL9xOI.jpeg ",
    "斜眼笑": " https://i.v2ex.co/oJ951Htz.jpeg ",
};

const emoticon = Object.keys(img_list);

const emoticon_1 = $("<ul>"),
    emoticon_2 = $("<ul>");

for (let i=1; i<=21; i++){
    emoticon_1.append(
        $("<li>").append(
            $("<img>", {
                src: chrome.extension.getURL("img/emoticon/"+i+".jpg"),
                alt: emoticon[i]
            })
        )
    );
}
for (let i=22; i<=42; i++){
    emoticon_2.append(
        $("<li>").append(
            $("<img>", {
                src: chrome.extension.getURL("img/emoticon/"+i+".jpg"),
                alt: emoticon[i]
            })
        )
    );
}

// eslint-disable-next-line no-unused-vars
const emoticon_list = $("<div>", {class: "emoticon", style: "display: none;padding-top: 8px;"})
    .append(emoticon_1).append(emoticon_2);