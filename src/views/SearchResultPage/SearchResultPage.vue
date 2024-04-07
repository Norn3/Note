<template>
  <main class="search_result_view">
    <section>
      <search-frame
        class="new_search"
        popper_class="popper lower"
      ></search-frame>
      <div id="searchResult" class="search_result">
        <el-tabs
          v-model="activeName"
          class="search_result_tabs"
          @tab-change="handleActiveNameChange"
        >
          <el-tab-pane label="单曲" name="song">
            <loading-state :loading="loading"></loading-state>
            <ul id="songResult" class="song_result" v-show="!loading"></ul>
          </el-tab-pane>
          <el-tab-pane label="专辑" name="album">
            <loading-state :loading="loading"></loading-state>
            <ul
              id="albumResult"
              class="pic_list album_result"
              v-show="!loading"
            ></ul>
          </el-tab-pane>
          <el-tab-pane label="歌手" name="singer">
            <loading-state :loading="loading"></loading-state>
            <ul
              id="singerResult"
              class="pic_list singer_result"
              v-show="!loading"
            ></ul>
          </el-tab-pane>
          <el-tab-pane label="歌单" name="playlist">
            <loading-state :loading="loading"></loading-state>
            <ul
              id="playlistResult"
              class="pic_list playlist_result"
              v-show="!loading"
            ></ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-pagination
        :current-page="currentPage"
        :page-size="20"
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        class="result_pagination"
      />
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
  computed,
} from 'vue';
import { useRoute } from 'vue-router';
import { get } from '../../axios/insatance';

import searchFrame from '../../components/header/search/searchFrame.vue';
import loadingState from '../../components/article/loadingState/loadingState.vue';
import songListItem from '../../components/article/songList/songListItem/songListItem.vue';
import PlayList from '../../components/article/PlayList/PlayList.vue';
import albumItem from '../../components/article/albumItem/albumItem.vue';
import singerItem from '../../components/article/singerItem/singerItem.vue';

import processSingerArray from '../../util/processSingerArray';
import createLiTag from '../../util/createLiTag';

import './SearchResultPage.scss';

// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();

// 当前搜索的分类
const activeName = ref('song');

// 是否正在加载中
const loading = ref(true);

// 分页变量
// 总搜索结果条数
const total = ref(0);
// 当前页数
const currentPage = ref(1);

const getSearchType = (): string => {
  let type = '';
  switch (activeName.value) {
    case 'song':
      type = '1';
      break;
    case 'album':
      type = '10';
      break;
    case 'singer':
      type = '100';
      break;
    case 'playlist':
      type = '1000';
      break;
  }
  return type;
};

const getTotalValue = (result: any) => {
  switch (activeName.value) {
    case 'song':
      total.value = result.songCount;
      break;
    case 'album':
      total.value = result.albumCount;
      break;
    case 'singer':
      total.value = result.artistCount;
      break;
    case 'playlist':
      total.value = result.playlistCount;
      break;
  }
};

const getListFromResult = (result: any): Array<any> => {
  let arr: Array<any> = [];
  switch (activeName.value) {
    case 'song':
      arr = result.songs;
      break;
    case 'album':
      arr = result.albums;
      break;
    case 'singer':
      arr = result.artists;
      break;
    case 'playlist':
      arr = result.playlists;
      break;
  }
  return arr;
};

const searchItem = async () => {
  loading.value = true;
  if (
    String(route.query.keyword) == '' ||
    String(route.query.keyword) == null
  ) {
    loading.value = false;
    return;
  }
  await get<any>(
    `/cloudsearch?keywords=${String(route.query.keyword)}&limit=20&offset=${
      (currentPage.value - 1) * 20
    }&type=${getSearchType()}`
  )
    .then((response) => {
      console.log(response);
      getTotalValue(response.result);
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
  const $ul = $(`#${activeName.value}Result`);
  $ul.empty();
  switch (activeName.value) {
    case 'song': {
      result.forEach((item) => {
        const li = createLiTag($ul, `${activeName.value}_result_item`);
        render(
          h(songListItem, {
            type: 'search_result',
            listId: index++,
            playlistId: '',
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
    case 'album': {
      result.forEach((item) => {
        const li = createLiTag($ul, `${activeName.value}_result_item`);
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
    case 'singer': {
      result.forEach((item) => {
        const li = createLiTag($ul, `${activeName.value}_result_item`);
        render(
          h(singerItem, {
            id: String(item.id),
            accountId: String(item.accountId),
            imgUrl: item.picUrl,
            name: item.name,
          }),
          li
        );
      });
      break;
    }
    case 'playlist': {
      result.forEach((item) => {
        const li = createLiTag($ul, `${activeName.value}_result_item`);
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
  loading.value = false;
};

const handleActiveNameChange = () => {
  currentPage.value = 1;
  searchItem();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  searchItem();
};

onMounted(() => {
  searchItem();
  // 等待页面加载结束，再调用createItem创建列表项
  sessionStorage.setItem('lastPathName', String(route.name));
  sessionStorage.setItem('lastPathQuery', JSON.stringify(route.query));
  $('.el-pagination__goto')[0].innerText = '跳转至第';
  $('.el-pagination__classifier')[0].innerText = '页';
});

watch(
  () => route.query.keyword,
  (newValue, oldValue) => {
    sessionStorage.setItem('lastPathQuery', JSON.stringify(route.query));
    currentPage.value = 1;
    searchItem();
  }
);
</script>
