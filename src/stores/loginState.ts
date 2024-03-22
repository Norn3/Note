import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '../axios/insatance';


export const useLoginStateStore = defineStore('loginState', () => {
    
    const already_login = ref(false);
    // 此处可以优化为，用一个数据类存储需要的属性，然后外部读取时调用该数据类的实例进行属性访问
    const profile = ref<any>('');

    // 创建实例用于一次更改多个属性而只触发一次subscribe
    const store = useLoginStateStore();

    // 获取登录状态
    const getLoginStatus = () => {
        // 加时间戳防止接口数据缓存
        get<any>(`/login/status?timestamp=${Date.now()}`)
        .then(async (response) => {
            // 先获取到用户数据，最后再变更登录状态，以免其他组件watch被触发时用户数据仍为空
            profile.value = await requsetUserProfile();
            // 如果已登录，将登录状态改为true，否则改为false
            already_login.value = response.data.account.status == -10 ? false : true;
        })
        .catch((error) => {
            // 处理请求错误
            console.log('获取登录状态失败');
            console.log(error);
        });
    }

    // 获取登录状态
    const getLoginState = () => {
        return already_login.value;
    }
    
    const getProfile = () => {
        return profile.value;
    }

    // 处理登录
    const processLogin = async () => {
        profile.value = await requsetUserProfile();
        already_login.value = true;

    }

    // 处理登出
    const processLogout = async () => {
        // 加时间戳防止缓存
        await get<any>(`/logout?timestamp=${Date.now()}`)
            .then((response) => {
                console.log(response);
                console.log('退出登录成功');
            })
            .catch((error) => {
                // 处理请求错误
                console.log('退出登录失败');
                console.log(error);
            });
        already_login.value = false;
    }


    // 请求用户信息
    const requsetUserProfile = async (): Promise<any> => {
        let profile = null;
        await get<any>('/user/account')
        .then((response) => {
            console.log(response);
            profile = response.profile;
        })
        .catch((error) => {
            // 处理请求错误
            console.log('请求失败');
            console.log(error);
          });
        return profile;
    }


    return {already_login, getLoginState, getProfile, processLogin, processLogout, getLoginStatus}
})