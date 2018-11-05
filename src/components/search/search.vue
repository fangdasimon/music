<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="queryChange"></search-box>
        </div> 
        <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
            <scroll class="shortcut" :data="shortcut" ref="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li @click="searchKey(item.k)" v-for="item in hotkey" class="item"> 
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="clearAll">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>
                        <search-list @addQuery="searchKey" @deleteOne="deleteSearchHistory" :searches="searchHistory"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest ref="suggest" @select="saveSearch" @beforeScroll="beforeScroll" :query="query"></suggest>
        </div>
        <confirm ref="confirm" @confirm="confirm" text="是否清空搜索历史" confirmBtnText="清空"></confirm>
        <router-view></router-view> <!-- 加了子路由之后记得在页面添加router-view -->
    </div>
</template>

<script>
import searchBox from 'base/search-box/search-box'
import {gethotkey} from 'api/search'
import {ERR_OK} from 'api/config'
import suggest from 'components/suggest/suggest'
import searchList from 'base/search-list/search-list'
import confirm from 'base/confirm/confirm'
import scroll from 'base/scroll/scroll'
import {playlistMixin,searchMixin} from 'common/js/mixin'
import {mapActions,mapGetters} from 'vuex'

    export default{
        mixins:[playlistMixin,searchMixin],
        computed:{
            shortcut(){//computed里的属性不用在data里面定义 watch里面需要
                return this.hotkey.concat(this.searchHistory)
            },
            ...mapGetters([
               'searchHistory'
            ])
        },
        components:{searchBox,suggest,searchList,scroll,confirm},
        created(){
            this._gethotkey()
        },
        //再加一次搜索页面本来刚好可以滚动 但是返回search页面前会删掉query
        //又触发了一次搜索 虽然在cache.js里面拦截了但是刷新失效了
        watch:{
            query(newQuery){
                if(!newQuery) {
                    setTimeout(()=>{//保证获取到dom
                        this.$refs.shortcut.refresh()
                    },20)
                }
            }
        },
        data(){
            return{
                hotkey:[]
            }
        },
        methods:{
            handlePlaylist(playlist){
                const bottom=playlist.length > 0 ? '60px' : ''
                this.$refs.shortcutWrapper.style.bottom=bottom
                this.$refs.shortcut.refresh()

                this.$refs.searchResult.style.bottom=bottom
                this.$refs.suggest.refresh()
            },
            _gethotkey(){
                gethotkey().then((res)=>{
                    if(res.code === ERR_OK) {
                        this.hotkey=res.data.hotkey.slice(0,10)
                    }
                })
            },
            // searchKey(item){//父组件调用子组件方法发送消息 子组件this.$emit通知父组件 
            //     this.$refs.searchBox.setSearchKey(item)
            // },
            // queryChange(newQuery){
            //     this.query=newQuery
            // },
            // beforeScroll(){
            //     this.$refs.searchBox.blurInput()
            // },
            // saveSearch(){
            // //提交搜索关键字 保存到本地存储 state从本地获取新数据(actions 提交mutation)
            //     this.saveSearchHistory(this.query)
            // },
            clearAll(){
                this.$refs.confirm.show()
            },
            confirm(){
                this.clearSearchHistory()
            },
            ...mapActions([
                'clearSearchHistory'
            ])   
        }
    }
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
    .search
        .search-box-wrapper
            margin 20px
        .shortcut-wrapper
                position fixed
                top 178px
                bottom 0px
                width 100%
                .shortcut
                    height 100%
                    overflow hidden
                    .hot-key
                        margin 0 20px 20px 20px
                        .title
                            margin-bottom 20px
                            font-size $font-size-medium
                            color $colot-text-l
                        .item
                            display inline-block
                            padding 5px 10px
                            margin 0 20px 10px 0
                            border-radius 6px
                            background $color-highlight-background
                            font-size $font-size-medium
                            color $color-text-d
                    .search-history
                        position relative
                        margin 0 20px
                        .title
                            display flex
                            align-item center
                            height 40px
                            font-size $font-size-medium
                            color $color-text-l
                            .text
                                flex 1
                            .clear
                                extend-click()
                                .icon-clear
                                    font-size $font-size-medium
                                    color $color-text-d
        .search-result
                position fixed
                width 100%
                top 178px
                bottom 0px                            
</style>