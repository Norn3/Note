import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '../axios/insatance';


export const useuserPlaylistStore = defineStore('userPlaylist', () => {
    
    const use_Collect_Song = ref(false);
    // 用户创建的歌单
    const createList = ref<any[]>([]);
    // 用户收藏的歌单
    const likeList = ref<any[]>([]);

    // 获取用户歌单
    const setUserPlaylist = async (uid: string) => {
        // 加时间戳防止接口数据缓存
        await get<any>(`/user/playlist?uid=${uid}`)
        .then((response) => {
            const playlist = response.playlist;
            let slice = 0;
            for (const element of playlist) {
                if (element.userId != uid) break;
                slice++;
            }
            createList.value = playlist.slice(0, slice);
            likeList.value = playlist.slice(slice, playlist.length);
        })
        .catch((error) => {
            // 处理请求错误
            console.log('获取登录状态失败');
            console.log(error);
        });
        return;
    }

    const getCreateList = () => {
        return createList.value;
    }
    const getLikeList = () => {
        return likeList.value;
    }

    const showCollectFrame = () => {
        use_Collect_Song.value = true;
    }
    const hideCollectFrame = () => {
        use_Collect_Song.value = false;
    }

    return {use_Collect_Song, setUserPlaylist, getCreateList, getLikeList, showCollectFrame, hideCollectFrame}
})