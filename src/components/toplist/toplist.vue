<template>
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition> 
</template>
<script>
import musicList from "components/music-list/music-list"
import {mapGetters} from "vuex"
import {getMusiclist} from "api/rank"
import {createSong,isValidMusic,processSongsUrl} from 'common/js/song'
    export default{
        data(){
            return{
                songs:[],
                rank:true
            }
        },
        computed:{
            title(){
                return this.toplist.topTitle
            },
            bgImage(){
                return this.toplist.picUrl
            },
            ...mapGetters([
                'toplist'
            ])
        },
        components:{musicList},
        created(){
            this._getMusiclist()
        },
        methods:{
            _getMusiclist(){
                getMusiclist(this.toplist.id).then((res)=>{
                    if(!this.toplist.id){
                        this.$router.push({ path:'/rank' }) 
                        return
                    }
                    processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
                        this.songs=songs
                    })
                })
            },
            _normalizeSongs(list){
                let ret=[]
                console.log(list)
                list.forEach((item) => {
                    let musicData=item.data
                    if(isValidMusic(musicData)){
                        ret.push(createSong(musicData))
                    }
                })
                return ret 
            }
        }
    }
</script>
<style lang="stylus">
    .slide-enter-active,.slide-leave-active
        transition all 0.4s
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)
</style>