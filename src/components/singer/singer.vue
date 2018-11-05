
<template>
  <div class="singer" ref="singer">
    <listview :data="singerList" @selectDetail="selectSinger" ref="list"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'//获取接口数据方法
import {ERR_OK} from 'api/config'//判断接口是否请求成功
import Singer from 'common/js/singer'//定义类
import listview from 'base/listview/listview'//展现歌手列表组件
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
    const HOT_NAME="热门"
    const HOT_SINGER_LEN=10
    export default{
        mixins:[playlistMixin],
        data(){
            return{
                singerList:[]
            }
        },
        components:{listview},
        created(){
            this._getSingerList()
        },
        methods:{
            handlePlaylist(playList){
                const bottom=playList.length>0 ? '60px' : ''
                this.$refs.singer.style.bottom=bottom
                this.$refs.list.refresh()
            },
            selectSinger(singer){
                this.$router.push({
                    path:`/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            _getSingerList(){
                 getSingerList().then((res)=>{
                    if(res.code===ERR_OK){
                        this.singerList=this._normalizeSingerList(res.data.list)
                    }
                })
            },
            _normalizeSingerList(list){
                let map={
                    hot:{ title:HOT_NAME , items:[] }//创建一个热门对象
                }
                //填充数据
                list.forEach((item,index)=>{
                    if(index<HOT_SINGER_LEN){//向热门对象里填充数据
                        map.hot.items.push(new Singer({
                            id:item.Fsinger_mid,
                            name:item.Fsinger_name
                        }))
                    }
                    const key=item.Findex//创建每个关键字对象A-Z
                    if(!map[key]){
                        map[key]={ title:key , items:[] }
                    }//向每个关键字填充数据
                    map[key].items.push(new Singer({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name
                    }))
                })
                //分离热门和关键字
                let character=[],hot=[]
                for(let key in map){//遍历map里所有的对象hot key
                    let val=map[key]//分离出关键字做准备进行排序
                    if(val.title.match(/[a-zA-Z]/)){
                        character.push(val)
                    }else if(val.title===HOT_NAME){
                        hot.push(val)
                    }
                }
                //排序关键字和拼接热门
                character.sort((a,b)=>{
                    return a.title.charCodeAt(0)-b.title.charCodeAt(0)
                })
                return hot.concat(character)
            },
            //辅助函数将组件中的 methods 映射为 store.commit 调用
            //不改别名就用[]形式映射 改别名就用对象形式映射
            ...mapMutations({
            //映射this.setSinger()为this.$store.commit('SET_SINGER')
                setSinger:'SET_SINGER'
            })
        }
    }
</script>

<style lang="stylus">
    .singer
        position fixed
        top 88px
        bottom 0px
        width 100%
        overflow hidden
</style>
