/*
* @Author: Administrator
* @Date:   2018-06-02 15:43:05
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-05 12:46:43
*/
import orginaJSONP from 'jsonp'
export default function jsonp(url,data,option){
    //如果用url+=这种方式 左侧不要var定义 因为参数的url已经定义过了--》重定义
    var url=url+(url.indexOf('?')<0?'?':'&')+param(data)
    return new Promise((resolve,reject)=>{
        orginaJSONP(url,option,(err,data)=>{
            if(!err){
                resolve(data)
            }else{
                reject(err)
            }
        })
    })
} 

function param(data){
    // 遍历对象 获取value 加密value
    var url=''
    for(var k in data){
        var value=data[k]!==undefined?data[k]:''
        url+=`&${k}=${encodeURIComponent(value)}`
    }
    return url?url.substring(1):''//去掉第一个&符号
}