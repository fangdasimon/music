/*
* @Author: Administrator
* @Date:   2018-06-02 18:32:03
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-10 15:42:28
*/
export function addClass(ele,className){
    if(hasClass(ele,className)) return ;
    let newClass=ele.className.split(' ')//原来的class放进数组里面
    newClass.push(className)//在数组里面加入新的class
    ele.className=newClass.join(' ')//最后统一赋值给元素的class
}
export function hasClass(ele,className){
    let reg=new RegExp('(^|\\s+)'+className+'(\\s+|$)')
    return reg.test(ele.className)
}
export function getData(ele,name,val){
    const prefix="data-"
    var name=prefix+name
    if(val){
        return ele.setAttribute(name,val)
    }else{
        return ele.getAttribute(name)
    }
}
//js兼容css ①获取浏览器兼容的所有样式 ②遍历查找出使用的内核 ③处理要兼容的样式
let elementStyle=document.createElement('div').style

let vendor=(()=>{
    let transformNames={
        webkit:'webkitTransform',
        Moz:'mozTransform',
        O:'oTransform',
        ms:'msTransform',
        standard:'transform'
    }
    for(var key in transformNames){
        if(elementStyle[transformNames[key]]!==undefined){
            return key
        }
    }
    return false
})()

export function prefixStyle(style){
    if(vendor===false){
        return false
    }
    if(vendor==='standard'){
        return style
    }
    return vendor+style.charAt(0).toUpperCase()+style.substring(1)
}