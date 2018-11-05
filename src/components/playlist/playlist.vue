<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="iconMode" @click="changeMode"></i>
                        <span class="text">{{modeText}}</span>
                        <span class="clear" @click="clearAll">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                </div>
                <scroll ref="listContent" :data="sequenceList" class="list-content">
                    <transition-group tag="ul" name="list" ref="list">
                        <li :key="item.id" @click="selectItem(item,index)" class="item" v-for="(item,index) in sequenceList"> 
                            <i class="current" :class="currentIcon(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span class="like">
                                <i class="icon-not-favorite"></i>
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add" @click="addSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <add-song ref="addSong"></add-song>
            <confirm ref="confirm" @confirm="confirm" text="是否要删除歌曲列表" confirmBtnText="删除"></confirm>
        </div>
    </transition>
</template>
<script>
import {mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import scroll from 'base/scroll/scroll'
import confirm from 'base/confirm/confirm'
import addSong from 'components/add-song/add-song'
import {playModeMixin} from 'common/js/mixin'
    export default{
        mixins:[playModeMixin],
        data(){
            return{
                showFlag:false
            }
        },
        components:{scroll,confirm,addSong},
        computed:{
            modeText(){
                return this.mode===playMode.sequence?'顺序播发':this.mode===playMode.random?'随机播发':'单曲循环'
            }
        },
        watch:{
            currentSong(newSong,oldSong){
                if(!newSong.id) return //解决最后一首歌删除了还可播放
                if(newSong.id === oldSong.id) return
                this.scrollToCurrent(newSong)
                this.setplaying(true) //播放歌曲
            },
            playList(){
            //解决方法 列表为空时showFlag置false 弹出问题可以解决
                if(!this.playList.length){
                    this.hide()
                }
            }
        },
        methods:{
            // 最后一个歌曲被删除了后 列表会自动隐藏在马上点击一个歌曲是又马上会显示
            // 隐藏的原因是playlist为空时 player页面不会显示导致playlist消失 而马上点击
            // 一个歌曲又马上弹出list表是因为 隐藏的时候showFlag还是true
            toggleShow(){
                this.showFlag=!this.showFlag
                if(this.showFlag){
                    setTimeout(()=>{//showFlag控制playlist的dom 滚动子元素需要刷新
                        this.$refs.listContent.refresh()
                    },20)
                }
            },
            hide(){
                this.showFlag=false
            },
            currentIcon(item){
                if(this.currentSong.id === item.id) {
                    return 'icon-play'
                }else {
                    return ''
                }
            },
            selectItem(item,index){
                if(this.mode === playMode.random) {
                    //playlist 不是sequenceList模式切换sequence失效
                    index=this.playList.findIndex((song)=>{ 
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index)//点击搜索列表切换歌曲播放
                this.setplaying(true)  //改变成播放状态 避免在暂停状态切换停留暂停状态
            },
            scrollToCurrent(current){
                let index=this.sequenceList.findIndex((item)=>{
                    return item.id === current.id
                })
                // 歌曲和li一样多 也就是ul的index和当前播发歌曲在列表的index相同
                let dom=this.$refs.list.$el.children[index] //transition-group是一个组件
                this.$refs.listContent.scrollToElement(dom,300)
            },
            deleteOne(item){
                this.deleteSong(item)
            },
            clearAll(){
                this.$refs.confirm.show()
            },
            confirm(){
                this.deleteAll()
            },
            addSong(){
                this.$refs.addSong.show()
            },
            ...mapActions([
                'deleteSong',
                'deleteAll'
            ]),
            ...mapMutations({
                setplaying:'SET_PALYING'
            })
        }
    }
</script>
<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
    .playlist
        position fixed
        left 0px
        right 0px
        top 0px
        bottom 0px
        background $color-background-d
        &.list-fade-enter-active,&.list-fade-leave-active
            transition opacity 0.3s
            .list-wrapper
                transition all 0.3s
        &.list-fade-enter,&.list-fade-leave-to
            opacity 0
            .list-wrapper
                transform translate3d(0,100%,0) //不是负数吗 最后状态消失 下拉
        &.list-fade-enter
        .list-wrapper
            position absolute
            left 0px
            bottom 0px
            width 100%
            background $color-highlight-background
            .list-header
                position relative
                padding 20px 30px 10px 20px
                .title
                    display flex 
                    align-items center
                    .icon
                        margin-right 10px
                        font-size 30px
                        color $color-theme-d
                    .text
                        flex 1
                        font-size $font-size-medium
                        color $color-text-l
                    .clear
                        extend-click()
                        .icon-clear
                            font-size $font-size-d    
                            color $color-text-d
            .list-content
                max-height 240px
                overflow hidden
                .item
                    display flex
                    align-items center
                    height 40px
                    padding 0 30px 0 20px
                    overflow hidden
                    &.list-enter-active,&.list-leave-active
                        transition all 0.1s
                    &.list-enter,&.list-leave-to
                        height 0
                    .current
                        flex 0 0 20px
                        width 20px
                        font-size $font-size-small
                        color $color-theme-d
                    .text
                        flex 1
                        no-wrap()
                        font-size $font-size-medium
                        color $color-text-d
                    .like
                        extend-click()
                        margin-right 15px
                        font-size $font-size-small
                        color $color-theme
                        .icon-favorite
                            color $color-sub-theme
                    .delete
                        extend-click()
                        font-size $font-size-small
                        color $color-theme
            .list-operate
                width 140px
                margin 20px auto 30px auto
                .add
                    display flex
                    align-items center
                    padding 8px 16px
                    border 1px solid $color-text-l
                    border-radius 100px
                    color $color-text-l
                    .icon-add
                        font-size $font-size-small-s
                    .text
                        font-size $font-size-small
            .list-close
                text-align center
                line-height 50px
                background $color-background
                font-size $font-size-medium-x
                color $color-text-l


</style>