/*------Cookie save------*/
function setCookie(cookieName,value,expiresTime,path){
    expiresTime = expiresTime || "Thu, 01-Jan-2030 00:00:01 GMT";
    path = path || "/";
    document.cookie=cookieName+ "=" +encodeURIComponent(value)+ "; expires="+ expiresTime+ "; path="+path;
}
/*------Cookie save------*/


/*------Cookie read------*/
function getCookie(cookieName){
    if (document.cookie.length>0)
    {
        var n_start=document.cookie.indexOf(cookieName + "=");
        if (n_start!=-1){
            n_start=n_start + cookieName.length+1;
            var n_end=document.cookie.indexOf(";",n_start);
            if (n_end==-1) {
                n_end=document.cookie.length;
            }
            return decodeURIComponent(document.cookie.substring(n_start,n_end));
        }else{
            return "";
        }
    }else{
        return "";
    }
}
/*------Cookie read------*/
