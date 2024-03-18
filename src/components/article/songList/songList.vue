<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div id="songList" class="song_list">
    <ul id="songlistTitle" class="title">
      <li id="num" class="serial_num"></li>
      <li id="playSong" class="click_to_play"></li>
      <li id="songName" class="name">歌曲</li>
      <li id="duration" class="duration">时长</li>
      <li id="singer" class="singer">歌手</li>
      <li id="album" class="album" v-if="String(props.type) != 'album'">
        专辑
      </li>
    </ul>
    <ul id="songs" class="songs"></ul>
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
import songListItem from './songListItem/songListItem.vue';

import { address } from '../../../util/getSongListAddress';
import processSingerArray from '../../../util/processSingerArray';
import createLiTag from '../../../util/createLiTag';

const props = defineProps({
  type: {
    type: String,
    default: 'playlist',
  },
  target_id: String,
});

let current_song_id = 0;
const limit = 50;
let gotAllSongs = ref(false);
const already_getting = ref(false);

const firstGetSongs = async () => {
  const $ul = $('#songList').find('#songs');
  $ul.empty();
  current_song_id = 0;
  already_getting.value = true;
  await getSongs();
  already_getting.value = false;
};

// 获取歌单中的歌曲
const getSongs = async () => {
  await get<any>(
    `${address(props.type, props.target_id as string, limit, current_song_id)}`
  )
    .then((response) => {
      if (response.songs.length < limit) gotAllSongs.value = true;
      const $ul = $('#songList').find('#songs');
      response.songs.forEach((song: any) => {
        const li = createLiTag($ul, 'song_item');
        // 此处还可以优化减少判断
        let album = '';
        let albumId = 0;
        if (props.type != 'album') {
          album = song.al.name;
          albumId = song.al.id;
        }
        render(
          h(songListItem, {
            type: props.type,
            listId: ++current_song_id,
            songId: song.id,
            name: song.name,
            durationTime: song.dt,
            singer: processSingerArray(song.ar),
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
// 判断是否不是正处于获取中的状态，并且已滚动到判定线以下
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

// 用变量储存throttle返回的函数，确保绑定和移除监听的对象是同一个
const throttleReturn = throttle(onScroll, 500);

onMounted(async () => {
  if (props.type != 'song') {
    firstGetSongs();
  }
  window.addEventListener('scroll', throttleReturn);
});

// 当页面的路由改变，马上重新获取信息
watch(
  () => props.target_id,
  (newId, oldId) => {
    // 保证页面内只有一个监听器
    window.removeEventListener('scroll', throttleReturn);
    window.addEventListener('scroll', throttleReturn);
    gotAllSongs.value = false;
    if (props.type != 'song') {
      firstGetSongs();
    }
  }
);

// 当已获取所有的歌曲，移除监听，不再滚动加载更多
watch(
  () => gotAllSongs.value,
  () => {
    if (gotAllSongs.value) {
      window.removeEventListener('scroll', throttleReturn);
    }
  }
);
</script>
