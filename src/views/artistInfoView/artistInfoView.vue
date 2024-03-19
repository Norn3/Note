<template>
  <main class="artist_info_view">
    <section>
      <ul id="artistNameList" class="artist_name_list">
        <li id="artistName" class="artist_name">{{ artist_name }}</li>
        <li id="artistAlias" class="artist_alias" v-if="artist_alias">
          别名：{{ artist_alias }}
        </li>
      </ul>

      <div id="artistImgContainer" class="artist_img_container"></div>
      <el-tabs
        v-model="activeName"
        class="artist_tabs"
        @tab-change="handleActiveNameChange"
      >
        <el-tab-pane label="热门单曲" name="hotsongs">
          <song-list
            type="artist"
            :target_id="String(route.query.id)"
          ></song-list>
        </el-tab-pane>
        <el-tab-pane label="所有专辑" name="albums">Config</el-tab-pane>
        <el-tab-pane label="艺人介绍" name="description">Role</el-tab-pane>
      </el-tabs>
    </section>
  </main>
</template>
<style lang="scss" scoped>
.artist_info_view {
  position: relative;
  width: 75vw;
  min-height: 92vh;
  height: 100%;
  padding: 0 0 50px 0;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 3px 0 #4e53548d;

  section {
    position: relative;
    min-height: 100vh;
    height: 100%;
    width: 70vw;
    margin: 0 auto;

    .artist_name_list {
      display: flex;
      align-items: flex-end;

      .artist_name {
        font-size: 2em;
        font-weight: 500;
      }
      .artist_alias {
        padding-left: 10px;
        font-size: 1.2em;
        color: gray;
      }
    }

    .artist_img_container {
      width: 70%;
      height: 400px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
</style>

<script setup lang="ts">
// 展示歌曲、歌单等资源的信息，无侧边栏
import $ from 'jquery';

// import { useRoute } from 'vue-router'
import { useRoute } from 'vue-router';
import { get } from '../../axios/insatance';

import InfoPage from '../../components/article/InfoPage/InfoPage.vue';
import songList from '../../components/article/songList/songList.vue';
import { nextTick, onMounted, ref } from 'vue';
// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();

const activeName = ref('hotsongs');

const artist_name = ref('');
const artist_alias = ref('');
const artist_img = ref('');

const handleActiveNameChange = () => {
  console.log(activeName);
};

const processAlias = (alias: Array<string>): string => {
  let str = '';
  alias.forEach((element) => {
    if (str == '') {
      str += element;
    } else {
      str += '/' + element;
    }
  });
  return str;
};

const getInfo = async () => {
  console.log(`/artist/album?id=${route.query.id}`);

  await get<any>(`/artists?id=${route.query.id}`)
    .then((response) => {
      console.log(response);
      const artist = response.artist;
      artist_name.value = artist.name;
      artist_alias.value = processAlias(artist.alias);
      artist_img.value = artist.picUrl;
      $('#artistImgContainer').css('background-image', `url(${artist.picUrl})`);
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

getInfo();
</script>
