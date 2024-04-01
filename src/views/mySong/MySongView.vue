<template>
  <div class="play_view">
    <div id="logoutSongView" class="logout_song_view" v-show="!isLogin">
      <div class="please_log_text">请先登录以查看更多内容</div>
      <!-- TODO：此处按钮应该换成自制的，目前样式还不够完美 -->
      <el-button size="large" color="#9aceff" @click="showLoginEntry"
        >点击登录</el-button
      >
    </div>
    <main v-show="isLogin">
      <aside>
        <side-bar :checkId="checkPlaylist" listType="playlist"></side-bar>
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

  .logout_song_view {
    position: relative;
    top: 30vh;
    .please_log_text {
      margin-bottom: 50px;
      font-size: larger;
    }
  }
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
import { reactive, onBeforeMount, watch, ref } from 'vue';
import { get } from '../../axios/insatance';

// import PlaylistItemClass from '../../class/PlaylistItemClass';

import { useLoginStateStore } from '../../stores/loginState';
import { useuserPlaylistStore } from '../../stores/userPlaylist';

import SideBar from '../../components/article/sideBar/sideBar.vue';
import { useRouter } from 'vue-router';

const isLogin = ref(false);

const router = useRouter();

const loginStore = useLoginStateStore();
const userPlaylistStore = useuserPlaylistStore();

const checkPlaylist = ref('');

// 获取“我的音乐”页面的首个歌单
const getPid = (): string => {
  let pid = '';
  if (userPlaylistStore.getCreateList().length > 0) {
    pid = userPlaylistStore.getCreateList()[0].id;
  } else if (userPlaylistStore.getLikeList().length > 0) {
    pid = userPlaylistStore.getLikeList()[0].id;
  }
  return pid;
};

// 根据获取到的pid跳转到myPlaylistInfo
const jumpPage = (pid: string) => {
  router.push({ name: 'myPlaylistInfo', query: { id: pid } });
  sessionStorage.setItem('lastPathName', 'myPlaylistInfo');
  sessionStorage.setItem('lastPathQuery', JSON.stringify({ id: pid }));
};

// 根据登录状态渲染页面
const renderPage = (loginState: boolean) => {
  if (loginState) {
    isLogin.value = true;
    let pid = '';
    if (
      sessionStorage.getItem('lastPathName') == 'myPlaylistInfo' &&
      sessionStorage.getItem('lastPathQuery') != null
    ) {
      pid = JSON.parse(sessionStorage.getItem('lastPathQuery') as string).id;
    } else {
      pid = getPid();
    }
    checkPlaylist.value = pid;
    jumpPage(pid);
  } else {
    isLogin.value = false;
  }
};

// 如果在MySongView里执行了刷新操作，则重新进行页面渲染
watch(
  () => loginStore.already_login,
  (newValue, oldValue) => {
    renderPage(newValue);
  }
);

// 根据点击“我的音乐”那一刻的登录状态进行页面渲染
onBeforeMount(() => {
  renderPage(loginStore.already_login);
});

// 点击登录入口，登录并跳转回首页
const showLoginEntry = () => {
  loginStore.showLoginEntry();
};
</script>
