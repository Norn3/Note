<script setup lang="ts">
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import { nextTick, onMounted, reactive, ref, h, render } from 'vue';
import { useRouter } from 'vue-router';
import { get } from '../axios/insatance';

import PlayListItem from '../class/PlayListItem';

import sideBar from '../components/article/sideBar/sideBar.vue';
import PlayList from '../components/article/PlayListView/PlayList.vue';

$(document).on('click', '#title', () => {
  jumpPage();
});

const router = useRouter();
const jumpPage = () => {
  router.push({
    name: 'home',
  });
};
const listId = 887271959;
const itemNum = ref(12);
let listItem: Array<number> = reactive([]);
const getSideBar = () => {
  get<any>(`/playlist/detail?id=${listId}`)
    .then((response) => {
      console.log(response);
      response.playlist.trackIds.forEach((element: any) => {
        listItem.push(element.id);
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

let uid = 571024254;
// let info: PlayListItem = reactive({
//   id: 0,
//   name: '', // 播放音质等级
//   coverImgUrl: '',
//   playCount: 0,
//   userId: 0,
// });
const createItem = () => {
  get<any>(`/user/playlist?uid=${uid}`)
    .then((response) => {
      // 处理返回的用户数据
      const playlist = response.playlist;

      // 插入元素
      let $ul = $('#myPlayLists');
      playlist.forEach((element: any) => {
        const $li = $('<li>');

        if (element.userId == uid) {
          $ul = $('#myPlayLists');
        } else {
          $ul = $('#likePlayLists');
        }
        const li = $li[0];
        $ul.append(li);
        render(h(PlayList), li); // 渲染playList组件
        // console.log($li[0]);

        // 设置组件内容
        const $image = $li.find('#image');

        $image.css('background', `url(${element.coverImgUrl}) no-repeat`);
        $image.css('background-size', 'cover');

        const $number = $image.find('#number');
        let playCount = element.playCount;
        let bit = '';
        if (playCount >= 10000) {
          playCount /= 10000;
          bit = '万';
          if (playCount >= 10000) {
            playCount /= 10000;
            bit = '亿';
          }
        }
        const text =
          bit == '' ? `${playCount}` : `${playCount.toFixed(1)}` + bit;
        $number.text(text);

        const $name = $li.find('#title');
        $name.text(element.name);
        // const $creator = $li.find('#creator')
        // if(element.userId != uid){
        //   $li.find('#creatorTitle').css('display','flex')
        //   $creator.text(`${element.creator.nickname}`);
        // }
        $li.css('margin', '10px');
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

onMounted(async () => {
  getSideBar();
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  createItem();
  // console.log(father.itemNum);
});
</script>

<template>
  <div class="play_view">
    <article>
      <aside>
        <side-bar :itemNum="itemNum" :listItem="listItem"></side-bar>
      </aside>
      <section>
        <div id="createByMe" class="playListTitle"><h1>我创建的歌单</h1></div>
        <ul id="myPlayLists" class="playLists"></ul>
        <div id="likeByMe" class="playListTitle"><h1>我收藏的歌单</h1></div>
        <ul id="likePlayLists" class="playLists"></ul>
      </section>
    </article>
  </div>
</template>
<style lang="scss" scoped>
.play_view {
  position: relative;
  width: 80vw;
  min-height: 92vh;
  height: 100%;
  background-color: rgb(237, 250, 255);
}
article {
  position: relative;
  min-height: 100%;
  height: 100%;
  width: 100%;
  display: flex;
}
aside {
  position: fixed;
  min-height: 92vh;
  width: 20vw;
  overflow-y: auto;
  overflow-x: hidden;
}
section {
  position: relative;
  height: 100%;
  width: 60vw;
  left: 25%;
  .playListTitle {
    margin: 20px;
    border-bottom: 2px solid rgb(255, 189, 189);
    h1 {
      position: relative;
      right: 37.5%;
      display: inline-block;
      margin: 10px;
      font-weight: 500;
    }
  }
  .playLists {
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
