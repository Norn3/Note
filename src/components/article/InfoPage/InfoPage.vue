<template>
  <div id="playlistInfoContainer" class="info_container">
    <main id="playlistBasicInfo" class="basic_info">
      <img id="cover" class="cover" alt="封面" :src="coverImgUrl" />
      <title id="title" class="title">{{ name }}</title>
      <div id="creator" class="creator text">
        <ul v-for="(author, index) in authors" :key="index">
          <li>{{ author }}</li>
        </ul>
      </div>
      <p id="createTime" class="create_time text">{{ createTime }}</p>
      <div id="buttons" class="buttons">
        <button id="pressToPlay" class="press_to_play">
          播放
          <p id="playCount" class="play_count">{{ playCountText }}</p>
        </button>
        <button id="like" class="like_playlist">
          收藏
          <p id="likeCount" class="like_count">{{ subscribedText }}</p>
        </button>
        <button id="sharePlaylist" class="share_playist">分享</button>
      </div>
      <div id="label" class="label text">
        标签：
        <ul v-for="(tag, index) in tags" :key="index">
          <li>{{ tag }}</li>
        </ul>
      </div>
      <div id="description" class="description">
        <strong class="text description_title">介绍：</strong>
        <div>
          <p :style="{ '-webkit-line-clamp': showDescription ? '' : '5' }">
            {{ description }}
          </p>
          <div class="fold_description" @click="unfoldDescription">
            {{ showDescription ? '收起' : '展开' }}
          </div>
        </div>
      </div>
    </main>
    <ol id="songsList" class="songs_list text"></ol>
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $, { event } from 'jquery';
import { reactive, ref } from 'vue';
import PlaylistItemClass from '../../../class/PlaylistItemClass';
import { get } from '../../../axios/insatance';
import moment from 'moment';

import './InfoPage.scss';
import processValue from '../../../util/processValue';

const props = defineProps({
  target_id: String,
  type: {
    type: String,
    default: 'playlist',
  },
});
// let playlist = ref(new PlaylistItemClass('', ''));
// let songs = ref();

const address = (type: string): string => {
  let addr = '';
  switch (type) {
    case 'playlist':
      addr = `/playlist/detail?id=${props.target_id}`;
      break;
    case 'song':
      addr = `/song/detail?ids=${props.target_id}`;
      break;
    case 'album':
      addr = `/album?id=${props.target_id}`;
      break;
  }
  return addr;
};
let name = ref(''),
  coverImgUrl = ref(''),
  authors: Array<string> = reactive([]),
  createTime = ref(''),
  playCountText = ref(''),
  subscribedText = ref(''),
  tags: Array<string> = reactive([]),
  description = ref(''),
  showDescription = ref(false);

const unfoldDescription = () => {
  showDescription.value = !showDescription.value;
  // 展开状态
  if (showDescription.value) {
    const scrollPositionY = window.pageYOffset; // 获取当前滚动位置
    window.scrollTo(0, scrollPositionY); // 将页面滚动位置还原
  }
  // 收起状态
  else {
    window.scrollTo(0, 0); // 回到最顶端
  }
};
const getInfo = async () => {
  await get<any>(`${address(props.type)}`)
    .then((response) => {
      console.log(response);

      if (props.type == 'playlist') {
        let playlist = response.playlist;
        coverImgUrl.value = playlist.coverImgUrl;
        name.value = playlist.name;
        authors.push(playlist.creator.nickname);
        createTime.value = moment(playlist.createTime).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        description.value = playlist.description;
        playlist.tags.forEach((element: string) => {
          tags.push(element);
        });

        if (playlist.playCount != undefined) {
          playCountText.value = processValue(playlist.playCount);
        }
        if (playlist.subscribedCount != undefined) {
          subscribedText.value = processValue(playlist.subscribedCount);
        }
      } else if (props.type == 'song') {
        // 多首歌情况未考虑
        let songs = response.songs;
        // 多个歌手情况未考虑
        // authors = songs.ar[0].name;

        playCountText.value = '';
        subscribedText.value = '';
      }
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};
const getSongList = async () => {
  await get<any>(`/playlist/track/all?id=${props.target_id}&limit=20`);
};

getInfo();
</script>
