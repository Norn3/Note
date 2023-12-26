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

// 根据资源类型， 决定获取数据的地址
const address = (type: string): string => {
  let addr = '';
  switch (type) {
    case 'playlist':
      addr = `/playlist/track/all?id=${props.targetId}`;
      break;
    case 'album':
      addr = `/album?id=${props.targetId}`;
      break;
  }
  return addr;
};

// 获取包含的所有歌曲
const getSongs = async () => {
  await get<any>(`${address(props.type)}`)
    .then((response) => {
      console.log(response);

      const $ul = $('#songList').find('#songs');
      $ul.empty();
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
            listId: id++,
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

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  if (props.type != 'song') {
    getSongs();
  }
});

// 当页面的路由改变，马上重新获取信息
watch(
  () => props.targetId,
  (newId, oldId) => {
    console.log(newId, oldId);
    getSongs();
  }
);
</script>
