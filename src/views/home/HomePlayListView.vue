<template>
  <div class="home_playlist_view">
    <main>
      <section>
        <div id="playlistCategory" class="playlist_category">
          <h1>{{ route.query.category }}</h1>
          <button id="selectCate" class="select_cate" @click="showCate">
            选择分类
          </button>
          <select-category
            id="selectCategory"
            class="select_category"
          ></select-category>
        </div>
        <el-text v-if="loading" v-loading="loading" class="loading"
          >Loading...</el-text
        >
        <ul id="categorizedPlaylists" class="categorized_playlists"></ul>
      </section>
    </main>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
import $ from 'jquery';
import {
  h,
  render,
  onBeforeMount,
  onBeforeUpdate,
  onUnmounted,
  onBeforeUnmount,
  ref,
} from 'vue';
import { get } from '../../axios/insatance';
import { useRoute } from 'vue-router';

import PlayList from '../../components/article/PlayList/PlayList.vue';
import selectCategory from '../../components/article/selectCategory/selectCategory.vue';

import processPlayCount from '../../util/processPlayCount';

import './HomePlaylistView.scss';

const loading = ref(true);

const showCate = () => {
  $('#selectCategory').css('display', 'block');
};

const route = useRoute();

const createItem = async () => {
  let address = '/top/playlist?limit=50';
  if (route.query.category != '全部') {
    address += `&cat=${route.query.category}`;
  }
  await get<any>(address)
    .then((response) => {
      // 处理返回的用户数据
      const playlist = response.playlists;

      // 插入元素
      let $ul = $('#categorizedPlaylists');
      playlist.forEach((element: any) => {
        const $li = $('<li>');

        const li = $li[0];
        $ul.append(li);
        render(
          h(PlayList, {
            type: 'playlist',
            id: String(element.id),
            imgUrl: element.coverImgUrl,
            playCount: element.playCount,
            title: element.name,
            creator: element.creator.nickname,
            showCreator: true,
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

const offset = 0;
const updateItem = async () => {
  let address = `/top/playlist?limit=50&offset=${offset}`;
  if (route.query.category != '全部') {
    address += `&cat=${route.query.category}`;
  }
  await get<any>(address)
    .then((response) => {
      // 处理返回的用户数据
      const playlist = response.playlists;

      // 插入元素
      let $li_list = $('#categorizedPlaylists li');
      let current_li = 0;
      playlist.forEach((element: any) => {
        const $li = $($li_list[current_li]);

        // 设置组件内容(需要动态props)
        $li.find('#playlist').attr({
          info: String(element.id),
          imgUrl: element.coverImgUrl,
          playCount: element.playCount,
          title: element.name,
          creator: element.creator.nickname,
        });
        $li.find('#playlist').attr('info', String(element.id));

        const $image = $li.find('#image');

        $image.css('background-image', `url(${element.coverImgUrl})`);

        const $number = $image.find('#number');
        const text = processPlayCount(element.playCount);
        $number.text(text);

        $li.find('#title').text(element.name);
        $li.find('#creator').text(`${element.creator.nickname}`);

        current_li++;
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

onBeforeMount(() => {
  createItem();
  $(document).on('click', (event) => {
    const $selectCategory = $('#selectCategory');
    const $button = $('#selectCate');

    if (
      !$selectCategory.is(event.target as unknown as HTMLElement) &&
      !$button.is(event.target as unknown as HTMLElement) &&
      !$selectCategory.has(event.target as unknown as HTMLElement).length
    ) {
      $selectCategory.css('display', 'none');
    }
  });
});

onBeforeUpdate(() => {
  $('#selectCategory').css('display', 'none');
  updateItem();
});
</script>
