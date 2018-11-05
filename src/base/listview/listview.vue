
<template>
    <scroll class="listview" ref="listview" @scroll="scroll" :probeType="probeType">
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>                  <!--  bettero-scroll内置封装了touch事件 -->
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop="onShortcutTouchMove">
            <ul>
                <li v-for="(item,index) in shortcutList" 
                :data-index="index" 
                :class="{'active':currentIndex===index}"
                class="item">{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixTitle">
            <div class="fixed-title">{{fixTitle}}</div>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>
<script>
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {getData} from 'common/js/dom'
    const ANCHOR_HEIGHT=18
    const TITLE_HEIGHT=30
    export default{
        props:{
            data:{type:Array,default:[]}
        },
        components:{scroll,loading},
        data(){
            return{
                scrollY:0,
                listHeight:[],
                diff:0
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this._caculateHeight()
                },20)
            },
            diff(value){//自定义属性最好放在watch里面观测
                let fixTop=(value>0&&value<TITLE_HEIGHT)?value-TITLE_HEIGHT:0
                this.$refs.fixed.style.transform=`translate3d(0,${fixTop}px,0)`
            }
        },
        computed:{
            shortcutList(){
                return this.data.map((group)=>{
                    return group.title.substring(0,1)//热门截取第一个字
                })
            },
            // 利用滚动距离在数组里面比较 在哪一个索引里 这个索引就是高亮值
            currentIndex(){//因为scrollY的变化会影响currentIndex所以放在computed属性里
                let scrollY=Math.abs(this.scrollY)
                for(let i=0;i<this.listHeight.length;i++){
                    let height1=this.listHeight[i]
                    let height2=this.listHeight[i+1]
                    this.diff=height2-scrollY//剩余的距离和title高度比较
                    if(!height2 || (scrollY>=height1 && scrollY<height2)){
                        return i
                    }
                }
            },
            fixTitle(){ //fixTitle用了position定位层级高一些 达到某个index更换title
                if(this.scrollY>0){ return '' }//上为正 下为负
                return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
            }
        },
        methods:{
            refresh(){
                this.$refs.listview.refresh()
            },
            // 左右侧联动 scroll事件scrollY touch事件pageY
            onShortcutTouchStart(e){
                // 利用touch事件的touches的pageY属性获取当前的竖直位置--》放到一个数组里
                // 然后move的时候move的终点位置减去保存在数组里的初始位置获得位移 位移除以关键字的高度获得count count+index--》高亮index--》滚动
                var anchorIndex=getData(e.target,'index')  
                this.touch.y1=e.touches[0].pageY
                this.touch.anchorIndex=anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e){
                this.touch.y2=e.touches[0].pageY    //~~ 和 | 0 效果一样向下取整
                var count=(this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT | 0
                var anchorIndex= parseInt(this.touch.anchorIndex)+count
                this._scrollTo(anchorIndex)
            },
            scroll(pos){//获取滑动的距离
                this.scrollY=pos.y
            },
            _scrollTo(index){
                // move的时候边界值的处理
                if(index<0){
                    index=0
                }else if(index>this.listHeight.length-2){
                    index=this.listHeight.length-2//倒数第二个的下线 最后一个的上线
                }
                //touch的时候根据index获取listHeight里面dom的高度--》更新scrollY--》高亮i
                this.scrollY=this.listHeight[index]
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
            },
            //拿到每个类别高度放进数组
            _caculateHeight(){
                let listGroup=this.$refs.listGroup
                let height=0
                this.listHeight.push(height)
                // console.log(listGroup)
                if(listGroup && listGroup.length){
                    for(var i=0;i<listGroup.length;i++){
                        height+=listGroup[i].clientHeight
                        this.listHeight.push(height)
                    }
                }
            },
            selectItem(item){
                this.$emit('selectDetail',item)
            }
        },
        created(){
            this.touch=[]
            this.probeType=3
        }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
    .listview
        position relative
        width 100%
        height 100%//继承父元素的singer高度
        overflow hidden
        background $color-backgound
        .list-group
            padding-bottom 30px
            .list-group-title
                height 30px
                line-height 30px
                padding-left 20px
                font-size $font-size-small
                color $color-text-l
                background $color-highlight-background
            .list-group-item
                display flex
                align-items center
                padding 20px 0 0 30px
                .avatar
                    width 50px
                    height 50px
                    border-radius 20%
                .name
                    margin-left 20px
                    color $color-text-l
                    font-size $font-size-medium
        .list-shortcut
            position: absolute
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            background: $color-background-d
            font-family: Helvetica
            .item
                padding: 3px
                line-height: 1
                color: $color-text-l
                font-size: $font-size-small
                &.active
                    color $color-theme            
        .list-fixed
            position absolute
            top -1px
            left 0px
            width 100%
            .fixed-title
                height 30px
                line-height 30px
                padding-left 20px
                font-size $font-size-small
                color $color-text-l
                background $color-highlight-background
        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>