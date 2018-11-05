import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

//每一次运行程序 都重新加载缓存里面的数据 避免vkey失效资源无法播放问题
import { SET_PLAY_HISTORY, SET_FAVORITE_LIST } from './store/mutation-types'
import { loadPlay, loadFavorite } from 'common/js/cache'
import { processSongsUrl } from 'common/js/song'

const historySongs = loadPlay()
processSongsUrl(historySongs).then((songs) => {
  store.commit(SET_PLAY_HISTORY, songs)
})

const favoriteSongs = loadFavorite()
processSongsUrl(favoriteSongs).then((songs) => {
  store.commit(SET_FAVORITE_LIST, songs)
})

Vue.use(VueLazyLoad,{//js引用加载img需要require
    loading:require('common/image/default.png')
})

import 'common/stylus/index.styl'
// import 'common/js/hack'

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//将状态从根组件注入到每一个子组件中 子组件能通过this.$store访问到
  render: h => h(App)
})
