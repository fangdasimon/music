/*
* @Author: Administrator
* @Date:   2018-06-18 18:28:09
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-19 15:20:04
*/
import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'

const debug=process.env.NODE_ENV !== 'production'
// const debug = true


export function gethotkey(){
    const url="https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg"
    const data=Object.assign({},commonParams,{
        platform: 'h5',
        needNewCode: 1
    })
    return jsonp(url,data,options)
}
export function search(query,page,zhida,perpage) {
    // const url="https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp"
    // 如果不代理到9000端口会有跨域问题
    const url = debug ? '/api/search' : 'http://www.damonstore.cn/music/api/search'
    const data=Object.assign({},commonParams,{
        w:query,
        p:page,
        catZhida:zhida?1:0,
        perpage,
        n: perpage,
        zhidaqu:1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        remoteplace: 'txt.mqq.all',
        platform: 'h5',
        needNewCode: 1,
        format: 'json'
    })
    
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}