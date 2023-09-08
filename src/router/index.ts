import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/home/HomeView.vue'

// 配置信息中需要页面的相关配置，即路径代表的组件，页面对应关系
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',          // 通过什么路径来访问这个组件
		name: 'home',
		component: HomeView,                // 路径对应的组件
		children:[
			{
				path: 'homeRecommend',
				name: 'recommend',
				component: () => import('../views/home/HomeRecommendView.vue'),    
			},
			{
				path: 'homePlayList',
				name: 'playList',
				component: () => import('../views/home/HomePlayListView.vue'),    
			},
			{
				path: 'homeRank',
				name: 'rank',
				component: () => import('../views/home/HomeRankView.vue'),    
			},
		]
	},
	{
		path: '/play',
		name: 'play',
		component: () => import('../views/PlayListView.vue'),    // 异步加载     
		children: [
			
		]
	},
	{
		path: '/account',
		name: 'account',
		component: () => import('../views/account/accountHomeView.vue'),
		children:[
			{
				path: 'accountHome',
				name: 'accountHome',
				component: () => import('../views/account/accountHomeView.vue'),	
			},
			{
				path: 'message',
				name: 'accountMessage',
				component: () => import('../views/account/accountMessageView.vue'),	
			},
			{
				path: 'setting',
				name: 'accountSetting',
				component: () => import('../views/account/accountSettingView.vue'),	
			},
		]
	}
]

// 创建路由
const router = createRouter(
{
	routes,
	history:createWebHashHistory(),     // history代表访问方式
})

export default router;