



function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

function parseJson(response) {
    return response.json()
}

function urlEncode (data) {
    let urlEncodedData = "";

    // 将对象类型的数据转换成URL字符串
    for(name in data) {
        urlEncodedData += name + "=" + data[name] + "&";
    }

    // 删除掉最后的"&"字符
    urlEncodedData = urlEncodedData.slice(0, -1);
    // 将URL字符串进行百分号编码(UTF-8)
    urlEncodedData = encodeURIComponent(urlEncodedData);
    // encodeURIComponent函数多编码了一些字符,我们需要还原.
    //
    urlEncodedData = urlEncodedData.replace('%20','+').replace('%3D','=');

    return urlEncodedData 
}

function getCookie(c_name)
{
    if (document.cookie.length>0)
        {
            let c_start=document.cookie.indexOf(c_name + "=")
            if (c_start!=-1)
                { 
                    c_start=c_start + c_name.length+1 
                    let c_end=document.cookie.indexOf(";",c_start)
                    if (c_end==-1) 
                        c_end=document.cookie.length
                        return unescape(document.cookie.substring(c_start,c_end))
                } 
        }
        return 
}



module.exports = {
    checkStatus, 
    parseJson,
    urlEncode,
    getCookie
}
