<template>
  <main class="artist_info_view">
    <section>
      <ul id="artistNameList" class="artist_name_list">
        <li id="artistName" class="artist_name">{{ artist_name }}</li>
        <li id="artistAlias" class="artist_alias" v-if="artist_alias">
          别名：{{ artist_alias }}
        </li>
      </ul>
      <div id="picAndSimi" class="pic_and_similar">
        <loading-state
          :loading="artistImgLoading"
          class="loading_artist_img"
        ></loading-state>
        <div
          id="artistImgContainer"
          class="artist_img_container"
          v-show="!artistImgLoading"
        ></div>
        <div id="similarArtistContainer" class="similar_artist_container">
          <div id="similarArtistTitle" class="similar_artist_title">
            热门歌手
          </div>
          <loading-state
            :loading="similatArtistLoading"
            class="loading_similar_artist"
          ></loading-state>
          <ul
            id="similarArtistList"
            class="similar_artist_list"
            v-show="!similatArtistLoading"
          >
            <div
              id="similarArtistItem"
              class="similar_artist_item"
              v-for="(item, index) in similar_singers"
              :key="index"
              @click="jumpSingerPage(item.id)"
            >
              <div
                id="image"
                class="image"
                :style="{ 'background-image': `url(${item.picUrl})` }"
              ></div>
              <div id="description" class="description">
                <div id="name" class="name">{{ item.name }}</div>
              </div>
            </div>
          </ul>
        </div>
      </div>

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
        <el-tab-pane label="所有专辑" name="albums">
          <loading-state
            :loading="albumLoading"
            class="loading_tab_content"
          ></loading-state>
          <ul id="artistAlbum" class="artist_album"></ul>
          <el-pagination
            :current-page="currentAlbumPage"
            :page-size="12"
            layout="prev, pager, next, jumper"
            :total="totalAlbum"
            @current-change="handleCurrentChange"
            class="album_pagination"
          />
        </el-tab-pane>
        <el-tab-pane label="艺人介绍" name="description">
          <loading-state
            :loading="descriptionLoading"
            class="loading_tab_content"
          ></loading-state>
          <p class="brief_desc artist_description">{{ briefDesc }}</p>
          <div v-for="(item, index) in introductions" :key="index">
            <h3 class="description_title">{{ item.ti }}</h3>
            <p class="artist_description">{{ item.txt }}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>
  </main>
</template>
<style lang="scss" scoped></style>

<script setup lang="ts">
// 展示歌曲、歌单等资源的信息，无侧边栏
import $ from 'jquery';

// import { useRoute } from 'vue-router'
import { useRoute, useRouter } from 'vue-router';
import { get } from '../../axios/insatance';

import './artistInfoView.scss';

import songList from '../../components/article/songList/songList.vue';
import loadingState from '../../components/article/loadingState/loadingState.vue';
import albumItem from '../../components/article/albumItem/albumItem.vue';
import { h, nextTick, onMounted, ref, render, watch } from 'vue';
import createLiTag from '../../util/createLiTag';
import processSingerArray from '../../util/processSingerArray';
// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();
const router = useRouter();

const activeName = ref('hotsongs');

const artist_name = ref('');
const artist_alias = ref('');
const artist_img = ref('');

const similar_singers = ref<any[]>([]);

const briefDesc = ref('');
const introductions = ref<any[]>([]);

const artistImgLoading = ref(true);
const similatArtistLoading = ref(true);
const albumLoading = ref(true);
const descriptionLoading = ref(true);

const currentAlbumPage = ref(1);
const totalAlbum = ref(0);

const handleActiveNameChange = () => {
  console.log(activeName);
  if (activeName.value == 'description') getDescription();
  else if (activeName.value == 'albums') getAlbums();
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
  artistImgLoading.value = false;
};

const getSimilarArtist = async () => {
  await get<any>(
    `/top/artists?offset=${Math.floor(Math.random() * 90)}&limit=9`
  )
    .then((response) => {
      console.log(response);
      // 插入元素
      similar_singers.value = response.artists;
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
  similatArtistLoading.value = false;
};

const getAlbums = async () => {
  await get<any>(
    `/artist/album?id=${route.query.id}&limit=12&offset=${
      (currentAlbumPage.value - 1) * 12
    }`
  )
    .then((response) => {
      console.log(response);
      totalAlbum.value = response.artist.albumSize;
      const $ul = $('#artistAlbum');
      response.hotAlbums.forEach((element: any) => {
        const li = createLiTag($ul);
        render(
          h(albumItem, {
            id: String(element.id),
            imgUrl: element.picUrl,
            title: element.name,
            artists: processSingerArray(element.artists),
          }),
          li
        );
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
  albumLoading.value = false;
};

const getDescription = async () => {
  await get<any>(`/artist/desc?id=${route.query.id}`)
    .then((response) => {
      console.log(response);
      briefDesc.value = response.briefDesc;
      introductions.value = response.introduction;
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
  descriptionLoading.value = false;
};

const handleCurrentChange = (val: number) => {
  currentAlbumPage.value = val;
  getAlbums();
};

onMounted(() => {
  getInfo();
  getSimilarArtist();
  $('.el-pagination__goto')[0].innerText = '跳转至第';
  $('.el-pagination__classifier')[0].innerText = '页';
});

const jumpSingerPage = (id: string) => {
  sessionStorage.setItem('lastPathName', 'artistInfo');
  sessionStorage.setItem('lastPathQuery', JSON.stringify({ id: id }));
  router.push({
    name: 'artistInfo',
    query: { id: id },
  });
};

watch(
  () => route.query.id,
  () => {
    activeName.value = 'hotsongs';
    artistImgLoading.value = true;
    similatArtistLoading.value = true;
    albumLoading.value = true;
    descriptionLoading.value = true;
    getInfo();
    getSimilarArtist();
  }
);
</script>
