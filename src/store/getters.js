
//映射数据源到局部组件  从store中的state中派生出一些状态进行过滤 计算
//不使用辅助函数直接获取状态this.$store.getters.singer
//使用辅助函数在computed对象里先映射 然后获取状态this.singer

import Song from 'common/js/song'

export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {//过滤
    return state.playList[state.currentIndex] || {}
}

export const disc = state => state.disc

export const toplist = state => state.toplist

export const searchHistory = state => state.searchHistory

// export const playHistory = state => state.playHistory
export const playHistory = (state) => {
    return state.playHistory.map((song) => {
        return new Song(song)
    })
}

// export const favoriteList = state => state.favoriteList

export const favoriteList = (state) => {
    return state.favoriteList.map((song) => {
        return new Song(song)
    })
}
