'use strict';
let img_list = Array();
//图片链接前后都要留有空格以免意外
img_list = {
                '爱心':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et00rm9p57j200k00k0rr.jpg ',
                '心碎':   ' https://ws2.sinaimg.cn/bmiddle/62e721e4gw1et00rn36zaj200k00k0sh.jpg ',
                '外星人': ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et00ro13drj200k00k0mr.jpg ',
                '恶魔':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et00rp0kksj200k00k0sh.jpg ',
                '悠闲':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et00rpwawuj200k00k3y9.jpg ',
                '吃惊':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et00rqvbn9j200k00k0sh.jpg ',
                '口罩':   ' https://ws2.sinaimg.cn/bmiddle/62e721e4gw1et00rrsmdrj200k00k3y9.jpg ',
                '瞪眼':   ' https://ws1.sinaimg.cn/bmiddle/62e721e4gw1et00rsrkrnj200k00k3y9.jpg ',
                '不屑':   ' https://ws2.sinaimg.cn/bmiddle/62e721e4gw1et00rujyz4j200k00k3y9.jpg ',
                '心虚':   ' https://ws2.sinaimg.cn/bmiddle/62e721e4gw1et01xm85d4j200k00k3y9.jpg ',
                '微笑':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et01xnegfmj200k00k3y9.jpg ',
                '笑脸':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et01xo2nj5j200k00k3y9.jpg ',
                '苦瓜脸': ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et01xp08c1j200k00k0sh.jpg ',
                '生气':   ' https://ws1.sinaimg.cn/bmiddle/62e721e4gw1et01xq5o54j200k00k0sh.jpg ',
                '鬼脸':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et01xr0ycxj200k00k3y9.jpg ',
                '花痴':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et01xs6j4aj200k00k3y9.jpg ',
                '害怕':   ' https://ws3.sinaimg.cn/bmiddle/62e721e4gw1et01xt493sj200k00k3y9.jpg ',
                '我汗':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et01xu1r3aj200k00k3y9.jpg ',
                '尴尬':   ' https://ws3.sinaimg.cn/bmiddle/62e721e4gw1et02cnd1vqj200k00k3y9.jpg ',
                '奸笑':   ' https://ws3.sinaimg.cn/bmiddle/62e721e4gw1et02cofvqxj200k00k3y9.jpg ',
                '忧郁':   ' https://ws1.sinaimg.cn/bmiddle/62e721e4gw1et02cpd7rcj200k00k3y9.jpg ',
                '呲牙':   ' https://ws1.sinaimg.cn/bmiddle/62e721e4gw1et02cqtj05j200k00k3y9.jpg ',
                '媚眼':   ' https://ws1.sinaimg.cn/bmiddle/62e721e4gw1et02crv7f5j200k00k0sh.jpg ',
                '难受':   ' https://ws1.sinaimg.cn/bmiddle/62e721e4gw1et02cstx6tj200k00k3y9.jpg ',
                '纠结':   ' https://ws3.sinaimg.cn/bmiddle/62e721e4gw1et02cue46kj200k00k3y9.jpg ',
                '瞌睡':   ' https://ws3.sinaimg.cn/bmiddle/62e721e4gw1et02cvg79dj200k00k3y9.jpg ',
                '吐舌':   ' https://ws2.sinaimg.cn/bmiddle/62e721e4gw1et02cwaky6j200k00k3y9.jpg ',
                '刺瞎':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et02eibk41j200k00k3y9.jpg ',
                '大哭':   ' https://ws1.sinaimg.cn/bmiddle/62e721e4gw1et02eja57cj200k00k3y9.jpg ',
                '激动':   ' https://ws3.sinaimg.cn/bmiddle/62e721e4gw1et02ek7u61j200k00k3y9.jpg ',
                '难过':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et02el6ev3j200k00k3y9.jpg ',
                '害羞':   ' https://ws1.sinaimg.cn/bmiddle/62e721e4gw1et02em3omaj200k00k3y9.jpg ',
                '大笑':   ' https://ws2.sinaimg.cn/bmiddle/62e721e4gw1et02en2kvkj200k00k3y9.jpg ',
                '愤怒':   ' https://ws2.sinaimg.cn/bmiddle/62e721e4gw1et02eo1b16j200k00k0sh.jpg ',
                '亲亲':   ' https://ws2.sinaimg.cn/bmiddle/62e721e4gw1et02eoymtjj200k00k3y9.jpg ',
                '飞吻':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et02eq4hnmj200k00k3y9.jpg ',
                '渴望':   ' https://ws2.sinaimg.cn/large/62e721e4gw1et47fjhc9dg200m00mjr9.gif ',
                '开心':   ' https://ws2.sinaimg.cn/large/62e721e4gw1et47k3zwnqg200m00m0sj.gif ',
                '挖鼻':   ' https://ws2.sinaimg.cn/large/62e721e4gw1et47itgo0hg200m00mglg.gif ',
                'doge':   ' https://ws4.sinaimg.cn/bmiddle/62e721e4gw1et02g5wksrj200k00k3y9.jpg ',
};

//表情包
let emoticon = [];
for (let i=1; i<=40; i++)
  emoticon.push(chrome.extension.getURL("img/emoticon/"+i+".jpg"));


const emoticon_list = "<div class = 'emoticon' style='display: none;padding-top: 8px;'>\
    <ul>\
        <li><img src=\""+ emoticon[0] +"\" alt='爱心' /></li>\
        <li><img src=\""+ emoticon[1] +"\" alt='心碎' /></li>\
        <li><img src=\""+ emoticon[2] +"\" alt='外星人' /></li>\
        <li><img src=\""+ emoticon[3] +"\" alt='恶魔' /></li>\
        <li><img src=\""+ emoticon[4] +"\" alt='悠闲' /></li>\
        <li><img src=\""+ emoticon[5] +"\" alt='吃惊' /></li>\
        <li><img src=\""+ emoticon[6] +"\" alt='口罩' /></li>\
        <li><img src=\""+ emoticon[7] +"\" alt='瞪眼' /></li>\
        <li><img src=\""+ emoticon[8] +"\" alt='不屑' /></li>\
        <li><img src=\""+ emoticon[9] +"\" alt='心虚' /></li>\
        <li><img src=\""+ emoticon[10] +"\" alt='微笑' /></li>\
        <li><img src=\""+ emoticon[11] +"\" alt='笑脸' /></li>\
        <li><img src=\""+ emoticon[12] +"\" alt='苦瓜脸' /></li>\
        <li><img src=\""+ emoticon[13] +"\" alt='生气' /></li>\
        <li><img src=\""+ emoticon[14] +"\" alt='鬼脸' /></li>\
        <li><img src=\""+ emoticon[15] +"\" alt='花痴' /></li>\
        <li><img src=\""+ emoticon[16] +"\" alt='害怕' /></li>\
        <li><img src=\""+ emoticon[17] +"\" alt='我汗' /></li>\
        <li><img src=\""+ emoticon[18] +"\" alt='尴尬' /></li>\
        <li><img src=\""+ emoticon[19] +"\" alt='奸笑' /></li>\
    </ul>\
    <ul>\
        <li><img src=\""+ emoticon[20] +"\" alt='忧郁' /></li>\
        <li><img src=\""+ emoticon[21] +"\" alt='呲牙' /></li>\
        <li><img src=\""+ emoticon[22] +"\" alt='媚眼' /></li>\
        <li><img src=\""+ emoticon[23] +"\" alt='难受' /></li>\
        <li><img src=\""+ emoticon[24] +"\" alt='纠结' /></li>\
        <li><img src=\""+ emoticon[25] +"\" alt='瞌睡' /></li>\
        <li><img src=\""+ emoticon[26] +"\" alt='吐舌' /></li>\
        <li><img src=\""+ emoticon[27] +"\" alt='刺瞎' /></li>\
        <li><img src=\""+ emoticon[28] +"\" alt='大哭' /></li>\
        <li><img src=\""+ emoticon[29] +"\" alt='激动' /></li>\
        <li><img src=\""+ emoticon[30] +"\" alt='难过' /></li>\
        <li><img src=\""+ emoticon[31] +"\" alt='害羞' /></li>\
        <li><img src=\""+ emoticon[32] +"\" alt='大笑' /></li>\
        <li><img src=\""+ emoticon[33] +"\" alt='愤怒' /></li>\
        <li><img src=\""+ emoticon[34] +"\" alt='亲亲' /></li>\
        <li><img src=\""+ emoticon[35] +"\" alt='飞吻' /></li>\
        <li><img src=\""+ emoticon[36] +"\" alt='渴望' /></li>\
        <li><img src=\""+ emoticon[37] +"\" alt='开心' /></li>\
        <li><img src=\""+ emoticon[38] +"\" alt='挖鼻' /></li>\
        <li><img src=\""+ emoticon[39] +"\" alt='doge' /></li>\
    </ul>\
</div>"