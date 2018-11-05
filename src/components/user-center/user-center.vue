<template>
    <transition name="slide">
        <div class="user-center">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <div class="switches-wrapper">
                <switches @switchItem="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
            </div>
            <div class="play-btn" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
                    <div class="list-inner">
                        <song-list :songs="favoriteList" @select="selectSong"></song-list>
                    </div>
                </scroll>
                <scroll ref="searchList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
                    <div class="list-inner">
                        <song-list :songs="playHistory" @select="selectSong"></song-list>
                    </div>
                </scroll>
                <div class="no-result-wrapper" v-show="noResult">
                    <no-result :title="title"></no-result>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import switches from 'base/switches/switches'
import songList from 'base/song-list/song-list'
import scroll from 'base/scroll/scroll'
// import Song from 'common/js/song'
import noResult from 'base/no-result/no-result'
import {playlistMixin} from 'common/js/mixin'
import {mapGetters,mapActions} from 'vuex'
    export default{
        mixins:[playlistMixin],
        components:{switches,songList,scroll,noResult},
        data(){
            return{
                switches:[
                    {name:'我喜欢的'},
                    {name:'最近听的'}
                ],
                currentIndex:0
            }
        },
        computed:{
            noResult(){
                if(this.currentIndex===0){
                    return !this.favoriteList.length
                }else{
                    return !this.playHistory.length
                }
            },
            title(){
                if(this.currentIndex===0){
                    return '暂时没有收藏歌曲'
                }else{
                    return '你还没听过歌曲哦'
                }
            },
            ...mapGetters([
                'favoriteList',
                'playHistory'
            ])
        },
        methods:{
            handlePlaylist(playList){
                console.log(playList)
                let bottom=playList.length>0 ? '60px' : ''
                this.$refs.listWrapper.style.bottom=bottom
                this.$refs.favoriteList && this.$refs.favoriteList.refresh()
                this.$refs.searchList && this.$refs.searchList.refresh()
            },
            back(){
                this.$router.back()
            },
            switchItem(index){
                this.currentIndex=index
            },
            selectSong(item){
                //对于选中的歌曲是要放进本地缓存当中的而 歌曲的vkey又是
                //有期限的,所以在每次打开程序的时候都去重新获取一下缓存里的数据
                //vkey就会改变不会使用过期的vkey
                this.insertSong(item)
            },
            random(){
                let list=this.currentIndex===0?this.favoriteList:this.playHistory
                if(!list.length) return
                this.randomPlay({
                    list
                })
            },
            ...mapActions([
                'insertSong',
                'randomPlay'
            ])
        }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
    .user-center
        position fixed
        top 0px
        bottom 0px
        width 100%
        background $color-background
        &.slide-enter-active,&.slide-leave-active
            transition all 0.3s
        &.slide-enter,&.slide-leave-to
            transform translate3d(100%,0,0)
        .back
            position absolute
            top 0
            left 6px
            .icon-back
                display block
                padding 10px
                font-size $font-size-large-x
                color $color-theme
        .switches-wrapper
            margin 10px 0 30px 0
        .play-btn
            box-sizing border-box
            width 135px
            padding 7px 0
            margin 0 auto
            text-align center
            border 1px solid $color-text-l
            color $color-text-l
            border-radius 100px
            font-size 0
            .icon-play
                display inline-block
                vertical-align middle 
                margin-right 6px
                font-size $font-size-medium-x
            .text
                display inline-block
                vertical-align middle
                font-size $font-size-small
        .list-wrapper
            position absolute
            top 110px
            bottom 0px
            width 100%
            .list-scroll
                height 100%
                overflow hidden
                .list-inner
                    padding 20px 30px
        .no-result-wrapper
            position absolute
            width 100%
            top 50%
            transform translateY(-50%)
                
</style>