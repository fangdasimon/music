<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input ref="query" class="box" :placeholder="placeholder" v-model="query">
        <i v-show="query" class="icon-dismiss" @click="clear"></i>
    </div>
</template>
<script> 
import {debounce} from 'common/js/util'
    export default{
        props:{
            placeholder:{type:String,default:'搜索歌曲 歌手'}
        },
        data(){
            return{
                query:''
            }
        },
        methods:{
            clear(){
                this.query=''
            },
            setSearchKey(query){
                this.query=query
            },
            blurInput(){
                this.$refs.query.blur()
            }
        },
        created(){
            this.$watch('query',debounce((newVal)=>{
                this.$emit('query',newVal)
            },200))
        }
    }
</script>
<style lang="stylus">
@import "~common/stylus/variable"
    .search-box
        display flex
        align-items center
        box-sizing border-box
        width 100%
        height 40px
        padding 0 6px
        background $color-highlight-background
        .icon-search
            font-size 24px
            color $color-background
        .box
            flex 1
            margin  0 5px
            line-height 18px
            background $color-highlight-background
            color $color-text
            font-size $font-size-medium
            &::placeholder
                color $color-text-d
        .icon-dismiss
            font-size 16px
            color $color-background
</style>