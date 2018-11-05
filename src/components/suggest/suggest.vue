<template>
    <scroll class="suggest" :data="result" 
            :pullup="pullup" :beforeScroll="beforeScroll" @beforeScroll="listScroll" @scrollToEnd="searchMore" ref="suggest">
        <ul class="suggset-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
                <div class="icon">
                    <i :class="iconClass(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !result.length">
            <no-result title="抱歉，搜索不到歌曲"></no-result>
        </div>
    </scroll>
</template>
<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {createSong,isValidMusic,processSongsUrl} from 'common/js/song'
import Singer from 'common/js/singer'
import noResult from 'base/no-result/no-result'
import {mapActions,mapMutations} from 'vuex'//歌曲播放历史
    const TYPE_SINGER='singer'
    const perpage=20
    export default{//接收参数 拿到数据 更改数据结构 渲染
        props:{
            query:{
        //格式化数据 滚动 滚到底部派发事件 设置标志位判断加载(设置第一次加载默认数据) 
                type:String,default:''
            },
            showSinger:{//可以不传catsinger 始终是1无论是否有歌手
                type:Boolean,default:true
            }
        },
        data(){
            return{
                page:1,
                result:[],
                pullup:true,
                hasMore:true,
                beforeScroll:true
            }
        },
        components:{scroll,loading,noResult},
        watch:{
            query(newVal){
                this._search(newVal)
            }
        },
        methods:{
            _search(){//第一次加载
                this.hasMore=true
                this.page=1
                this.$refs.suggest.scrollTo(0,0)
                search(this.query,this.page,this.showSinger,perpage).then((res)=>{
                    if(res.code === ERR_OK){
                        this._formatResult(res.data).then((result)=>{
                            this.result=result
                        })
                        this._checkMore(res.data.song)
                    }
                })
            },
            searchMore(){
                if(!this.hasMore) return
                this.page++
                search(this.query,this.page,this.showSinger,perpage).then((res)=>{
                    if(res.code === ERR_OK) {
                        this._formatResult(res.data).then((result)=>{
                            this.result=this.result.concat(result)
                        })
                        this._checkMore(res.data.song)
                    }
                })
            },
            _checkMore(song){
                if(!song.length && (song.curnum+song.curpage*perpage)>=song.totalnum) {
                    this.hasMore=false
                }
            },
            _formatResult(item){
                let ret=[]
                if(item.zhida && item.zhida.singerid) {
                    ret.push({...item.zhida,...{type:TYPE_SINGER}})
                }
                return processSongsUrl(this._normalizeSongs(item.song.list)).then((result)=>{
                    ret=ret.concat(result)
                    return ret //成功时的回调
                })
                // ret=ret.concat(this._normalizeSongs(item.song.list)) 有歌手格式不对
            },
            _normalizeSongs(list){
                let ret=[]
                list.forEach((musicData)=>{
                    if(isValidMusic(musicData)){
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            },
            selectItem(item){
                if(item.type === TYPE_SINGER) {
                    const singer=new Singer({
                        id:item.singermid,
                        name:item.singername
                    })
                    console.log(singer)
                    this.$router.push({
                        path:`/search/${singer.id}`
                    })
            //点击的歌手要跟新数据源 不然singer没数据 没有id就会跳到singer页面
                    this.setSinger(singer)
                }else {
                    this.insertSong(item)
                }
                this.$emit('select')
            }, 
            refresh(){
                this.$refs.suggest.refresh()
            },
            listScroll(){
                this.$emit('beforeScroll')
            },
            iconClass(item){
                if(item.type === TYPE_SINGER) {
                    return 'icon-mine'
                }else{
                    return 'icon-music'
                }
            },
            getDisplayName(item){
                if(item.type === TYPE_SINGER) {
                    return item.singername
                }else{
                    return `${item.name}-${item.singer}`
                }
            },
            ...mapMutations({
                setSinger:'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ])
        }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
    .suggest
        height 100%
        overflow hidden
        .suggset-list
            padding 0 30px
            .suggest-item
                display flex 
                align-items center
                padding-bottom 20px
            .icon
                flex 0 0 30px
                width 30px
                [class^="icon-"]
                    font-size 14px
                    color $color-text-d
            .name
                flex 1
                font-size $font-size-medium
                color $color-text-d
                overflow hidden
                .text
                    no-wrap()
    .no-result-wrapper
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>