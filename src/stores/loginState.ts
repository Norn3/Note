import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '../axios/insatance';


export const useLoginStateStore = defineStore('loginState', () => {
    
    const already_login = ref(false);
    const cookie = ref<string | null>('');
    // 此处可以优化为，用一个数据类存储需要的属性，然后外部读取时调用该数据类的实例进行属性访问
    const profile = ref<any>('');

    // 创建实例用于一次更改多个属性而只触发一次subscribe
    const store = useLoginStateStore();

    // 打开页面时将localStroage中的数据存入store中
    const initializeStore = () => {
        if(localStorage.getItem('currentCookie') != null) {
            already_login.value = true;
            cookie.value = localStorage.getItem('currentCookie');
            requsetUserProfile();
        }
    }

    // 获取登录状态
    const getLoginState = () => {
        return already_login.value;
    }
    
    const getProfile = () => {
        return profile.value;
    }

    // 处理登录
    const processLogin = async (newCookie: string) => {
        already_login.value = true;
        cookie.value = newCookie;
        localStorage.setItem('currentCookie', newCookie)
        requsetUserProfile();
    }

    // 处理登出
    const processLogout = async () => {
        already_login.value = false;
        cookie.value = '';
        localStorage.removeItem('currentCookie');
    }


    // 请求用户信息
    const requsetUserProfile = () => {
        get<any>('/user/account')
        .then((response) => {
            console.log(response);
            profile.value = response.profile;
        })
    }

    return {already_login, getLoginState, getProfile, processLogin, processLogout, initializeStore}
})