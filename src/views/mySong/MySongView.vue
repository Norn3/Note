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
  margin: 0;

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
import $ from 'jquery';
import { reactive, onBeforeMount, watch } from 'vue';
import { get } from '../../axios/insatance';

import PlaylistItemClass from '../../class/PlaylistItemClass';

import { useLoginStateStore } from '../../stores/loginState';

import SideBar from '../../components/article/sideBar/sideBar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginStore = useLoginStateStore();

let userId = loginStore.getLoginState() ? loginStore.getProfile().userId : '1';

// TODO: 未登录应该不允许跳转，此页面要改

let listItem: Array<PlaylistItemClass> = reactive([]);

const getSideBar = () => {
  console.log(userId);

  get<any>(`/user/playlist?uid=${userId}&limit=100`)
    .then((response) => {
      console.log(response);
      // 先清空listItem
      listItem.splice(0, listItem.length);
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

// 获取“我的音乐”页面的首个歌单
const getPid = async (): Promise<number> => {
  let pid = 1;
  await get<any>(`/user/playlist?uid=${userId}`)
    .then((response) => {
      pid = response.playlist[0].id;
    })
    .catch((error) => {
      // 处理请求错误
      console.log('获取首个歌单id失败');
      console.log(error);
    });
  return pid;
};

// 根据获取到的pid跳转到myPlaylistInfo
const jumpPage = (pid: number) => {
  router.push({ name: 'myPlaylistInfo', query: { id: pid } });
  sessionStorage.setItem('lastPathName', 'myPlaylistInfo');
  sessionStorage.setItem('lastPathQuery', JSON.stringify({ id: pid }));
};

// 渲染页面
const renderPage = async () => {
  getSideBar();
  let pid = await getPid();
  jumpPage(pid);
};

// 如果在MySongView里执行了刷新操作，则重新获取userId并渲染页面
watch(
  () => loginStore.already_login,
  (newValue, oldValue) => {
    userId = newValue ? loginStore.getProfile().userId : '1';
    renderPage();
  }
);

// 根据点击“我的音乐”那一刻的userId渲染页面
onBeforeMount(() => {
  renderPage();
});
</script>
