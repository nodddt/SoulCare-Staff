import Vue from 'vue'

import VueRouter from 'vue-router'




Vue.use(VueRouter)


const routes=[
    {
        path:'/consultanthome',
        name:'consultantHome',
        component:()=>import("../views/consultantHome.vue")
    },
    {
        path:'/adminhome',
        name:'adminHome',
        component:()=>import("../views/AdminHome.vue")
    },
    {
        path:'/supervisorhome',
        name:'supervisorHome',
        component:()=>import("../views/SupervisorHome.vue")
    },
    {
        path:'/login',
        name:'Login',
        component:()=>import("../views/Login.vue")
     },
    
];


const router = new VueRouter({
    mode: 'history', // 使用历史模式或哈希模式，根据你的需求选择
    base: process.env.BASE_URL, // 基本 URL
    routes
 })
 

 export default router

 