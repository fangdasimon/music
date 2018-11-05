<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
    export default{
        props:{
            probeType:{type:Number,default:2},
            click:{type:Boolean,default:true},
            data:{type:Array,default:null},
            pullup:{type:Boolean,default:false},
            beforeScroll:{type:Boolean,default:false}//手机在搜索框点击搜索的时候会弹出键盘
        },
        mounted(){//有时滚动失效 加大延迟时间保证让better-scroll参数获取到
            setTimeout(()=>{
                this._initScroll()
            },20)
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this.refresh()
                },20)
            }
        },
        methods:{
            _initScroll(){
                if(!this.$refs.wrapper) return
                this.scroll=new BScroll(this.$refs.wrapper,{
                    probeType:this.probeType,
                    click:this.click
                })
                this.scroll.on('scroll',(pos)=>{//外面一定要传probetype属性:3
                    this.$emit('scroll',pos)
                })

                if(this.pullup) { //上推底部刷新
                    this.scroll.on('scrollEnd',()=>{
                        if(this.scroll.y <= (this.scroll.maxScrollY+50))
                        this.$emit('scrollToEnd')
                    })
                }

                if(this.beforeScroll) { //滚动之前键盘收起
                    this.scroll.on('beforeScrollStart',()=>{
                        this.$emit('beforeScroll')
                    })
                }
            },
            enable(){
                this.scroll && this.scroll.enable()
            },
            disable(){
                this.scroll && this.scroll.disable()
            },
            refresh(){
                this.scroll && this.scroll.refresh()
            },
            scrollTo(){//滚动到指定位置
                this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
            },
            scrollToElement(){//滚动到目标元素
                // 外部函数调用参数中如果传入带有this在这里用apply何以解决this冲突
                this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
            }
        }
    }
</script>
<style lang="stylus"></style>