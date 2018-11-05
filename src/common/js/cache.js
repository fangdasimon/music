/*
* @Author: Administrator
* @Date:   2018-06-20 13:37:37
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-23 21:43:22
*/
import storage from 'good-storage'  //

const SEARCH_KEY='__search__' //设置存储的key在本地的可以避免同名冲突
const SEARCH_MAXLEN=15

const PLAY_KEY='__play__'
const PLAY_MAXLEN=200

const FAVORITE_KEY='__favorite__'
const FAVORITE_MAXLEN=200

function insertArray(arr,val,compare,maxLen) {
    let index=arr.findIndex(compare) //支持传入函数 进行比较查找
    if(index === 0) return
    if(index > 0) {//数组里存在搜索词
        arr.splice(index,1)
    }
    arr.unshift(val)
    if(maxLen && arr.length>maxLen) {
        arr.pop()
    }
}

function deleteFromArray(arr,compare) {
    let index=arr.findIndex(compare)
    if(index > -1) {
        arr.splice(index,1)
    }
}

export function saveSearch(query) {
    // if(!query) return []  不能在在这里判断否则一刷新 搜索列表也为空原先的搜索看不到
    let searches=storage.get(SEARCH_KEY,[])
    
    if(query){ //有值时在加入数组 在没有query的时候刷新页面值为null也会加入数组里
        insertArray(searches,query,(item)=>{
            return item === query
        },SEARCH_MAXLEN)
    }

    storage.set(SEARCH_KEY,searches)
    console.log(searches)
    return searches
}

export function loadSearch(query) {
    return storage.get(SEARCH_KEY,[])
}

export function deleteSearch(query){
    let searches=storage.get(SEARCH_KEY,[])
    deleteFromArray(searches,(item)=>{
        return item === query
    })
    storage.set(SEARCH_KEY,searches)
    return searches
}

export function clearSearch(){
    let searches=storage.get(SEARCH_KEY,[])
    storage.remove(SEARCH_KEY)
    return []  //需要返回[]不能写searches 因为storage.remove后的结果要从本地存储中拿
}

export function savePlay(song){
    let songs=storage.get(PLAY_KEY,[])
    console.log(song)
    insertArray(songs,song,(item)=>{//没有找到就往数组里加
        return song.id === item.id  //不能===他是一个对象
    },PLAY_MAXLEN)
    storage.set(PLAY_KEY,songs)
    return songs
}

export function loadPlay(){
    return storage.get(PLAY_KEY,[])
}

export function saveFavorite(song){
    let songs=storage.get(FAVORITE_KEY,[])
    insertArray(songs,song,(item)=>{
        return song.id === item.id
    },FAVORITE_MAXLEN)
    storage.set(FAVORITE_KEY,songs)
    return songs
}

export function loadFavorite(){
    return storage.get(FAVORITE_KEY,[])
}

export function deleteFavorite(song){
    let songs=storage.get(FAVORITE_KEY,[])
    deleteFromArray(songs,(item)=>{
        return song.id === item.id
    })
    storage.set(FAVORITE_KEY,songs)
    return songs
}

