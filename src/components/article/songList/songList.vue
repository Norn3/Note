<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div id="songList" class="song_list">
    <ul id="title" class="title">
      <li id="num" class="serial_num"></li>
      <li id="playSong" class="click_to_play"></li>
      <li id="songName" class="name">歌曲</li>
      <li id="duration" class="duration">时长</li>
      <li id="singer" class="singer">歌手</li>
      <li id="album" class="album">专辑</li>
    </ul>
    <ul id="songs" class="songs"></ul>
    <!-- <el-table v-if="already_getting" v-loading="already_getting" :data="tableData">
      <el-table-column prop="title"/>
    </el-table> -->
    <el-text v-if="already_getting" v-loading="already_getting" class="loading"
      >Loading...</el-text
    >
    <el-backtop :right="60" :bottom="60" />
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $, { event } from 'jquery';
import { onMounted, nextTick, ref, render, h, watch } from 'vue';
import router from '../../../router/index';
import { get } from '../../../axios/insatance';

import './songList.scss';
import SongListItem from './songListItem/songListItem.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'playlist',
  },
  target_id: Number,
});

let current_song_id = 0;
const already_getting = ref(false);

// 根据资源类型， 决定获取数据的地址
// 只要调整limit就可以控制每次请求的歌曲数量，offset会根据列表项的渲染，所引起的current_song_id的自增，自动变化
const address = (type: string): string => {
  let addr = '';
  switch (type) {
    case 'playlist':
      addr = `/playlist/track/all?id=${props.target_id}&limit=50&offset=${current_song_id}`;
      break;
    case 'album':
      addr = `/album?id=${props.target_id}&limit=50&offset=${current_song_id}`;
      break;
  }
  return addr;
};

const firstGetSongs = async () => {
  const $ul = $('#songList').find('#songs');
  $ul.empty();
  current_song_id = 0;
  await getSongs();
};

// 获取歌单中的歌曲
const getSongs = async () => {
  await get<any>(`${address(props.type)}`)
    .then((response) => {
      const $ul = $('#songList').find('#songs');
      response.songs.forEach((song: any) => {
        const $li = $('<li>');
        $li.addClass('song_item');
        const li = $li[0];
        $ul.append(li);
        const singers: Array<string> = [];
        song.ar.forEach((singer: any) => {
          singers.push(singer.name);
        });
        // 此处还可以优化减少判断
        let album = '';
        let albumId = 0;
        if (props.type != 'album') {
          album = song.al.name;
          albumId = song.al.id;
        }
        render(
          h(SongListItem, {
            type: props.type,
            listId: ++current_song_id,
            songId: song.id,
            name: song.name,
            durationTime: song.dt,
            singer: singers,
            album: album,
            albumId: albumId,
          }),
          li
        );
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

// type ThrottledFunction = (...args: any[]) => void;
// 节流方法, 防止达到可以请求数据的位置（already_getting == true）之前，onBottom被频繁调用，频繁获取高度数据
const throttle = (func: () => void, delay: number) => {
  let timer: any = null;
  return (...args: any) => {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this);
        timer = null;
      }, delay);
    }
  };
};
// 触底相应函数
const isReachBottom = (): boolean => {
  // 获取可视高度（不包含滚动条宽度）
  let clientHeight = $(window).height();
  // 获取滚动高度
  let scrollTop = $(window).scrollTop();
  // 滚动条高度
  let scrollHeight = $(document).height();

  // 当窗口还差100px就到达页面底部时（因为有小数，所以触底时clientHeight + scrollTop = scrollHeight - 1）
  if (
    clientHeight &&
    scrollTop &&
    scrollHeight &&
    clientHeight + scrollTop >= scrollHeight - 501
  )
    return true;
  else return false;
};
const onScroll = async () => {
  if (!already_getting.value) {
    if (isReachBottom()) {
      already_getting.value = true;
      // 再请求下一批歌曲
      await getSongs();
      already_getting.value = false;
    }
  }
};
// 触底函数
const onReachBottom = () => {
  window.addEventListener('scroll', throttle(onScroll, 500));
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  if (props.type != 'song') {
    getSongs();
  }
  onReachBottom();
});

// 当页面的路由改变，马上重新获取信息
watch(
  () => props.target_id,
  (newId, oldId) => {
    console.log(newId, oldId);
    window.removeEventListener('scroll', throttle(onScroll, 500));
    firstGetSongs();
  }
);
</script>
