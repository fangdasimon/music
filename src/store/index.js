/*
* @Author: Administrator
* @Date:   2018-06-08 10:35:58
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-09 10:52:17
*/
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,getters,state,mutations,
    strict:debug,//检测state的修改是否来源于mutation
    plugins:debug?[createLogger()]:[]//每次的mutation操作都会输出一些log到控制台
})