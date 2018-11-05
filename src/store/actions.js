
//支持异步操作 提交多个mutation事件类型进行数据修改
//不使用辅助函数直接派发修改状态this.$store.dispatch('selectPlay')
//使用辅助函数在methods里先映射 然后派发修改状态this.selectPlay()
//可以异步操作
//执行完异步操作再提交mutation 这样就可以保证每执行完一个mutation都可以对应到一个新的状态
//在mutation里执行异步操作进行数据变更是无法实时跟踪他的状态 
//因为异步回调中进行的状态变更是不可追踪的
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/cache'

function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id===song.id
    })
}
//一次所有的歌曲都插入列表(播放列表 顺序列表)
export const selectPlay=function({commit,state},{list,index}) {
    if(state.mode===playMode.random){//可以不用判断？？
        let randomList=shuffle(list)
        commit(types.SET_PLAYLIST,randomList)
        index=findIndex(randomList,list[index])
    }else{
        commit(types.SET_PLAYLIST,list)
    }
    commit(types.SET_SEQUENCELSIT,list)
    // commit(types.SET_PLAYLIST,list)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PALYING,true)
}
export const randomPlay=function({commit,state},{list}){
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCELSIT,list)
    let randomList=shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PALYING,true)
}

//一条一条歌曲的插入列表(播放列表 顺序列表)
export const insertSong=function({commit,state},song){
    let playList=state.playList.slice() //数据的修改只能在mutation里面 利用副本操作
    let sequenceList=state.sequenceList.slice()
    let currentIndex=state.currentIndex

    let currentSong=playList[currentIndex]
    let fpIndex=findIndex(playList,song)//如果有这首歌 返回这首歌曲在列表中的位置
    currentIndex++
    playList.splice(currentIndex,0,song)//无论列表里有没有先插入在当前播放歌曲的后面

    if(fpIndex > -1) {//有这首歌
        if(currentIndex > fpIndex) {//这首歌曲在列表中的位置 在当前播放歌曲的前面
            playList.splice(fpIndex,1)
            currentIndex--
        }else{
            playList.splice(fpIndex+1,1)
        }
    }

    let currentSIndex=findIndex(sequenceList,currentSong)+1//插入歌曲的位置
    let fsIndex=findIndex(sequenceList,song)

    sequenceList.splice(currentSIndex,0,song)
    if(fsIndex > -1) {
        if(currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex,1)
            currentSIndex--
        }else{
            sequenceList.splice(fsIndex+1,1)
        }
    }

    commit(types.SET_PLAYLIST,playList)
    commit(types.SET_SEQUENCELSIT,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PALYING,true)
}
//state数据源关联了saveSearch(获取本地存储) 返回的数组(数据源改变) -->而 
//修改数据源的操作只能是mutation 异步操作获取数据要在actions里面
export const saveSearchHistory=function({commit},query) {
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

export const deleteSearchHistory=function({commit},query) {
    commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}

export const clearSearchHistory=function({commit}) {
    commit(types.SET_SEARCH_HISTORY,clearSearch())
}

export const deleteSong=function({commit,state},song) {
    let playList=state.playList.slice()
    let sequenceList=state.sequenceList.slice()
    let currentIndex=state.currentIndex

    let fpIndex=findIndex(playList,song)
    playList.splice(fpIndex,1)
    let fsIndex=findIndex(sequenceList,song)
    sequenceList.splice(fsIndex,1)
                            //当前播放歌曲为最后一首刚好又删掉了 歌曲往前放
    if(currentIndex > fpIndex || currentIndex === playList.length) {
        currentIndex--
    }

    commit(types.SET_PLAYLIST,playList)
    commit(types.SET_SEQUENCELSIT,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)

    if(!playList.length) {
        commit(types.SET_PALYING,false)
    }
}

export const deleteAll=function({commit}) {
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_SEQUENCELSIT,[])
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PALYING,false)
}

export const savePlayHistory=function({commit},song) {
    commit(types.SET_PLAY_HISTORY,savePlay(song))
}

export const saveFavoriteHistory=function({commit},song) {
    console.log(song)
    commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

export const deleteFavoriteHistory=function({commit},song) {
    commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}

