
var img_list = Array();
//图片链接前后都要留有空格以免意外
img_list = {
                '爱心':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et00rm9p57j200k00k0rr.jpg ',
                '心碎':   ' http://ww2.sinaimg.cn/bmiddle/62e721e4gw1et00rn36zaj200k00k0sh.jpg ',
                '外星人': ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et00ro13drj200k00k0mr.jpg ',
                '恶魔':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et00rp0kksj200k00k0sh.jpg ',
                '悠闲':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et00rpwawuj200k00k3y9.jpg ',
                '吃惊':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et00rqvbn9j200k00k0sh.jpg ',
                '口罩':   ' http://ww2.sinaimg.cn/bmiddle/62e721e4gw1et00rrsmdrj200k00k3y9.jpg ',
                '瞪眼':   ' http://ww1.sinaimg.cn/bmiddle/62e721e4gw1et00rsrkrnj200k00k3y9.jpg ',
                '不屑':   ' http://ww2.sinaimg.cn/bmiddle/62e721e4gw1et00rujyz4j200k00k3y9.jpg ',
                '心虚':   ' http://ww2.sinaimg.cn/bmiddle/62e721e4gw1et01xm85d4j200k00k3y9.jpg ',
                '微笑':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et01xnegfmj200k00k3y9.jpg ',
                '笑脸':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et01xo2nj5j200k00k3y9.jpg ',
                '苦瓜脸': ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et01xp08c1j200k00k0sh.jpg ',
                '生气':   ' http://ww1.sinaimg.cn/bmiddle/62e721e4gw1et01xq5o54j200k00k0sh.jpg ',
                '鬼脸':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et01xr0ycxj200k00k3y9.jpg ',
                '花痴':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et01xs6j4aj200k00k3y9.jpg ',
                '害怕':   ' http://ww3.sinaimg.cn/bmiddle/62e721e4gw1et01xt493sj200k00k3y9.jpg ',
                '我汗':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et01xu1r3aj200k00k3y9.jpg ',
                '尴尬':   ' http://ww3.sinaimg.cn/bmiddle/62e721e4gw1et02cnd1vqj200k00k3y9.jpg ',
                '奸笑':   ' http://ww3.sinaimg.cn/bmiddle/62e721e4gw1et02cofvqxj200k00k3y9.jpg ',
                '忧郁':   ' http://ww1.sinaimg.cn/bmiddle/62e721e4gw1et02cpd7rcj200k00k3y9.jpg ',
                '呲牙':   ' http://ww1.sinaimg.cn/bmiddle/62e721e4gw1et02cqtj05j200k00k3y9.jpg ',
                '媚眼':   ' http://ww1.sinaimg.cn/bmiddle/62e721e4gw1et02crv7f5j200k00k0sh.jpg ',
                '难受':   ' http://ww1.sinaimg.cn/bmiddle/62e721e4gw1et02cstx6tj200k00k3y9.jpg ',
                '纠结':   ' http://ww3.sinaimg.cn/bmiddle/62e721e4gw1et02cue46kj200k00k3y9.jpg ',
                '瞌睡':   ' http://ww3.sinaimg.cn/bmiddle/62e721e4gw1et02cvg79dj200k00k3y9.jpg ',
                '吐舌':   ' http://ww2.sinaimg.cn/bmiddle/62e721e4gw1et02cwaky6j200k00k3y9.jpg ',
                '刺瞎':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et02eibk41j200k00k3y9.jpg ',
                '大哭':   ' http://ww1.sinaimg.cn/bmiddle/62e721e4gw1et02eja57cj200k00k3y9.jpg ',
                '激动':   ' http://ww3.sinaimg.cn/bmiddle/62e721e4gw1et02ek7u61j200k00k3y9.jpg ',
                '难过':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et02el6ev3j200k00k3y9.jpg ',
                '害羞':   ' http://ww1.sinaimg.cn/bmiddle/62e721e4gw1et02em3omaj200k00k3y9.jpg ',
                '大笑':   ' http://ww2.sinaimg.cn/bmiddle/62e721e4gw1et02en2kvkj200k00k3y9.jpg ',
                '愤怒':   ' http://ww2.sinaimg.cn/bmiddle/62e721e4gw1et02eo1b16j200k00k0sh.jpg ',
                '亲亲':   ' http://ww2.sinaimg.cn/bmiddle/62e721e4gw1et02eoymtjj200k00k3y9.jpg ',
                '飞吻':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et02eq4hnmj200k00k3y9.jpg ',
                '渴望':   ' http://ww2.sinaimg.cn/large/62e721e4gw1et47fjhc9dg200m00mjr9.gif ',
                '开心':   ' http://ww2.sinaimg.cn/large/62e721e4gw1et47k3zwnqg200m00m0sj.gif ',
                '挖鼻':   ' http://ww2.sinaimg.cn/large/62e721e4gw1et47itgo0hg200m00mglg.gif ',
                'doge':   ' http://ww4.sinaimg.cn/bmiddle/62e721e4gw1et02g5wksrj200k00k3y9.jpg ',
};

const emoticon = Object.keys(img_list);

const emoticon_1 = $('<ul>'),
      emoticon_2 = $('<ul>');

for (let i=1; i<=20; i++){
    emoticon_1.append(
        $('<li>').append(
            $('<img>', {
                src: chrome.extension.getURL("img/emoticon/"+i+".jpg"),
                alt: emoticon[i]
            })
        )
    );
}
for (let i=21; i<=40; i++){
    emoticon_2.append(
        $('<li>').append(
            $('<img>', {
                src: chrome.extension.getURL("img/emoticon/"+i+".jpg"),
                alt: emoticon[i]
            })
        )
    );
}

const emoticon_list = $('<div>', {class: 'emoticon', style: 'display: none;padding-top: 8px;'})
    .append(emoticon_1).append(emoticon_2);
