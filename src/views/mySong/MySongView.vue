<template>
  <div class="play_view">
    <main>
      <aside>
        <side-bar :listItem="listItem" listType="playlist"></side-bar>
      </aside>
      <section>
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>
<style lang="scss" scoped>
.play_view {
  position: relative;
  width: 75vw;
  min-height: 92vh;
  height: 100%;
  background-color: rgb(255, 255, 255);
}
main {
  position: relative;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  display: flex;
  // border-right: #b4c7c9 solid 1px;
  // border-left: #b4c7c9 solid 1px;
  box-shadow: 0 0 3px 0 #4e53548d;
}
aside {
  position: fixed;
  min-height: 92vh;
  width: 15vw;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgb(209, 214, 219);
  }
}
section {
  position: relative;
  height: 100%;
  width: 60vw;
  left: 15vw;
  .playListTitle {
    position: relative;
    height: 4em;
    margin: 20px;
    border-bottom: 2px solid rgb(114, 152, 233);
    h1 {
      position: absolute;
      left: 10px;
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

<script setup lang="ts">
// 展示歌单列表、排行榜列表等信息，有侧边栏

import $ from 'jquery';
import { reactive, onBeforeMount } from 'vue';
import { get } from '../../axios/insatance';

import PlaylistItemClass from '../../class/PlaylistItemClass';

import SideBar from '../../components/article/sideBar/sideBar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const info_type = route.query.info_type;

let listItem: Array<PlaylistItemClass> = reactive([]);
const getSideBar = () => {
  get<any>(`/user/playlist?uid=${uid}&limit=100`)
    .then((response) => {
      console.log(response);
      response.playlist.forEach((element: PlaylistItemClass) => {
        listItem.push(element);
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

let uid = 571024254;
// let info: PlaylistItem = reactive({
//   id: 0,
//   name: '', // 播放音质等级
//   coverImgUrl: '',
//   playCount: 0,
//   userId: 0,
// });
// const createItem = () => {
//   get<any>(`/user/playlist?uid=${uid}`)
//     .then((response) => {
//       // 处理返回的用户数据
//       // console.log(response);

//       const playlist = response.playlist;

//       // 插入元素
//       let $ul = $('#myPlaylists');
//       playlist.forEach((element: any) => {
//         const $li = $('<li>');

//         if (element.userId == uid) {
//           $ul = $('#myPlaylists');
//         } else {
//           $ul = $('#likePlaylists');
//         }
//         const li = $li[0];
//         $ul.append(li);
//         render(h(Playlist), li); // 渲染playList组件
//         // console.log($li[0]);

//         // 设置组件内容
//         const $image = $li.find('#image');

//         $image.css('background', `url(${element.coverImgUrl}) no-repeat`);
//         $image.css('background-size', 'cover');

//         const $number = $image.find('#number');
//         let playCount = element.playCount;
//         let bit = '';
//         if (playCount >= 10000) {
//           playCount /= 10000;
//           bit = '万';
//           if (playCount >= 10000) {
//             playCount /= 10000;
//             bit = '亿';
//           }
//         }
//         const text =
//           bit == '' ? `${playCount}` : `${playCount.toFixed(1)}` + bit;
//         $number.text(text);

//         const $name = $li.find('#title');
//         $name.text(element.name);
//         // const $creator = $li.find('#creator')
//         // if(element.userId != uid){
//         //   $li.find('#creatorTitle').css('display','flex')
//         //   $creator.text(`${element.creator.nickname}`);
//         // }
//         $li.css('margin', '10px');
//       });
//     })
//     .catch((error) => {
//       // 处理请求错误
//       console.log('请求失败');
//       console.log(error);
//     });
// };
onBeforeMount(() => {
  getSideBar();
});

// onMounted(async () => {
//   // 等待页面加载结束，再调用createItem创建列表项
//   await nextTick();
// });
</script>
