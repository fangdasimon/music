import Vue from 'vue'
import Router from 'vue-router'

//异步加载路由 异步调用组件，需要时候才下载 首屏渲染很快
const Recommend= (resolve)=>{
  import('components/recommend/recommend').then((module)=>{
    resolve(module)
  })
}

const Singer= (resolve)=>{
  import('components/singer/singer').then((module)=>{
    resolve(module)
  })
}

const Rank= (resolve)=>{
  import('components/rank/rank').then((module)=>{
    resolve(module)
  })
}

const Search= (resolve)=>{
  import('components/search/search').then((module)=>{
    resolve(module)
  })
}

const SingerDetail= (resolve)=>{
  import('components/singer-detail/singer-detail').then((module)=>{
    resolve(module)
  })
}

const disc= (resolve)=>{
  import('components/disc/disc').then((module)=>{
    resolve(module)
  })
}

const toplist= (resolve)=>{
  import('components/toplist/toplist').then((module)=>{
    resolve(module)
  })
}

const userCenter= (resolve)=>{
  import('components/user-center/user-center').then((module)=>{
    resolve(module)
  })
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
          {
            path:':id',
            component:disc
          }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children:[
        {
          path:':id',
          component:toplist
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children:[
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path:'/user',
      component:userCenter
    }
  ]
})
