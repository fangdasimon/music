/*
* @Author: Administrator
* @Date:   2018-06-12 17:07:14
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-29 23:19:59
*/
import { commonParams, options } from './config'
import jsonp from 'common/js/jsonp'
import { getUid } from 'common/js/uid'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export function getLyric(mid) {
  const url = debug ? '/api/lyric' : 'http://www.damonstore.cn/music/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongsUrl(songs) {
  const url = debug ? '/api/getPurlUrl' : 'http://www.damonstore.cn/music/api/getPurlUrl'

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)//每一首歌曲的id放到一个数组里面,一次请求获取多个vkey
    types.push(0)
  })

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return axios.post(url, {
    comm: data,
    url_mid: genUrlMid(mids, types)//一次请求获取多个vkey
  }).then((res) => {
    return Promise.resolve(res.data)
  })
  
}

function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: "CgiGetVkey",
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}