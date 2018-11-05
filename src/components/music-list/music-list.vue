
<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgImg" ref="bgImage">
            <div class="filter"></div><!-- 图像遮罩 -->
            <div class="play-wrapper" @click="random" ref="play" v-show="songs.length">
                <div class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放列表</span>
                </div>
            </div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll @scroll="scroll" :probeType="probeType" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
import scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
    const RESERVE_HEIGHT=40 
    const transform=prefixStyle('transform')//js兼容css
    const backdrop=prefixStyle('backdrop-filter')
    export default{
        mixins:[playlistMixin],//组件插入mixin
        props:{
            title:{type:String,default:''},
            bgImage:{type:String,default:''},
            songs:{type:Array,default:[]},
            rank:{type:Boolean,default:false}
        },
        components:{scroll,songList,loading},
        mounted(){
            // 在组件上进行ref引用获取的是vue组件对象 需要$el转化一下 
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.maxTranslateY = -this.imageHeight+RESERVE_HEIGHT
            this.$refs.list.$el.style.top = this.imageHeight+'px'
        },
        data(){
            return{
                scrollY:0
            }
        },
        watch:{//watch里的值要在data或props里定义
            scrollY(newY){
                // console.log(newY)
                let scale=1
                let zIndex = 0
                let blur=0
                let translateY=Math.max(this.maxTranslateY,newY)
                let percent=Math.abs(newY/this.imageHeight)

                if(newY>0){//下拉图片缩放条件
                    scale=1+percent
                    zIndex=1
                }else{
                    blur=Math.min(20*percent,20)//ios手机下的高斯模糊
                }
                this.$refs.bgImage.style[backdrop] =`${blur}px`
                if(newY<this.maxTranslateY){//上滚到预留高度变换样式
                    zIndex = 1
                    this.$refs.bgImage.style.paddingTop=0
                    this.$refs.bgImage.style.height =`${RESERVE_HEIGHT}px`
                    this.$refs.play.style.display ='none'
                }else{
                    //长宽比10:7
                    this.$refs.bgImage.style.paddingTop='70%'
                    this.$refs.bgImage.style.height =0
                    this.$refs.play.style.display =''
                }
                this.$refs.bgImage.style.zIndex=zIndex
                //遮罩随着list滚动
                this.$refs.layer.style[transform]=`translate3d(0,${translateY}px,0)`
                this.$refs.bgImage.style[transform]=`scale(${scale})`
            }
        },
        methods:{
            handlePlaylist(playList){
                const bottom=playList.length>0 ? '60px' : ''
                this.$refs.list.$el.style.bottom=bottom
                this.$refs.list.refresh()
            },
            scroll(pos){
                this.scrollY=pos.y
            },
            back(){
                this.$router.back()//返回到父组件
            },
            selectItem(item,index){
                // songlist 组件选中的数据列表 更新数据源
                this.selectPlay({
                    list:this.songs,
                    index
                })
            },
            random(){
                this.randomPlay({
                    list:this.songs
                })
            },
            //mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用
            //this.selectPlay()` 映射为 `this.$store.dispatch('selectPlay')
            ...mapActions([
                'selectPlay',
                'randomPlay'
            ])
        },
        created(){
            this.probeType=3
        },
        computed:{
            bgImg(){
                return `background-image:url(${this.bgImage})`
            },
            
        }
    }
</script>
<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
    .music-list
        position fixed
        top 0px
        left 0px
        right 0px
        bottom 0px
        background $color-background
        .back
            position absolute
            top 0px
            left 6px
            z-index 50
            .icon-back
                display block
                padding 10px
                font-size $font-size-large-x
                color $color-theme
        .title
            position absolute
            top 0px
            left 10%
            z-index 40
            width 80%
            no-wrap()
            text-align center
            line-height 40px
            font-size $font-size-large
            color $color-text
        .bg-image
            position relative
            width 100%
            height 0
            padding-top 70%//%基于父元素的宽度 宽高比10:7
            transform-origin top
            //图片放大到适合元素容器的尺寸 有些地方会看不到 不变形
            background-size cover//100%按容器比例撑满，都看的到 图片变形
            // z-index 1
            .play-wrapper
                position absolute
                bottom 20px
                width 100%
                z-index 2
                .play
                    box-sizing border-box
                    width 135px
                    padding 7px 0
                    margin 0 auto
                    text-align center
                    border 1px solid $color-theme
                    color $color-theme
                    border-radius 16px
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
            .filter
                position absolute
                top 0px
                left 0px
                width 100%
                height 100%
                background rgba(7,17,27,0.4)
        .bg-layer
            position relative
            height 100%
            background $color-background
        .list
            position fixed
            top 0
            bottom 0
            width 100%
            background $color-background
            // overflow hidden
            .song-list-wrapper
                padding 20px 30px
            .loading-container
                position absolute
                width 100%
                top 50%
                transform translateY(-50%)         
</style>