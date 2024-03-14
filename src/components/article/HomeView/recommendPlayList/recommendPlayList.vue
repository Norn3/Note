<template>
  <div id="recommendPlaylist" class="recommend_playlist">
    <div class="rec_description">
      <h2 class="title">{{ category }}</h2>
      <ul class="category_list"></ul>
    </div>
    <el-text v-if="loading" v-loading="loading" class="loading"
      >Loading...</el-text
    >
    <ul :id="props.type + 'PlaylistList'" class="playlist_list"></ul>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
import $ from 'jquery';
import { ref, computed, h, render, onBeforeMount } from 'vue';
import { get } from '../../../../axios/insatance';

import './recommendPlaylist.scss';

import PlayList from '../../PlayList/PlayList.vue';

const props = defineProps({
  type: String,
});

const loading = ref(true);

const playlist_num = computed(() => {
  if (props.type == 'hot') return 8;
  else return 4;
});

const category = computed(() => {
  if (props.type == 'hot') return '热门推荐';
  else return '个性化推荐';
});

const address = computed(() => {
  if (props.type == 'hot') return `/personalized?limit=${playlist_num.value}`;
  // TODO: 此处还需修改为个性化推荐
  else return `/personalized?limit=${playlist_num.value}`;
});

const createItem = async () => {
  await get<any>(address.value)
    .then((response) => {
      console.log(response);
      const playlist = response.result;

      // 插入元素
      let $ul = $(`#${props.type}PlaylistList`);
      playlist.forEach((element: any) => {
        const $li = $('<li>');

        const li = $li[0];
        $ul.append(li);
        render(
          h(PlayList, {
            type: 'playlist',
            id: String(element.id),
            imgUrl: element.picUrl,
            playCount: element.playCount,
            title: element.name,
            creator: '',
            showCreator: false,
          }),
          li
        ); // 渲染playList组件
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
  loading.value = false;
};

onBeforeMount(async () => {
  createItem();
});
</script>
