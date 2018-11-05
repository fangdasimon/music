<template>
    <transition name="move">  
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>       
<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {createSong,isValidMusic,processSongsUrl} from 'common/js/song'
import musicList from 'components/music-list/music-list'
import { ERR_OK } from 'api/config'
    export default{
        data(){
            return {
                songs:[]//获取歌曲列表-->数据传递子组件musiclist 提交数据更新数据源-->
            }
        },
        components:{musicList},
        computed:{
            title(){
                return this.singer.name
            },
            bgImage(){
                return this.singer.avatar
            },
    //mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
    //当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组,取别名用对象的形式
            ...mapGetters([
                'singer'
            ])
        },
        created(){
            this._getSingerDetail()
        },
        methods:{
            _getSingerDetail(){
        //在子路由页面刷新 由于没有选中数据去共享 singer数据获取是空的
        //子路由在没有拿到数据时刷新 回退到父路由
                if(!this.singer.id){
                    this.$router.push({
                        path:'/singer'
                    })
                    return 
                }
                getSingerDetail(this.singer.id).then((res)=>{
                   if (res.code === ERR_OK) {
                        processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
                          this.songs = songs
                        })
                      }
                })
            },
            _normalizeSongs(list){
                // console.log(list)
                let ret=[]
                list.forEach((item)=>{
                    let {musicData}=item
                    if(isValidMusic(musicData)){
                        ret.push(createSong(musicData))
                    }
                })
                // console.log(ret)
                return ret
            }
        }
    }
</script>
<style lang="stylus">
@import '~common/stylus/variable'
    .move-enter-active,.move-leave-active
        transition all 0.3s linear
    .move-enter,.move-leave-to
        transform translate3d(100%,0,0)
</style> 