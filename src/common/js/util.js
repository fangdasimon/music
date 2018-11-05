/*
* @Author: Administrator
* @Date:   2018-06-14 12:07:58
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-25 14:25:10
*/
function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}
export function shuffle(arr){
    let _arr=arr.slice()//在拷贝的数组上操作 不破坏原有的数组 浅拷贝
    for (let i=0;i<_arr.length;i++){
        let j=getRandomInt(0,i)
        let t=_arr[i]
        _arr[i]=_arr[j]
        _arr[j]=t
    }
    return _arr
}

export function debounce(func,delay) {//截流函数 避免快速请求造成的浪费
    let timer
    return function(...args) {
        if(timer){
            clearTimeout(timer)
        }
        timer=setTimeout(()=>{
            func.apply(this,args)
        },delay)
    }
}

