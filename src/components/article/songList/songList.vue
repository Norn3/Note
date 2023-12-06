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
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $, { event } from 'jquery';
import { onMounted, nextTick, ref, render, h } from 'vue';
import router from '../../../router/index';
import { get } from '../../../axios/insatance';

import processSongDuration from '../../../util/processSongDuration'; // 处理时长

import './songList.scss';
import SongListItem from './songListItem/songListItem.vue';

const props = defineProps({
  targetId: Number,
});

let sId = 0;

const jumpPage = () => {
  console.log(router);

  router.push({
    name: 'Info',
    query: { id: sId },
  });
};

// 获取包含的所有歌曲
const getSongs = async () => {
  await get<any>(`/playlist/track/all?id=${props.targetId}`)
    .then((response) => {
      console.log(response);
      const $ul = $('#songList').find('#songs');
      let id = 1;
      response.songs.forEach((song: any) => {
        const $li = $('<li>');
        $li.addClass('song_item');
        const li = $li[0];
        $ul.append(li);
        const singers: Array<string> = [];
        song.ar.forEach((singer: any) => {
          singers.push(singer.name);
        });
        render(
          h(SongListItem, {
            listId: id++,
            songId: song.id,
            name: song.name,
            durationTime: song.dt,
            singer: singers,
            album: song.al.name,
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

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  getSongs();
});
</script>
