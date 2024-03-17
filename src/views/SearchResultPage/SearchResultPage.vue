<template>
  <main class="search_result_view">
    <section>
      <span>{{ String(route.query.keyword) }}</span>
      <search-frame
        class="new_search"
        popper_class="popper lower"
      ></search-frame>
      <div id="searchResult" class="search_result">
        <el-tabs
          v-model="activeName"
          class="my_tabs"
          @tab-change="handleChange"
        >
          <el-tab-pane label="单曲" name="1">
            <ul id="songResult" class="song_result"></ul>
          </el-tab-pane>
          <el-tab-pane label="专辑" name="10"> </el-tab-pane>
          <ul id="albumResult" class="album_result"></ul>
          <el-tab-pane label="歌手" name="100"> </el-tab-pane>
          <el-tab-pane label="歌单" name="1000">
            <ul id="playlistResult" class="playlist_result"></ul>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </main>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  h,
  render,
  onUpdated,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { get } from '../../axios/insatance';

import searchFrame from '../../components/header/search/searchFrame.vue';
import songListItem from '../../components/article/songList/songListItem/songListItem.vue';
import PlayList from '../../components/article/PlayList/PlayList.vue';
import albumItem from '../../components/article/albumItem/albumItem.vue';

import processSingerArray from '../../util/processSingerArray';

import './SearchResultPage.scss';

// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();

const activeName = ref('1');

const getListFromResult = (result: any): Array<any> => {
  let arr: Array<any> = [];
  switch (activeName.value) {
    case '1':
      arr = result.songs;
      break;
    case '10':
      arr = result.albums;
      break;
    case '1000':
      arr = result.playlists;
      break;
  }
  return arr;
};

const searchItem = async () => {
  await get<any>(
    `/cloudsearch?keywords=${String(
      route.query.keyword
    )}&limit=20&offset=0&type=${activeName.value}`
  )
    .then((response) => {
      console.log(response);
      renderResult(getListFromResult(response.result));
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

const renderResult = (result: Array<any>) => {
  let index = 0;
  switch (activeName.value) {
    case '1': {
      const $ul = $('#songResult');
      result.forEach((item) => {
        const $li = $('<li>');
        $li.addClass('song_result_item');
        const li = $li[0];
        $ul.append(li);
        render(
          h(songListItem, {
            type: 'search_result',
            listId: index++,
            songId: item.id,
            name: item.name,
            durationTime: item.dt,
            singer: processSingerArray(item.ar),
            album: item.al.name,
            albumId: item.al.id,
          }),
          li
        );
      });
      break;
    }
    case '10': {
      const $ul = $('#albumResult');
      result.forEach((item) => {
        const $li = $('<li>');
        $li.addClass('album_result_item');
        const li = $li[0];
        $ul.append(li);
        render(
          h(albumItem, {
            id: String(item.id),
            imgUrl: item.picUrl,
            title: item.name,
            artists: processSingerArray(item.artists),
          }),
          li
        );
      });
      break;
    }
    case '1000': {
      const $ul = $('#playlistResult');
      result.forEach((item) => {
        const $li = $('<li>');
        $li.addClass('playlist_result_item');
        const li = $li[0];
        $ul.append(li);
        render(
          h(PlayList, {
            type: 'playlist',
            id: String(item.id),
            imgUrl: item.coverImgUrl,
            playCount: item.playCount,
            title: item.name,
            creator: item.creator.nickname,
            showCreator: true,
          }),
          li
        );
      });
      break;
    }
  }
};

const handleChange = () => {
  searchItem();
};
onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await searchItem();
});

watch(
  () => route.query.keyword,
  (newValue, oldValue) => {
    searchItem();
  }
);
</script>
../../axios/insatance../../util/processSingerArray
