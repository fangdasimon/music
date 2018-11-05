/*
* @Author: Administrator
* @Date:   2018-06-17 10:36:05
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-23 22:31:06
*/
//导入的方式进行数据共享 不过mixin里的钩子先于组件的钩子 数据methods冲突时组件优先
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
export const playlistMixin={
    computed:{
        ...mapGetters([
            'playList'
        ])
    },
    watch:{
        playList(newVal){
            this.handlePlaylist(newVal)
        }
    },
    mounted(){
        this.handlePlaylist(this.playList)
    },
    activated(){
        this.handlePlaylist(this.playList)
    },
    methods:{
        handlePlaylist(){//避免mini播放器存在的时候scroll底部被遮住
         throw new Error('component must implement handlePlaylist method')
        },
        ...mapActions([
            'saveFavoriteHistory'
        ])
    }
}

export const playModeMixin={
    computed:{
        ...mapGetters([
            'playList',
            'sequenceList',
            'currentSong',
            'mode',
            'favoriteList'
        ]),
        iconMode(){
            return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
        },
        FavoriteIcon(){
            return this.getFavoriteIcon(this.currentSong)
        }
    },
    methods:{
        changeMode(){
            const mode=(this.mode+1)%3
            this.setPlayMode(mode)//第三次才改变playlist
            let list=null
            if(mode===playMode.random){
                list=shuffle(this.sequenceList)
            }else{
                list=this.sequenceList
            }
            this.resetCurrentIndex(list)//切换的时候因为下标的改变 会触发watch
            this.setPlayList(list)
        },
        resetCurrentIndex(list){//切换模式的时候保持当前的歌曲不变
            let index=list.findIndex((item)=>{
                return item.id===this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        getFavoriteIcon(song){
            if(this.isFavorite(song)){
                return 'icon-favorite'
            }else{
                return 'icon-not-favorite'
            }
        },
        toggleFavorite(){
            if(this.isFavorite(this.currentSong)) {
                this.deleteFavoriteHistory(this.currentSong)
            }else{
                this.saveFavoriteHistory(this.currentSong)
            }
        },
        isFavorite(song){
            let index=this.favoriteList.findIndex((item)=>{
                return song.id === item.id
            })
            return index > -1
        },
        ...mapMutations({
            setCurrentIndex:'SET_CURRENT_INDEX',
            setPlayMode:'SET_PLAY_MODE',
            setPlayList:'SET_PLAYLIST'
        }),
        ...mapActions([
            'saveFavoriteHistory',
            'deleteFavoriteHistory'
        ])
    }
}

export const searchMixin={
    data(){
        return{
            query:''
        }
    },
    computed:{
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods:{
        searchKey(item){//父组件调用子组件方法发送消息 子组件this.$emit通知父组件 
            this.$refs.searchBox.setSearchKey(item)
        },
        queryChange(newQuery){
            this.query=newQuery
        },
        beforeScroll(){
            this.$refs.searchBox.blurInput()
        },
        saveSearch(){
        //提交搜索关键字 保存到本地存储 state从本地获取新数据(actions 提交mutation)
            this.saveSearchHistory(this.query)
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory'
        ])  
    }
}