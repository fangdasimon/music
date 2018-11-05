<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop> 
            <div class="header">
                <h1 class="title">添加歌曲到列表</h1>
                <div class="close" @click="hide">
                    <i class="icon-close"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
                <search-box ref="searchBox" @query="queryChange" placeholder="搜索歌曲"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
                <switches :switches="switches" :currentIndex="currentIndex" @switchItem="switchItem"></switches>
                <div class="list-wrapper">
                    <scroll ref="songList" class="list-scroll" v-if="currentIndex===0" :data="playHistory">
                        <div class="list-inner">
                            <song-list :songs="playHistory" @select="selectSong"></song-list>
                        </div>
                    </scroll>
                    <scroll ref="searchList" class="list-scroll" v-if="currentIndex===1" :data="searchHistory">
                        <div class="list-inner">
                            <search-list @addQuery="searchKey" @deleteOne="deleteSearchHistory" :searches="searchHistory"></search-list>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                <suggest :query="query" @select="saveSearch" @beforeScroll="beforeScroll"></suggest>
            </div>
            <top-tip ref="topTip">
                <div class="tip-title">
                    <i class="icon-ok"></i>
                    <span class="text">{{title}}</span>
                </div>
            </top-tip>
        </div>
    </transition>
</template>
<script>
import searchBox from 'base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import switches from 'base/switches/switches'
import songList from 'base/song-list/song-list'
import searchList from 'base/search-list/search-list'
import topTip from 'base/top-tip/top-tip'
import scroll from 'base/scroll/scroll'
// import Song from 'common/js/song'
import {searchMixin} from 'common/js/mixin'
import {mapGetters,mapActions} from 'vuex'
    export default{
        mixins:[searchMixin],
        computed:{
            ...mapGetters([
                'playHistory',
                'searchHistory'
            ])
        },
        data(){
            return{
                showFlag:false,
                switches:[
                    {name:'最近播放'},
                    {name:'搜索历史'}
                ],
                currentIndex:0,
                title:'已添加一首歌曲到列表'
            }
        },
        components:{searchBox,suggest,switches,songList,searchList,scroll,topTip},
        methods:{
            show(){
                this.showFlag=true
                //父组件控制addSong的显示与隐藏 等addSong页面渲染完成后在刷新scroll
                setTimeout(()=>{
                    if(this.currentIndex === 0) {
                        this.$refs.songList.refresh()
                    }else{
                        this.$refs.searchList.refresh()
                    }
                },20)
            },
            hide(){
                this.showFlag=false
            },
            switchItem(index){
                this.currentIndex=index
            },
            selectSong(item,index){
               //item获取是歌曲相关的属性 一定要new一下这样歌词才会获取到不会报错
                if(index!==0){
                    // this.insertSong(new Song(item)) 
                    // 播放历史的歌曲获取的时候就是一个规范好的song不需要在处理了
                    this.insertSong(item)
                    this.showTip()
                }
            },
            showTip(){
                this.$refs.topTip.show()
            },
            ...mapActions([
                'insertSong'
            ])
        }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
    .add-song
        position fixed
        top 0px
        bottom 0px
        width 100%
        background $color-background
        &.slide-enter-active,&.slide-leave-active
            transition all 0.3s
        &.slide-enter,&.slide-leave-to
            transform translate3d(100%,0,0)
        .header
            position relative
            height 44px
            text-align center
            .title
                line-height 44px
                font-size $font-size-large
                color $color-text
            .close
                position absolute
                top 0
                right 8px
                .icon-close
                    display block
                    padding 12px
                    font-size 20px
                    color $color-theme
        .search-box-wrapper
            margin 20px
        .shortcut
            .list-wrapper
                position absolute
                top 165px
                bottom 0px
                width 100%
                .list-scroll
                    height 100%
                    overflow hidden
                    .list-inner
                        padding 20px 30px
        .search-result
            position fixed
            top 124px
            bottom 0px            
            width 100%
        .tip-title
            text-align center
            padding 18px 0
            font-size 0
            .icon-ok
                font-size $font-size-medium
                color $color-theme
                margin-right 4px
            .text
                font-size $font-size-medium
                color $color-text

                
</style>