<template>
  <div class="account_view">
    <main>
      <section>
        <div id="userInfoContainer" class="user_info_container">
          <div id="userAvatar" class="user_avatar"></div>
          <div id="userName" class="user_name">{{ userName }}</div>
          <div id="userLevel" class="user_level">{{ 'Lv' + userLevel }}</div>
          <div id="userGender" class="user_gender">{{ userGender }}</div>
          <div id="userAddress" class="user_address">
            {{ userProvince + '-' + userCity }}
          </div>
          <div id="userAge" class="user_age">{{ userAge }}</div>
          <div id="userCreateDays" class="user_create_days">
            {{ '这是您加入我们的第' + userCreateDays + '天' }}
          </div>
          <div id="userListenedSongs" class="user_listened_songs">
            {{ '您已听歌' + userListenedSongs + '首' }}
          </div>
        </div>
        <div
          id="personalPlaylist"
          class="personal_playlist"
          v-if="createList.length || faroviteList.length"
        >
          <playlistList
            v-if="createList.length"
            type="myCreate"
            :playlists="createList"
          ></playlistList>
          <playlistList
            v-if="faroviteList.length"
            type="myFavorite"
            :playlists="faroviteList"
          ></playlistList>
          <noData v-else></noData>
        </div>
      </section>
    </main>
  </div>
</template>
<style lang="scss" scoped>
@import '../../mainStyle.scss';
.account_view {
  position: relative;
  width: 100%;
  min-height: 92vh;
  height: 100%;
  background-color: rgb(255, 255, 255);
}
main {
  position: relative;
  min-height: 92vh;
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
  top: 10vh;
  height: 100%;
  min-height: 92vh;
  width: 100%;
  margin: 0 auto;

  .user_info_container {
    display: grid;
    padding: 0 5vw;

    .user_avatar {
      width: 10vw;
      height: 21.8vh;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>
<script setup lang="ts">
// TODO：后续把这个页面改成个人主页，accountHomeView内用vue router指向这一页，用userId作为参数传入
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
import { useRouter } from 'vue-router';
import { get } from '../../axios/insatance';

import { useLoginStateStore } from '../../stores/loginState';

import playlistList from '../../components/article/playlistList/playlistList.vue';
import noData from '../../components/article/noData/noData.vue';

const loginState = useLoginStateStore();
const uid = loginState.getProfile().userId;

const userName = ref('');
const userLevel = ref('');
const userGender = ref('');
const userProvince = ref('');
const userCity = ref('');
const userAge = ref('');
const userCreateDays = ref('');
const userListenedSongs = ref('');

const createList = ref([]);
const faroviteList = ref([]);

const getPlaylists = (uid: string) => {
  get<any>(`/user/playlist?uid=${uid}`)
    .then((response) => {
      const playlist = response.playlist;
      let slice = 0;
      for (let element of playlist) {
        if (element.userId != uid) break;
        slice++;
      }
      createList.value = playlist.slice(0, slice);
      faroviteList.value = playlist.slice(slice, playlist.length);
      console.log(createList.value);
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

const getInfo = (uid: string) => {
  get<any>(`/user/detail?uid=${uid}`)
    .then((response) => {
      console.log(response);
      $('#userAvatar').css(
        'background-image',
        `url(${response.profile.avatarUrl})`
      );
      userName.value = response.profile.nickname;
      userLevel.value = response.level;
      if (response.profile.gender == 0) {
        userGender.value = '保密';
      } else {
        userGender.value = response.profile.gender == 1 ? '男' : '女';
      }
      userProvince.value = response.profile.province;
      userCity.value = response.profile.city;
      userAge.value = String(new Date(response.profile.birthday));
      userCreateDays.value = response.createDays;
      userListenedSongs.value = response.listenSongs;
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

onMounted(() => {
  getInfo(uid);
  getPlaylists(uid);
});
</script>
