/*
* @Author: Administrator
* @Date:   2018-06-05 11:41:08
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-08 16:16:06
*/
import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
export function getSingerList(){
    const url="https://c.y.qq.com/v8/fcg-bin/v8.fcg"
    const data=Object.assign({},commonParams,{
        channel:'singer',
        page:'list',
        key:'all_all_all',
        pagesize:100,
        pagenum:1,
        hostUin:0,
        needNewCode:0,
        platform:'yqq',
    })
    return jsonp(url,data,options)
}
export function getSingerDetail(singId){
    const url="https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg"
    const data=Object.assign({},commonParams,{
        g_tk:189525949,
        hostUin:0,
        platform:'yqq',
        needNewCode:0,
        order:'listen',
        begin:0,
        num:100,
        songstatus:1,
        singermid:singId
    })
    return jsonp(url,data,options)
}