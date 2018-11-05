/*
* @Author: Administrator
* @Date:   2018-06-02 16:13:50
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-29 23:19:53
*/
import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'
const debug = process.env.NODE_ENV !== 'production'

export function getRecommend(){
    const url="https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg"
    const data=Object.assign({},commonParams,{
        platform:'h5',
        uin:0,
        needNewCode:1
    })
    return jsonp(url,data,options)
}

export function getSongList(disstid){
    const url=debug ? '/api/getCdInfo' : 'http://www.damonstore.cn/music/api/getCdInfo'
    const data=Object.assign({},commonParams,{
        disstid,
        type:1,
        json:1,
        utf8:1,
        onlysong:0,
        platform:'yqq',
        hostUin:0,
        needNewCode:0
    })
    return axios.get(url,{params:data}).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export function getDiscList(){
    const url=debug ? "/api/getDiscList" : 'http://www.damonstore.cn/music/api/getDiscList'
    const data=Object.assign({},commonParams,{
        picmid:1,
        platform:'yqq',
        loginUin:0,
        hostUin:0,
        needNewCode:0,
        categoryId:10000000,
        sortId:5,
        sin:0,
        ein:29,
        format:'json',
        rnd:Math.random()
    })
    return axios.get(url,{params:data}).then((res)=>{
        return Promise.resolve(res.data)
    })
}