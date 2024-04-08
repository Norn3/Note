<template>
  <div id="playlistlist" class="playlist_list">
    <div class="list_description">
      <h2 class="title">{{ title }}</h2>
      <ul
        class="category_list"
        v-if="props.type == 'hot' || props.type == 'personal'"
      ></ul>
    </div>
    <loading-state :loading="loading"></loading-state>
    <ul :id="props.type + 'PlaylistContainer'" class="playlist_container"></ul>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
import $ from 'jquery';
import { ref, computed, h, render, onBeforeMount, onMounted } from 'vue';
import { get } from '../../../axios/insatance';

import './playlistList.scss';

import PlayList from '../PlayList/PlayList.vue';
import loadingState from '../loadingState/loadingState.vue';
import createLiTag from '../../../util/createLiTag';

const props = defineProps({
  type: String,
  playlists: {
    type: Array<any>,
    default: [],
  },
});

const loading = ref(true);

const title = ref('');
const address = ref('');

const computedData = () => {
  switch (props.type) {
    case 'hot': {
      title.value = '热门推荐';
      address.value = `/personalized?limit=8`;
      break;
    }
    case 'personal': {
      title.value = '个性化推荐';
      address.value = `/recommend/resource`;
      break;
    }
    case 'myCreate': {
      title.value = '我创建的歌单';
      break;
    }
    case 'myFavorite': {
      title.value = '我收藏的歌单';
      break;
    }
  }
};

const createItem = async () => {
  let $ul = $(`#${props.type}PlaylistContainer`);
  if (props.type == 'hot' || props.type == 'personal') {
    await get<any>(address.value)
      .then((response) => {
        console.log(response);
        // 插入元素
        const playlists =
          props.type == 'hot'
            ? response.result
            : response.recommend.slice(0, 4);
        playlists.forEach((element: any) => {
          const li = createLiTag($ul);
          render(
            h(PlayList, {
              type: 'playlist',
              id: String(element.id),
              imgUrl: element.picUrl,
              playCount:
                props.type == 'hot' ? element.playCount : element.playcount,
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
  } else {
    // 插入元素
    props.playlists.forEach((element: any) => {
      const li = createLiTag($ul);
      render(
        h(PlayList, {
          type: 'playlist',
          id: String(element.id),
          imgUrl: element.coverImgUrl,
          playCount: element.playCount,
          title: element.name,
          creator: '',
          showCreator: false,
        }),
        li
      ); // 渲染playList组件
    });
  }

  loading.value = false;
};

onMounted(() => {
  computedData();
  createItem();
});
</script>
