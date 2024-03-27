import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '../axios/insatance';


export const useLyricsStore = defineStore('lyrics', () => {
    
    const showLyrics = ref(false);

    const curId = ref('');
    const nextId = ref('');

    const curLyrics = ref<string[]>([]);
    const nextLyrics = ref<string[]>([]);

    const setCurId = (newId: string) => {
        curId.value = newId;
    }

    const setNextId = async (newId: string) => {
        nextId.value = newId;
        if(showLyrics.value) {
            await setNextLyrics();
        }
    }

    const setCurLyrics = async () => {
        const result = await getLyrics(curId.value);
        curLyrics.value = String(result).split('\n');
    }

    const setNextLyrics = async () => {
        const result= await getLyrics(nextId.value);
        nextLyrics.value = String(result).split('\n');
    }

    const getCurLyrics = () => {
        return curLyrics.value;
    }

    const switchToNextLyrics = () => {
        curId.value = nextId.value;
        curLyrics.value = nextLyrics.value;
        
    }

    const toggleShowLyrics = async (show: boolean) => {
        if(show) {
            if(curId.value != '') await setCurLyrics();
            if(nextId.value != '') await setNextLyrics();
        }
        showLyrics.value = show;
    }

    // TODO：往下到三拜红尘凉不出，需要检查接口返回。往回的时候不触发lyricsPage的current_song_index监听，需要检查
    const getLyrics = async (songId: string): Promise<string> => {
        let lyrics = '';
        await get<any>(`/lyric?id=${songId}`)
        .then((response) => {
            lyrics = response.lrc.lyric;
        })
        .catch((error) => {
            // 处理请求错误
            console.log('获取歌词失败');
            console.log(error);
        });
        return lyrics;
    }


    return {showLyrics, curLyrics, setCurId, setNextId, setNextLyrics, getCurLyrics, switchToNextLyrics, toggleShowLyrics}
})