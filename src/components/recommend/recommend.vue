<template>
  <scroll ref="scroll" class="recommend">
    <div class="recommend-content">
        <!-- slider数据获取的时间比挂载到页面的时间长 mounted执行一次就不在执行了,那时宽度和scroll已经执行了但是数据还没获取到,所以要用v-if进行控制-->
        <div v-if="recommend.length" class="slide-wrapper">
            <slider>
                <div v-for="item in recommend">
                    <a :href="item.linkUrl">
                        <img :src="item.picUrl">
                    </a>
                </div>
            </slider>
        </div>
        <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
                <li @click="selectItem(item)" v-for="item in discList" class="item">
                    <div class="icon">
                        <img v-lazy="item.imgurl" width="60" height="60">
                    </div>
                    <div class="text">
                        <h2 class="name" v-html="item.creator.name"></h2>
                        <p class="desc" v-html="item.dissname"></p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div class="loading-container" v-show="!discList.length">
        <loading></loading>
    </div>
  <router-view></router-view>   
  </scroll>
</template>

<script>
import scroll from 'base/scroll/scroll'//竖向滚动
import {getRecommend,getDiscList} from 'api/recommend'//获取数据方法
import {ERR_OK} from 'api/config'//判断是否获取成功
import slider from 'base/slider/slider'//横向滚动
import loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'

import {mapMutations} from 'vuex'
export default{
    mixins:[playlistMixin],
    data(){
        return{
            recommend:[],
            discList:[]
        }
    },
    components:{slider,scroll,loading},
    created(){
        this._getRecommend()//获取轮播图数据
        this._getDiscList()//获取歌单列表数据
    },
    methods:{
        selectItem(item){
            this.$router.push({
                path:`/recommend/${item.dissid}`
            })
            this.setDisc(item)
        },
        handlePlaylist(playList){//滑到底部时要有高度不然会被mini播放器挡住
            const bottom=playList.length>0 ? '60px' : ''
            this.$refs.scroll.$el.style.bottom=bottom
            this.$refs.scroll.refresh()
        },
        _getRecommend(){
            getRecommend().then((res)=>{
                if(res.code===ERR_OK){
                    this.recommend=res.data.slider
                }
            })
        },
        _getDiscList(){
            getDiscList().then((res)=>{
                if(res.code===ERR_OK){
                    this.discList=res.data.list
                }
            })
        },
        ...mapMutations({
            setDisc:'SET_DISC'
        })
    }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
    .recommend
        position fixed
        width 100%
        top 88px
        bottom 0px
        overflow hidden//子元素滑动的时候超过的部分隐藏
        .recommend-content
            .slide-wrapper
                position relative
                width 100%
                overflow hidden
            .recommend-list
                .list-title
                    height 65px
                    line-height 65px
                    text-align center
                    font-size $font-size-medium
                    color $color-theme
                .item
                    display flex
                    box-sizing border-box
                    align-items center
                    padding 0 20px 20px 20px
                    .icon
                        flex 0 0 60px
                        width 60px
                        padding-right 20px
                    .text
                        flex 1
                        display flex
                        flex-direction column
                        justify-content center
                        line-height 20px
                        overflow hidden
                        font-size $font-size-medium
                        .name
                            margin-bottom 10px
                            color $color-text
                        .desc
                            color $color-text-d
            .loading-container
                position absolute
                width 100%
                top 50%
                transform translateY(-50%)        
</style>