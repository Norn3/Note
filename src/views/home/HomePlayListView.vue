<template>
  <div class="home_playlist_view">
    <main>
      <section>
        <div id="playlistCategory" class="playlistCategory"><h1>全部</h1></div>
        <ul id="categorizedPlaylists" class="categorizedPlaylists"></ul>
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
  .playlistCategory {
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
  }
  .categorizedPlaylists {
    box-sizing: border-box;
    height: auto;
    width: 100%;
    padding: 0 2%;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    content-visibility: auto;
  }
}
</style>

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
  onBeforeMount,
} from 'vue';
import { get } from '../../axios/insatance';

import PlayList from '../../components/article/PlayListView/PlayList.vue';
import processValue from '../../util/processValue';

let uid = 571024254;
const createItem = () => {
  get<any>(`/top/playlist`)
    .then((response) => {
      console.log(response);

      // 处理返回的用户数据
      const playlist = response.playlists;

      // 插入元素
      let $ul = $('#categorizedPlaylists');
      playlist.forEach((element: any) => {
        const $li = $('<li>');

        const li = $li[0];
        $ul.append(li);
        render(h(PlayList, { info: String(element.id) }), li); // 渲染playList组件

        // 设置组件内容
        const $image = $li.find('#image');

        $image.css('background', `url(${element.coverImgUrl}) no-repeat`);
        $image.css('background-size', 'cover');

        const $number = $image.find('#number');
        const text = processValue(element.playCount);
        $number.text(text);

        const $name = $li.find('#title');
        $name.text(element.name);
        const $creator = $li.find('#creator');
        if (element.userId != uid) {
          $li.find('#creatorTitle').css('display', 'flex');
          $creator.text(`${element.creator.nickname}`);
        }
        $li.css('margin', '10px');
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};
onBeforeMount(async () => {
  createItem();
});
// onMounted(async () => {
//   // 等待页面加载结束，再调用createItem创建列表项
//   await nextTick();
//   createItem();
//   // console.log(father.itemNum);
// });
</script>
