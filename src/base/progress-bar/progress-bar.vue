<template>
    <div class="progress-bar" @click="progressClick" ref="progressBar">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchstart"
            @touchmove.prevent="progressTouchmove"
            @touchend="progressTouchend">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>
<script>
import {prefixStyle} from 'common/js/dom'
    const btnWidth=16
    const transform=prefixStyle('transform')
    export default{
       props:{
            percent:{
                type:Number,default:0
            }
       },
       watch:{
       //歌曲暂停后切回mini状态再切回来,歌曲的进度条位置回到原点
       //因为歌曲暂停后percent不会变化了即不会触发setProgressOffset的偏移了。而进度条
       //行走的宽度是由百分比计算得来的,现在音乐停止了百分比不变宽度也就无法计算.
       //解决办法：切回全屏之前主动促发一次setProgressOffset的偏移即原来停止播放的地方
            percent(newVal){
                this.setProgressOffset(newVal)
            }
       },
       created(){
            this.touch={}
       },
       methods:{
            setProgressOffset(percent){
                if(percent>=0 && !this.touch.initialed){//添加标志位解决冲突
                    const barWidth = this.$refs.progressBar.clientWidth - btnWidth
                    const offsetWidth = percent * barWidth
                    this._offsetX(offsetWidth)
                }
            },
            _offsetX(offsetWidth){//进度条和btn的偏移
                this.$refs.progress.style.width=`${offsetWidth}px`
                this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
            },
            progressClick(e){
                const rect=this.$refs.progressBar.getBoundingClientRect()
                const offsetX=e.pageX-rect.left
                this._offsetX(offsetX)
                this._triggerPercent()//非自然变动需要把进度传递出去 联动歌词
            },
            _triggerPercent() {
                this.$emit('percentChange', this._getPercent())
            },
            _getPercent(){//抽离出来时歌词需要
                const barWidth = this.$refs.progressBar.clientWidth - btnWidth
                return this.$refs.progress.clientWidth / barWidth
            },
            progressTouchstart(e){
                this.touch.initialed=true
                this.touch.startX=e.touches[0].pageX
                this.touch.left=this.$refs.progress.clientWidth
            },
            progressTouchmove(e){
                if(!this.touch.initialed) return
                let delatX=e.touches[0].pageX-this.touch.startX
                let offsetX=this.touch.left+delatX
                let translateX=Math.min(Math.max(0,offsetX),this.$refs.progressBar.clientWidth-btnWidth)
                this._offsetX(translateX)//move的时候实时调整process的宽度
                this.$emit('percentChanging', this._getPercent())//时间跟着变化
            },
            progressTouchend(){
                this.touch.initialed=false
                this._triggerPercent()
            }
       }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
    .progress-bar
        height 30px
        .bar-inner
            position relative
            top 13px
            height 4px
            background rgba(0,0,0,0.3)
            .progress
                position absolute//不给宽度根据js%定宽 
                height 100%
                background $color-theme
            .progress-btn-wrapper
                position absolute
                left -8px
                top -13px
                width 30px
                height 30px
                .progress-btn
                    position relative
                    top 7px
                    left 7px
                    width 16px
                    height 16px
                    border-radius 50%
                    border 3px solid $color-text
                    background $color-theme
                    box-sizing border-box

</style>