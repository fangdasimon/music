/*
* @Author: Administrator
* @Date:   2018-06-18 11:09:56
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-18 14:47:43
*/
import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'

export function getToplist(){
    const url="https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg"
    const data=Object.assign({},commonParams,{
        platform:'h5',
        needNewCode:1
    })
    return jsonp(url,data,options)
}

export function getMusiclist(topid){
    const url="https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg"
    const data=Object.assign({},commonParams,{
        platform:'h5',
        needNewCode:1,
        tpl:3,
        page:'detail',
        type:'top',
        topid
    })
    return jsonp(url,data,options)
}