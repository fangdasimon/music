<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span v-for="(item,index) in dots" class="dot" :class="{'active':currentIndex===index}"></span>
        </div>
    </div>
</template>    
<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
    export default{
        data(){
            return{
                dots:[],
                currentIndex:0
            }
        },
        props:{//接收BScroll传递过来的参数
            loop:{type:Boolean,default:true},
            autoPlay:{type:Boolean,default:true},
            interval:{type:Number,default:2000}
        },
        mounted(){//slider数据获取的时间比挂载到页面的时间长 mounted执行一次就不在执行了
            setTimeout(()=>{
                this._setSliderWidth()
                this._initDots()
                this._initSilder()
                if(this.autoPlay){this._play()}
            },20)
            window.addEventListener('resize',()=>{//监听视口大小 改变就重新计算宽度
                if(!this.slider){return;}
                this._setSliderWidth(true)
                this.slider.refresh()
            })
        },
        methods:{
            _setSliderWidth(isResize){//给isResize是防止视口变化时totalWidth重复加width
                let totalWidth=0
                let width=this.$refs.slider.clientWidth//视口的宽度
                this.children=this.$refs.sliderGroup.children//放在data里 dots数组有用
                for(let i=0;i<this.children.length;i++){
                    addClass(this.children[i],'slider-item')
                    this.children[i].style.width=width+'px'//每一张图片的大小
                    totalWidth+=width
                }
                if(this.loop&&!isResize){totalWidth+=2*width}//加2倍的width 保证循环切换
                this.$refs.sliderGroup.style.width=totalWidth+'px'
            },
            _initSilder(){
                this.slider=new BScroll(this.$refs.slider,{
                     scrollX: true,//默认false
                     scrollY:false,//默认true
                     momentum: false,//当快速在屏幕上滑动一段距离的时候,会根据滑动的距离和时间计算出动量，并生成滚动动画 默认值true
                     snap: {//Slide组件专用的,默认为false,如果开启则需要配置一个 Object
                       loop: this.loop,
                       threshold: 0.3,//表示可滚动到下一个的阈值
                       speed: 400
                   }
                })
                this.slider.on('scrollEnd',()=>{//手动滚动完成之后派发的事件 激活dot
                    //将当前的slider下标赋值给currentIndex
                    var pageIndex=this.slider.getCurrentPage().pageX
                    this.currentIndex=pageIndex
                    //自动播放完一张图片就会触发scrollEnd事件,会和next方法冲突
                    if(this.autoPlay){clearTimeout(this.timer);this._play()}
                })
            },
            _initDots(){//保证setSlideWidth已初始化完成不然length为0
                this.dots=new Array(this.children.length)
            },
            _play(){
                this.timer=setTimeout(()=>{
                    this.slider.next(400)//滚动到下一个页面
                },this.interval)
            }
        }
    }
</script>
<style lang="stylus">
@import "~common/stylus/variable"
    .slider
        min-height 1px
        .slider-group
            position relative
            overflow hidden
            white-space nowrap
            .slider-item
                float left
                box-sizing border-box
                overflow hidden
                text-align center
                a
                    display block
                    width 100%
                    overflow hidden
                    text-decoration none
                img
                    display block
                    width 100%
        .dots
            position absolute
            right 0px
            left 0px
            bottom 12px
            text-align center
            font-size 0px
            transform translateZ(1px)
            .dot
                display inline-block
                width 8px
                height 8px
                margin 0 4px
                border-radius 50%
                background $color-text-l
                &.active
                    width 20px
                    border-radius 5px
                    background $color-text-ll
</style>