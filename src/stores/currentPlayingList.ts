import { defineStore } from 'pinia'
import { Ref, reactive, ref } from 'vue'
import { get } from '../axios/insatance';
import { address } from '../util/getSongListAddress';

import processSongDuration from '../util/processSongDuration';


export const useCurrentPlayingListStore = defineStore('currentPlayingList', () => {
    // TODO：current_playlist_id还需要优化，因为歌单、专辑、歌手热曲这三种不同的歌曲列表来源，id有可能一致。或者可以直接取消该属性，对比时直接对比整个播放列表
    const current_playlist_id = ref('');       // 当前播放列表所属歌单id，如果并非已有歌单、专辑，则置空
    const playing_list = ref<any[]>([]);       // 当前播放列表所有歌曲信息
    const current_song_index = ref(0);         // 当前播放歌曲在playing_list中的下标
    const next_song_index = ref(0);            // 即将播放的下一首歌曲的id，audioPlayer通过监听它实现预加载
    const play_mode = ref('sequential');       // 播放模式，分为singleloop，sequential和shuffle
    const cur_song_reset = ref(false);         // 是否由于点击播放按钮，使得当前正在播放的歌曲发生切换

    // 创建实例用于一次更改多个属性而只触发一次subscribe
    const store = useCurrentPlayingListStore();

    // 打开页面时将localStroage中的数据存入store中
    const initializeStore = () => {
      if(localStorage.getItem('playing_list')){
        const pid = localStorage.getItem('current_playlist_id') ? JSON.parse(localStorage.getItem('current_playlist_id') as string) : '';
        const index = localStorage.getItem('current_song_index') ? Number(localStorage.getItem('current_song_index')) : 0;
        
        // TODO：打开页面，本地播放列表为空时，给一首随机歌曲，另外，需要vip或者购买专辑的无法点播的歌曲，要有提示弹窗
        store.$patch({
          playing_list: JSON.parse(localStorage.getItem('playing_list') as string), 
          current_playlist_id: pid, 
          current_song_index: index,
        });
      }
      // 加载所有数据，调用getNextSong更新nextSongId
      if(localStorage.getItem('play_mode')) {
        console.log(String(localStorage.getItem('play_mode')));
        
        play_mode.value = String(localStorage.getItem('play_mode'))
      }
      getNextSong();
    }

    // 获取指定歌曲id
    const getSongId = (index: number): string => {
      if(playing_list.value.length > 0){
        return playing_list.value[index].id;
      }
      // 当播放列表为空时，返回默认id
      else {
        return '2034187125';
      }
    }

    // 替换整个播放列表
    const changeList = async (type: string, newPlayinglistId: string, newList?: Array<any>) => {
      if(newPlayinglistId != current_playlist_id.value){  // 防止重复改变
        let templist = [];
        if(newList) {
          templist = newList;
        }
        else {
          await get<any>(`${address(type, newPlayinglistId)}`)
          .then((response) => {
            if(type == 'artist') templist = response.hotSongs;
            else templist = response.songs;
          })
          .catch((error) => {
            // 处理请求错误
            console.log('请求失败');
            console.log(error);
          });
        }
        if(templist == undefined || templist.length == 0) return;
        store.$patch({playing_list: templist, current_playlist_id: newPlayinglistId, current_song_index: 0})
        localStorage.setItem('playing_list',JSON.stringify(templist));
        localStorage.setItem('current_playlist_id',JSON.stringify(newPlayinglistId));
        localStorage.setItem('current_song_index', '0');

      }
      else {
        current_song_index.value = 0;
        localStorage.setItem('current_song_index', '0');
      }
      getNextSong();
      resetCurSong();
    }

    const resetCurSong = () => {
      cur_song_reset.value = !cur_song_reset.value;
    }

    // 清空播放列表
    const clearList = () => {
      current_playlist_id.value = '';
      playing_list.value = []
      current_song_index.value = 0;
      localStorage.setItem('playing_list','');
      localStorage.setItem('current_playlist_id','');
      localStorage.setItem('current_song_index', '0');
    }

    // 插入某首歌曲
    const insertSong = async (newSong: string) => {
      for(let i = 0; i < playing_list.value.length; i++) {
        if(playing_list.value[i].id == newSong){
          current_song_index.value = i;
          resetCurSong();
          return;
        }
      }
      await get<any>(`/song/detail?ids=${newSong}`)
        .then((response) => {
          store.$patch((state) => {
            state.playing_list.push(response.songs[0]);
            state.current_playlist_id = '';
          })
        })
        .catch((error) => {
          // 处理请求错误
          console.log('请求失败');
          console.log(error);
        });
      localStorage.setItem('playing_list', JSON.stringify(playing_list.value));
      localStorage.setItem('current_playlist_id','');
      getNextSong();
    }
    
    // 删除某首歌曲
    const deleteSong = (deleteIndex: number) => {
      if(deleteIndex < current_song_index.value) {
        store.$patch((state) => {
          state.playing_list.splice(deleteIndex, 1);
          state.current_playlist_id = '';
          state.current_song_index++;
        })
        localStorage.setItem('current_song_index', String(current_song_index.value++));
      }
      else if(deleteIndex == current_song_index.value) {
        store.$patch((state) => {
          state.playing_list.splice(deleteIndex, 1);
          state.current_playlist_id = '';
        })
        resetCurSong();
      }
      else {
        store.$patch((state) => {
          state.playing_list.splice(deleteIndex, 1);
          state.current_playlist_id = '';
        })
      }
      
      localStorage.setItem('playing_list', JSON.stringify(playing_list.value));
      localStorage.setItem('current_playlist_id','');
      getNextSong();
    }

    // 点击播放某首歌曲
    const playSong = async (songId: string) => {
      // 通过id在列表中查找需要播放的歌曲是否存在
      const index = playing_list.value.findIndex(item => item.id == songId)
      // 若不存在则获取该歌曲详情，添加到列表最后，并直接跳转到列表的最后进行播放
      if (index == -1) {
        await get<any>(`/song/detail?ids=${songId}`)
        .then((response) => {
          store.$patch((state) => {
            state.playing_list.push(response.songs[0]);
            state.current_playlist_id = '';
            state.current_song_index = state.playing_list.length - 1;
          })
          localStorage.setItem('playing_list', JSON.stringify(playing_list.value));
          localStorage.setItem('current_playlist_id','');
          localStorage.setItem('current_song_index', String(playing_list.value.length - 1));
        })
        .catch((error) => {
          // 处理请求错误
          console.log('请求失败');
          console.log(error);
        });
      }
      // 若歌曲已在列表中，则直接跳转到该位置进行播放
      else {
        store.$patch((state) => {
          state.current_song_index = index;
        })
        localStorage.setItem('current_song_index', String(index));
      }
      resetCurSong();
    }

    // 当前下标切换到下一首
    const nextCurIndex = () => {
      current_song_index.value = next_song_index.value;
      localStorage.setItem('current_song_index', String(current_song_index.value));
    }

    // 当前下标切换到下一首
    const preCurIndex = () => {
      if(current_song_index.value == 0){
          current_song_index.value = playing_list.value.length - 1;
          localStorage.setItem('current_song_index', String(current_song_index.value));
      }
      else{
        current_song_index.value = current_song_index.value - 1;
      }
    }

    // 获取下一首歌（预加载）
    const getNextSong = () => {
      // 当播放列表存在时，获取下一首歌，否则一直保持原id
      if(playing_list.value){
        // 根据播放模式判断下一首歌曲的下标
        switch (play_mode.value) {
          // 单曲循环，取回当前下标的id即可
          case 'singleloop': {
            next_song_index.value = current_song_index.value;
            break;
          }
          // 顺序播放，根据播放列表长度来判断
          case 'sequential': {
            // 当播放列表中不止一首歌曲
            if(playing_list.value.length > 1) {
              // 当前播放歌曲已经是最后一首
              if(current_song_index.value == playing_list.value.length - 1) {
                next_song_index.value = 0;
              }
              // 当前播放歌曲不是最后一首
              else {
                next_song_index.value = current_song_index.value + 1;
              }
            }
            // 当播放列表只有一首歌曲
            else {
              next_song_index.value = current_song_index.value;
            }
            break;
          }
          // 随机播放
          case 'shuffle': {
            // 如果播放列表内不止一首歌曲
            if(playing_list.value.length > 1) {
              let randomIndex = 0;
              // 取一个随机下标，当下标为当前歌曲下标时重新获取，random乘最大值可以获得区间内任何一个随机数
              do {
                randomIndex = Math.floor(Math.random() * (playing_list.value.length - 1))
              }while (randomIndex == current_song_index.value)
              // 将该下标的歌曲id交给nextSongId
              next_song_index.value = randomIndex;
            }
            // 如果播放列表内只有一首歌曲
            else {
              next_song_index.value = current_song_index.value;
            }
            break;
          }
        }
      }
      
    }

    // 改变播放模式
    const changePlayMode = (newPlayMode: string) => {
      // 通过传入的参数改变播放模式
      play_mode.value = newPlayMode;
      console.log(play_mode.value );
      
      localStorage.setItem('play_mode',newPlayMode);
      // 触发getNextSong获取新的next_song_index
      getNextSong();
    }

    const getPlayMode = () => {
      return play_mode.value;
    }

    // 获取歌曲信息
    const getSongInfo = (index: number): any => {
      return playing_list.value[index];
    }


    return {current_playlist_id, playing_list, current_song_index, next_song_index, play_mode, cur_song_reset, getSongId, initializeStore, changeList, changePlayMode, getPlayMode, getNextSong, preCurIndex, nextCurIndex, resetCurSong, insertSong, deleteSong, playSong, getSongInfo, clearList}
})