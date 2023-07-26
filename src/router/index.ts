import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue'

// 配置信息中需要页面的相关配置，即路径代表的组件，页面对应关系
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',          // 通过什么路径来访问这个组件
		name: 'home',
		component: HomeView                // 路径对应的组件
	},
	{
		path: '/play',
		name: 'play',
		component: () => import('../views/PlayView.vue')    // 异步加载     
	}
]

// 创建路由
const router = createRouter(
{
	routes,
	history:createWebHashHistory(),     // history代表访问方式
})

export default router;