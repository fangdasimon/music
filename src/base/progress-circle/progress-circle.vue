<template>
    <div class="progress-circle">
        <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
            <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
            :stroke-dasharray="strokeArray" :stroke-dashoffset="strokeOffset"></circle>
        </svg>  <!-- 描边 -->                     <!-- 偏移 -->
        <slot></slot>
    </div>
</template>
<script>
    export default{
        props:{
            radius:{
                type:Number,default:0
            },
            percent:{
                type:Number,default:0
            }
        },
        data(){
            return{
                strokeArray:Math.PI*100
            }
        },
        computed:{
            strokeOffset(){
                return (1-this.percent)*this.strokeArray
            }
        }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
    .progress-circle
        position relative
        circle
            stroke-width 8px
            transform-origin center
            &.progress-background
                transform scale(0.9)    
                stroke $color-theme-d
            &.progress-bar
                transform scale(0.9) rotate(-90deg)
                stroke $color-theme
</style>