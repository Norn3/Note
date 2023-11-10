<template>
  <div id="playlistInfoContainer" class="playlist_info_container">
    <main id="playlistBasicInfo" class="playlist_basic_info">
      <img
        id="cover"
        class="cover"
        alt="歌单封面"
        :src="playlist.coverImgUrl"
      />
      <title id="title" class="title text">{{ playlist.name }}</title>
      <p id="creator" class="creator text">{{ nickname }}</p>
      <p id="createTime" class="create_time text">{{ playlist.createTime }}</p>
      <div id="buttons" class="buttons">
        <button id="pressToPlay" class="press_to_play">
          播放
          <p id="listeners" class="listeners">{{ playCountText }}</p>
        </button>
        <button id="addToPlaylist" class="add_to_playlist">添加到歌单</button>
        <button id="likePlaylist" class="like_playlist">
          收藏
          <p id="likes" class="likes">{{ subscribedText }}</p>
        </button>
        <button id="sharePlaylist" class="share_playist">分享</button>
      </div>
      <div id="label" class="label text">
        标签：
        <ul v-for="tags in playlist.tags" :key="tags.index">
          <li>{{ tags }}</li>
        </ul>
      </div>
      <div id="description" class="description">
        <strong class="text">介绍：</strong>
        <p>{{ playlist.description }}</p>
      </div>
    </main>
    <ol id="songsInPlaylist" class="songs_in_playlist text"></ol>
  </div>
</template>
<style lang="scss">
.playlist_basic_info {
  padding: 60px;
  display: grid;
  grid-template-columns: 280px 1fr 1fr;
  // grid-template-rows: minmax(40px, 80px) repeat(7, 40px);
  grid-auto-rows: minmax(40px, auto);
  grid-column-gap: 60px;

  grid-template-areas:
    'cover title title'
    'cover creator create_time'
    'cover buttons buttons'
    'cover label label'
    'cover description description';

  .text {
    line-height: 40px;
  }

  .cover {
    grid-area: cover;
    max-width: 280px;
    max-height: 280px;
    object-fit: contain;
    background-color: antiquewhite;
  }
  .title {
    grid-area: title;
    display: flex;
    font-size: 2em;
    font-weight: 600;
  }
  .creator {
    grid-area: creator;
    display: flex;
  }
  .create_time {
    grid-area: create_time;
    display: flex;
  }
  .buttons {
    grid-area: buttons;
    display: flex;
    justify-content: left;

    button {
      width: 80px;
      margin-right: 30px;
      display: flex;
      justify-content: center;
      line-height: 40px;

      .listeners {
        margin-left: 10px;
      }
      .likes {
        margin-left: 10px;
      }
    }
  }
  .label {
    grid-area: label;
    display: flex;
    ul {
      li {
        margin: 0 10px;
      }
    }
  }

  .description {
    grid-area: description;
    display: flex;
    white-space: pre-line;

    p {
      position: relative;
      top: 30px;
    }
  }
}
</style>
<script setup lang="ts">
import $, { event } from 'jquery';
import { ref } from 'vue';
import PlaylistItemClass from '../../../class/PlaylistItemClass';
import { get } from '../../../axios/insatance';

import './playlistInfo.scss';
import processValue from '../../../util/processValue';

const props = defineProps({
  playlist_id: String,
});
let playlist = ref(new PlaylistItemClass('', ''));
let nickname = '',
  playCountText = '',
  subscribedText = '';
const getInfo = async () => {
  await get<any>(`/playlist/detail?id=${props.playlist_id}`)
    .then((response) => {
      playlist.value = response.playlist;
      nickname = playlist.value.creator.nickname;

      if (playlist.value.playCount != undefined) {
        playCountText = processValue(playlist.value.playCount);
      }
      if (playlist.value.subscribedCount != undefined) {
        subscribedText = processValue(playlist.value.subscribedCount);
      }
      console.log(playlist.value);
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};
getInfo();
</script>
