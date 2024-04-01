import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '../axios/insatance';

import { useLoginStateStore } from './loginState';

// 用于储存用户歌单，以及进行在歌单中添加或删除歌曲的操作
export const useuserPlaylistStore = defineStore('userPlaylist', () => {

    // 用户创建的歌单
    const createList = ref<any[]>([]);
    // 用户收藏的歌单
    const likeList = ref<any[]>([]);
    // 是否打开歌曲收藏框
    const use_Collect_Song = ref(false);
    // 点开收藏框时，需要收藏的目标歌曲id
    const collectingSongId = ref('');


    // 使用登录store，使用用户id获取用户歌单
    const loginStore = useLoginStateStore();

    // 获取用户歌单
    const setUserPlaylist = async (uid: string) => {
        try {
            const response = await get<any>(`/user/playlist?uid=${uid}&timestamp=${Date.now()}`);
            const playlist = response.playlist;
            let slice = 0;
            for (const element of playlist) {
              if (element.userId != uid) break;
              slice++;
            }
            createList.value = playlist.slice(0, slice);
            likeList.value = playlist.slice(slice, playlist.length);
            return; 

          } catch (error) {
            // 处理请求错误
            console.log('获取用户歌单失败');
            console.log(error);
          }
    }

    const getCreateList = () => {
        return createList.value;
    }
    const getLikeList = () => {
        return likeList.value;
    }
    const setCollectingSongId = (sId: string) => {
        collectingSongId.value = sId;
    }

    const createPlaylist = async (name: string) => {
        try {
            const response = await get<any>(`/playlist/create?name=${name}`)
            processSongInPlaylist('add', response.id);
            return; 

          } catch (error) {
            // 处理请求错误
            alert('创建歌单失败');
            console.log(error);
          }
    }

    const deletePlaylist = async (playlistId: string) => {
        try {
            const response = await get<any>(`/playlist/delete?id=${playlistId}`)
            console.log(response);
            return; 

          } catch (error) {
            // 处理请求错误
            alert('创建歌单失败');
            console.log(error);
          }
    }

    const processSubscribePlaylist = async (playlistId: string, action: string) => {
        try {
            const response = await get<any>(`/playlist/subscribe?t=${action}&id=${playlistId}`)
            await setUserPlaylist(loginStore.getProfile().userId);
            return response.code == 200 ? true : false;
        } catch (error) {
            // 处理请求错误
            alert('收藏或取消收藏歌单失败');
            console.log(error);
        }
    }

    const processSongInPlaylist = async (type: string, playlistId: string) => {
        await get<any>(`/playlist/tracks?op=${type}&pid=${playlistId}&tracks=${collectingSongId.value}`)
        .then(async (response) => {
            console.log(response);
            hideCollectFrame();
            await setUserPlaylist(loginStore.getProfile().userId);
        })
        .catch((error) => {
            // 处理请求错误
            alert('添加或移除歌曲失败');
            hideCollectFrame();
            console.log(error);
        });
        return;
    }

    const showCollectFrame = (songId: string) => {
        setCollectingSongId(songId);
        use_Collect_Song.value = true;
    }
    const hideCollectFrame = () => {
        setCollectingSongId('');
        use_Collect_Song.value = false;
    }



    return {use_Collect_Song, createList, likeList, setUserPlaylist, getCreateList, getLikeList, processSubscribePlaylist, setCollectingSongId, createPlaylist, deletePlaylist, processSongInPlaylist, showCollectFrame, hideCollectFrame}
})