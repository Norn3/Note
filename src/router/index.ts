import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

// 配置信息中需要页面的相关配置，即路径代表的组件，页面对应关系
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',          // 通过什么路径来访问这个组件
		name: 'home',
		component: HomeView                // 路径对应的组件
	},
	{
		path: '/about',
		name: 'about',
		component: AboutView         
	}
]

// 创建路由
const router = createRouter(
{
	routes,
	history:createWebHashHistory(),     // history代表访问方式
})

export default router;