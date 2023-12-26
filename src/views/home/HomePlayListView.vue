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
        <ul id="categorizedPlaylists" class="categorized_playlists"></ul>
      </section>
    </main>
  </div>
</template>
<style lang="scss" scoped>
@import '../../mainStyle.scss';
.home_playlist_view {
  position: relative;
  width: 100%;
  min-height: 92vh;
  height: 100%;
  background-color: rgb(255, 255, 255);
}
main {
  position: relative;
  min-height: 100%;
  height: 100%;
  display: flex;
  box-shadow: 0 0 3px 0 #4e53548d;
}
aside {
  position: relative;
  min-height: 92vh;
  width: 25%;
}
section {
  position: relative;
  height: 100%;
  min-height: 92vh;
  width: 100%;
  margin: 0 auto;
  .playlist_category {
    margin: 20px;
    border-bottom: 2px solid $audioCurrentState;
    display: flex;
    h1 {
      position: relative;
      display: inline-block;
      margin: 10px;
      margin-left: 40px;
      font-weight: 500;
    }
    button.select_cate {
      display: flex;
      justify-content: center;
      height: 30px;
      width: 90px;
      padding: 4px;
      margin: auto 10px auto;
      border: 1px solid #665f4f33;
      background-color: #faff9b72;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      &::after {
        content: url('../../assets/icons/arrow.svg');
        padding: 2px 0 0 5px;
      }

      &:hover {
        background-color: #faff9b;
      }

      &:focus {
        border: 1px solid #89723cad;
        outline: 0;
      }
    }
    .select_category {
      top: 80px;
      display: none;
    }
  }
  .categorized_playlists {
    box-sizing: border-box;
    height: auto;
    width: 100%;
    padding: 0 2%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    content-visibility: auto;
  }
}
</style>
<script setup lang="ts">
import $ from 'jquery';
import { h, render, onBeforeMount, onBeforeUpdate } from 'vue';
import { get } from '../../axios/insatance';
import { useRoute } from 'vue-router';

import PlayList from '../../components/article/PlayList/PlayList.vue';
import selectCategory from '../../components/article/selectCategory/selectCategory.vue';

import processPlayCount from '../../util/processPlayCount';

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
            info: String(element.id),
            imgUrl: element.coverImgUrl,
            playCount: element.playCount,
            title: element.name,
            creator: element.creator.nickname,
            showCreator: true,
          }),
          li
        ); // 渲染playList组件

        $li.css('margin', '10px');
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
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
});

onBeforeUpdate(() => {
  $('#selectCategory').css('display', 'none');
  updateItem();
});
</script>
