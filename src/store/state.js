/*
* @Author: Administrator
* @Date:   2018-06-08 10:37:29
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-23 21:58:58
*/
//定义数据源
import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'
const state = {
    singer:{},
    playing:false,
    fullScreen:false,
    playList:[],//播放列表前进后退 会跟着播放模式改变
    sequenceList:[],//歌曲列表 不变
    mode:playMode.sequence,
    currentIndex:-1,
    disc:{},//组件嵌套多层 数据传递用vuex统一管理(主页面-二级路由-muscilist-songlsit)
    toplist:[],//排行榜
    searchHistory:loadSearch(),
    playHistory:[],
    favoriteList:[]
}
export default state