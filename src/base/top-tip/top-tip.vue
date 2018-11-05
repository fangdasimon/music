<template>
    <transition name="drop">
        <div class="top-tip" v-show="showFlag" @click.stop="hide">
            <slot></slot>
        </div>
    </transition>
</template>
<script>
    export default{
        data(){
            return{
                showFlag:false
            }
        },
        methods:{
            show(){
                this.showFlag=true
                clearTimeout(timer) //避免在延迟时间还在点击歌曲 只出现一次
                let timer=setTimeout(()=>{
                    this.showFlag=false
                },2000)
            },
            hide(){
                this.showFlag=false
            }
        }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
    .top-tip
        position fixed
        top 0px
        left 0px
        width 100%
        background $color-dialog-background
        &.drop-enter-active,&.drop-leave-active
            transition all 0.3s
        &.drop-enter,&.drop-leave-to
            transform translate3d(0,-100%,0)
</style>