/*
* @Author: Administrator
* @Date:   2018-06-12 17:19:55
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-12 17:21:46
*/
let _uid = ''

export function getUid() {
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    const t = (new Date).getUTCMilliseconds()
    _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
  }
  return _uid
}