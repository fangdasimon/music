<template>
    <div class="player" v-show="playList.length>0">
        <transition name="normal" @enter="enter" @after-enter="afterEnter"
        @leave="leave" @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back"><i class="icon-back"></i></div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle" @touchstart.prevent="middleTouchstart"
                                    @touchmove.prevent="middleTouchmove"    
                                    @touchend="middleTouchend">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd">
                                <img class="image" :class="cdRotate" :src="currentSong.image" >
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p class="text" ref="lyricLine" 
                                :class="{'current':currentLineNum === index}"
                                v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
                    </div>
                    <div class="process-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="process-bar-wrapper">
                            <progress-bar ref="progressBar" :percent="percent" @percentChange="percentChange" @percentChanging="percentChanging"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i :class="iconMode" @click="changeMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableClass">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableClass">
                            <i :class="playIcon" @click="togglePlay"></i>
                        </div>
                        <div class="icon i-right" :class="disableClass">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right" @click="toggleFavorite">
                            <i class="icon" :class="FavoriteIcon"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :class="cdRotate" width="40" height="40" :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control miniCd">
                    <progress-circle :radius="radius" :percent="percent">
                        <i class="icon-mini" :class="miniIcon" @click.stop="togglePlay" ></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="playListShow">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist>
        <audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="updatetime" @ended="ended"></audio>
    </div>
</template>
<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'

import {getLyric} from 'common/js/song'
import Lyric from 'lyric-parser'
import scroll from 'base/scroll/scroll'
import playlist from 'components/playlist/playlist'
import {playModeMixin} from 'common/js/mixin'

    const transform =prefixStyle('transform')
    const transtionDuration =prefixStyle('transtionDuration')
    export default{
        mixins:[playModeMixin],
        data(){
            return{
                songReady:false,
                currentTime:0,//歌曲播放的时间
                radius:32,//mini界面底部的圆形进度条大小
                currentLyric:null,//当前歌曲的歌词
                currentLineNum:0,//当前歌词播放的行数
                currentShow:'cd',//cd界面与歌词界面的切换
                playingLyric:null//cd界面的底部当前歌词
            }
        },
        components:{progressBar,progressCircle,scroll,playlist},
        computed:{
            cdRotate(){
                return this.playing?'play':'play pause'
            },
            playIcon(){
                return this.playing?'icon-pause':'icon-play'
            },
            miniIcon(){
                return this.playing?'icon-pause-mini':'icon-play-mini'
            },
            disableClass(){
                return this.songReady ? '' : 'disable'
            },
            percent(){
                return this.currentTime/this.currentSong.duration
            },
            ...mapGetters([
                'fullScreen',
                'playList',
                'playing',
                'currentIndex'
            ])
        },
        watch:{
        // currentSong是由playlist和currentIndex列表空时currentIndex默认为-1获取不到
            currentSong(newsong,oldsong){//延迟到数据拿到后执行
                if(!newsong.id) return //防止列表为空的时报错
                if(newsong.id===oldsong.id) return
                if(this.currentLyric) {
                    this.currentLyric.stop()//清除内部的定时器 防止来回跳动
                    this.currentTime=0
                    this.playingLyric=''
                    this.currentLineNum=0
                }
                //防止连续点击 按暂停按钮后歌曲歌词还在播发
                //改ready触发事件 play事件歌曲播发时或不在暂停状态时触发
                //这样连续点击后马上点击暂停 歌曲歌词不会播发因为暂停状态下不会触发ready
                clearTimeout(this.timer) 
                this.timer=setTimeout(()=>{
                    this.$refs.audio.play()
                    this.getLyric()
                },1000)//保证歌曲从后台切到前台还能播放 而且防止连续切换
            },
            playing(newPlay){//根据playing的状态进行播放与暂停
                const audio=this.$refs.audio
                this.$nextTick(()=>{
                    newPlay?audio.play():audio.pause()
                })
            },
            fullScreen(newVal) {
                if (newVal) {
                  setTimeout(() => {
                    this.$refs.progressBar.setProgressOffset(this.percent)
                  }, 20)
                }
            }
        },
        created(){
            this.touch={}
        },
        methods:{
            back(){
                // console.log(this.currentSong)
                this.setFullScreen(false)
            },
            open(){
                this.setFullScreen(true)
            },
            togglePlay(){
                if(!this.songReady) return
                this.setPlaying(!this.playing)
                if(this.currentLyric){//歌词和歌曲一起播放暂停
                    this.currentLyric.togglePlay()
                }
            },
            next(){
                if(!this.songReady) return
                if(this.playList.length===1){//处理歌曲列表为1的情况
                    this.loop()
                }else{
                    let index=this.currentIndex+1
                    if(index===this.playList.length){
                        index=0
                    }
                    // console.log(index)
                    this.setCurrentIndex(index)//提交mutation切换歌曲
                    if(!this.playing) {
                        this.togglePlay()//提交mutation的播放状态-->数据源改变-->getters改变
                    }
                    this.songReady=false
                }
            },
            prev(){
                if(!this.songReady) return//过滤歌曲不能播放时抛出异常
                if(this.playList.length===1){
                    this.loop()
                }else{
                    let index=this.currentIndex-1
                    if(index===-1){
                        index=this.playList.length-1
                    }
                    // console.log(index)
                    this.setCurrentIndex(index)
                    if(!this.playing) {
                        this.togglePlay()
                    }
                    this.songReady=false
                }
            },
            loop(){
                let audio=this.$refs.audio
                audio.currentTime=0
                audio.play()
                if(this.currentLyric){//循环播放的时候歌词回到起始位置
                    this.currentLyric.seek(0)
                }
            },
            ended(){
                if(this.mode===playMode.loop){
                    this.loop()
                }else{
                    this.next()
                }
            },
            ready(){//加载时触发 浏览器能够开始播放指定的音频或视频
                this.songReady=true//添加标志位
                this.savePlayHistory(this.currentSong)
            },
            error(){//加载时触发 浏览器不能够播放指定的音频或视频
                this.songReady=true//避免歌曲url不能播放导致next和prev不能使用
            },
            updatetime(e){//播放位置改变时触发
                this.currentTime=e.target.currentTime
            },
            percentChanging(percent){
                 this.currentTime = this.currentSong.duration * percent
            },
            percentChange(percent){
                const currentTime = this.currentSong.duration * percent
                this.currentTime = this.$refs.audio.currentTime = currentTime
                if (!this.playing) {
                  this.togglePlay()
                }
                if(this.currentLyric){//percent改变 歌词也改变到相应的位置
                    this.currentLyric.seek(currentTime*1000)
                }
            },
            middleTouchstart(e){
                this.touch.initialed=true
                const touch=e.touches[0]
                this.touch.startX=touch.pageX
                this.touch.startY=touch.pageY
            },
            middleTouchmove(e){
                if(!this.touch.initialed) return
                const touch=e.touches[0]
                const deltaX=touch.pageX-this.touch.startX
                const deltaY=touch.pageY-this.touch.startY
                if(Math.abs(deltaY)>Math.abs(deltaX)) return
                const left=this.currentShow === 'cd' ? 0 : (-window.innerWidth)
                const offsetwidth=Math.min(0,Math.max((-window.innerWidth),left+deltaX))
                this.touch.percent=offsetwidth/(-window.innerWidth)

                this.$refs.lyricList.$el.style[transform]= `translate3d(${offsetwidth}px,0,0)`
                this.$refs.lyricList.$el.style[transtionDuration]=0

                this.$refs.middleL.style.opacity=1-this.touch.percent
                this.$refs.middleL.style[transtionDuration]=0
            },
            middleTouchend(){
                let offsetwidth
                let opacity
                let time=300
                if(this.currentShow === 'cd'){
                    if(this.touch.percent > 0.1) {
                        offsetwidth = -window.innerWidth
                        opacity = 0
                        this.currentShow = 'lyric'
                    }else{
                        offsetwidth = 0
                        opacity = 1
                    }
                }else{
                    if(this.touch.percent < 0.9) {
                        offsetwidth = 0
                        opacity = 1
                        this.currentShow = 'cd'
                    }else{
                        offsetwidth = -window.innerWidth
                        opacity = 0
                    }
                }
                this.$refs.lyricList.$el.style[transform]= `translate3d(${offsetwidth}px,0,0)`
                this.$refs.lyricList.$el.style[transtionDuration]=`${time}ms`

                this.$refs.middleL.style.opacity=opacity
                this.$refs.middleL.style[transtionDuration]=`${time}ms`
            },
            getLyric(){
                this.currentSong.getLyric().then((lyric)=>{
                    this.currentLyric=new Lyric(lyric,this.handleLyric)
                    if(this.playing){ 
                        this.currentLyric.play()
                    }
                    // console.log(this.currentLyric)
                }).catch(()=>{//处理歌词获取不到的情况
                    this.currentLyric=null
                    this.playingLyric=''
                    this.currentLineNum=0
                })
            },
            handleLyric({lineNum,txt}){
                if(!this.$refs.lyricLine) return
                this.currentLineNum=lineNum
                if(lineNum>5){//保持高亮歌词在屏幕中间
                    let lineEle=this.$refs.lyricLine[lineNum-5]
                    this.$refs.lyricList.scrollToElement(lineEle,1000)
                }else{
                    this.$refs.lyricList.scrollTo(0,0,1000) 
                }
                this.playingLyric=txt
            },
            playListShow(){
                this.$refs.playlist.toggleShow()
            },
            format(time){
                time=time | 0
                let minute=time/60 | 0
                let second=(time%60).toString().padStart(2,'0')
                return `${minute}:${second}`
            },
            enter(el,done){
                const { x, y, scale}=this._getPosAndScale()
                let animation={
                    0: {    //带上px单位
                        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0,0,0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0,0,0) scale(1)`
                    }
                }
                animations.registerAnimation({
                    name:'move',
                    animation,
                    presets:{
                        duration:400,
                        easing:'linear'
                    }
                })
                animations.runAnimation(this.$refs.cdWrapper,'move',done)
            },
            afterEnter(){
                animations.unregisterAnimation('move')
                this.$refs.cdWrapper.style.animation=''
            },
            leave(el,done){
                this.$refs.cdWrapper.style.transition='all 0.4s'
                const {x, y, scale}=this._getPosAndScale()
                this.$refs.cdWrapper.style[transform]=`translate3d(${x}px,${y}px,0) scale(${scale})`
                this.$refs.cdWrapper.addEventListener('transitionend',done)
            },
            afterLeave(){
                this.$refs.cdWrapper.style.transition=''
                this.$refs.cdWrapper.style[transform]=''
            },
            _getPosAndScale(){
                const targetWidth=40
                const padLeft=40
                const padBottom=30
                const padTop=80
                const sourceWidth=window.innerWidth*0.8
                const scale=targetWidth/sourceWidth
                const x=-(window.innerWidth/2-padLeft)
                const y=window.innerHeight-padTop-sourceWidth/2-padBottom
                return { x , y ,scale}
            },
            ...mapMutations({
                setFullScreen:'SET_FULL_SCREEN',
                setPlaying:'SET_PALYING'
            }),
            ...mapActions([
                'savePlayHistory'
            ])
        }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
    .player
        .normal-player
            position fixed
            left 0px
            right 0px
            top 0px
            bottom 0px
            background $color-background
            .background
                position absolute
                left 0px
                top 0px
                width 100%
                height 100%
                z-index -1
                opacity 0.6
                filter blur(20px)
            .top
                position relative
                margin-bottom 25px
                .back
                    position absolute
                    top 0px
                    left 6px
                    z-index 50//修改z-index
                    .icon-back
                        display inline-block
                        padding 9px
                        font-size $font-size-large-x
                        color $color-theme
                        transform rotate(-90deg)
                .title
                    width 70%
                    margin 0 auto
                    line-height 40px
                    text-align center
                    no-wrap()
                    font-size $font-size-large
                    color $color-text
                .subtitle
                    line-height 20px
                    text-align center
                    font-size $font-size-medium
                    color $color-text
            .middle
                position fixed
                width 100%
                top 80px
                bottom 170px
                white-space nowrap
                font-size 0
                .middle-l
                    display inline-block
                    vertical-align top
                    position relative
                    width 100%
                    height 0
                    padding-top 80%
                    .cd-wrapper
                        position absolute
                        left 10%
                        top 0
                        width 80%
                        height 100%
                        .cd
                            width 100%
                            height 100%
                            box-sizing border-box
                            .image
                                position absolute
                                left 0px
                                top 0px
                                width 100%
                                height 100%
                                border-radius 50%
                                border 10px solid rgba(255,255,255,0.1)
                                border-radius 50%
                                &.play//ios手机可能有问题
                                    animation rotate 20s linear infinite
                                &.pause
                                    animation-play-state paused
                    .playing-lyric-wrapper
                        width 80%
                        margin 30px auto 0
                        overflow hidden
                        text-align center
                        .playing-lyric
                            height 20px
                            line-height 20px
                            font-size $font-size-medium
                            color $color-text-l
                .middle-r
                    display inline-block
                    vertical-align top 
                    width 100%
                    height 100%
                    overflow hidden
                    .lyric-wrapper
                        width 80%
                        margin 0 auto
                        overflow hidden
                        text-align center
                        .text
                            line-height 32px
                            color $color-text-l
                            font-size $font-size-medium
                            &.current
                                color $color-text  
            .bottom
                  position absolute
                  bottom 50px
                  width 100%
                  .dot-wrapper
                      text-align center
                      font-size 0
                      .dot
                          display inline-block
                          vertical-align middle
                          margin 0 4px
                          width 8px
                          height 8px
                          border-radius 50%
                          background $color-text-l
                          &.active
                              width 20px
                              border-radius 5px
                              background $color-text-ll
                  .process-wrapper
                      display flex
                      align-items center
                      width 80%
                      margin 0 auto
                      padding 10px 0
                      .process-bar-wrapper
                          flex 1
                      .time
                          flex 0 0 30px
                          width 30px
                          line-height 30px
                          color $color-text
                          font-size $font-size-small
                          &.time-l
                              text-align left
                          &.time-r
                              text-align right
                      
                  .operators
                      display flex
                      align-items center
                      .icon
                          flex 1
                          color $color-theme
                          &.disable
                              color $color-theme-d
                          i
                              font-size 30px
                      .i-left
                          text-align right
                      .i-center
                          padding 0 20px
                          text-align center
                          i
                              font-size 40px
                      .i-right
                          text-align left
                      .icon-favorite
                          color $color-sub-theme
            &.normal-enter-active,&.normal-leave-active
                transition all 0.4s
                .top,.bottom//子动画对应的top bottom 也要变化
                    transition all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
            &.normal-enter,&.normal-leave-to
                opacity 0
                .top
                    transform translate3d(0,-100px,0)
                .bottom
                    transform translate3d(0,100px,0)
                                                 
        .mini-player
            display flex
            align-items center
            position fixed
            left 0px
            bottom 0px
            width 100%
            height 60px
            background $color-highlight-background
            &.mini-enter-active,&.mini-leave-active
                transition all 0.4s linear
            &.mini-enter,&.mini-leave-to
                opacity 0
            .icon
                flex 0 0 40px
                width 40px
                padding 0 10px 0 20px
                img 
                    border-radius 50%
                    &.play
                        animation rotate 20s linear infinite
                    &.pause
                        animation-play-state paused
            .text
                display flex
                flex-direction column
                justify-content center//竖向居中
                .name
                    margin-bottom 2px
                    width 200px//不能用flex 0 0 200px占位 因为方向变成了竖向
                    no-wrap()
                    font-size $font-size-medium
                    color $color-text
                .desc
                    width 200px
                    no-wrap()
                    font-size $font-size-small
                    color $color-text-d
            .control
                flex 0 0 30px
                width 30px
                padding 0 10px
                position absolute//设置了flex所以float失效 则定位在右侧
                right 5px
                &.miniCd
                    position absolute
                    right 50px
                .icon-playlist,.icon-play-mini,.icon-pause-mini
                    font-size 30px
                    color $color-theme-d
                .icon-mini
                    font-size 32px
                    position absolute
                    left 0px
                    top 0px
    @keyframes rotate
        0%
            transform rotate(0) 
        100%
            transform rotate(360deg)
                
</style>