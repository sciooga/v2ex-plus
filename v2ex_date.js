//————————————————显示主题发布日期————————————————
var gray = $(".header .gray");
var grayText = gray.text();
chrome.storage.sync.get(function(response) {
    if(response.displayPostDate && grayText.indexOf("天前") > -1){
        var distance = parseInt(grayText.match(/[0-9]* 天前/g)[0]);
        var date=new Date();
        date.setDate(date.getDate()-distance);
        var month = date.getMonth() + 1;
    
        // 获取当前是几号
        var strDate = date.getDate();
    
        // 添加分隔符“-”
        var seperator = "-";
    
        // 对月份进行处理，1-9月在前面添加一个“0”
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
    
        // 对月份进行处理，1-9号在前面添加一个“0”
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
    
        // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
        var postDate = date.getFullYear() + seperator + month + seperator + strDate;

        //插入postDate
        grayText = grayText.replace(/ 天前 ·/," 天前(" + postDate + ") ·");
        gray.text(grayText);
    }
});
