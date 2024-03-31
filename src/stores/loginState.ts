import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '../axios/insatance';
import { useuserPlaylistStore } from './userPlaylist';


export const useLoginStateStore = defineStore('loginState', () => {
    
    const already_login = ref(false);
    // 此处可以优化为，用一个数据类存储需要的属性，然后外部读取时调用该数据类的实例进行属性访问
    const profile = ref<any>('');

    const useLogin = ref(false);

    const userPlaylistStore = useuserPlaylistStore();


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
    
    // 获取用户数据
    const getProfile = () => {
        return profile.value;
    }

    // 点击登录入口时，改变useLogin，触发loginFrame登录框出现
    const showLoginEntry = () => {
        useLogin.value = true;
    }

    // 点击登录框的关闭键，或完成登录操作时，改变useLogin，触发loginFrame登录框隐藏
    const hideLoginEntry = () => {
        useLogin.value = false;
    }

    // 处理登录
    const processLogin = async (type: string, id?: string, password?: string): Promise<boolean> => {
        let login_result = false;
        const address = `/login/cellphone?phone=${id}` + (type == 'password' ? `&md5_password=${password}` : `&captcha=${password}`);
        login_result = 
        await get<any>(address)
            .then(async (response) => {
                console.log(response);
                if(response.code == 200) {
                    return true;
                }
                return false;
            })
            .catch((error) => {
                // 处理请求错误
                console.log('请求失败');
                console.log(error);
                return false;

            });
        if(login_result) {
            profile.value = await requsetUserProfile();
        }
        already_login.value = login_result;
        return login_result;
    }

    // 处理登出
    const processLogout = async () => {
        // 加时间戳防止缓存
        await get<any>(`/logout?timestamp=${Date.now()}`)
            .then(async (response) => {
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
        await get<any>(`/user/account?timestamp=${Date.now()}`)
        .then(async (response) => {
            console.log(response);
            profile = response.profile;
            await userPlaylistStore.setUserPlaylist(profile.userId);
            
        })
        .catch((error) => {
            // 处理请求错误
            console.log('请求失败');
            console.log(error);
          });
        return profile;
    }


    return {already_login, useLogin, profile, getLoginState, getProfile, processLogin, processLogout, getLoginStatus, showLoginEntry, hideLoginEntry}
})