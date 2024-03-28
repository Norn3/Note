import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '../axios/insatance';


export const useLyricsStore = defineStore('lyrics', () => {
    
    const showLyrics = ref(false);
    const currentTime = ref(0);
    const coverImg = ref('');

    const curId = ref('');
    const nextId = ref('');

    const curLyrics = ref<any[]>([]);
    const nextLyrics = ref<any[]>([]);

    interface lyrics {
        time: number,
        lrc: string,
    }

    const setCurId = (newId: string) => {
        curId.value = newId;
    }

    const setNextId = async (newId: string) => {
        nextId.value = newId;
        if(showLyrics.value) {
            await setNextLyrics();
        }
    }

    const processLyrics = (lyrics: string): lyrics[] => {
        const arr: lyrics[] = [];
        const lines = String(lyrics).split('\n');
        const regex = /\[(\d+):(\d+\.\d+)\](.*)/;
        lines.forEach((item) => {
            const match = item.match(regex);
            if(match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseFloat(match[2]);
                const lrc = match[3];

                //将时间转换为毫秒
                const time = Math.floor(( minutes * 60 + seconds ) * 1000);
                //添加到结果数组
                arr.push({ time, lrc });
            }
        })
        return arr;
    }

    const setCurLyrics = async () => {
        const result = await getLyrics(curId.value);
        curLyrics.value = processLyrics(result)
    }

    const setNextLyrics = async () => {
        const result= await getLyrics(nextId.value);
        nextLyrics.value = processLyrics(result)
    }

    const setCoverImg = (img: string) => {
        coverImg.value = img;
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


    return {showLyrics, curLyrics, currentTime, coverImg, setCurId, setNextId, setNextLyrics, getCurLyrics, switchToNextLyrics, toggleShowLyrics, setCoverImg}
})