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
          <p
            ref="des_height"
            :style="{ '-webkit-line-clamp': showDescription ? '' : '5' }"
          >
            {{ description }}
          </p>
          <div
            class="fold_description"
            @click="unfoldDescription"
            v-if="foldButton"
          >
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
import { nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue';
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

// 根据资源类型， 决定获取数据的地址
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
// 用于信息显示的数据
let name = ref(''),
  coverImgUrl = ref(''),
  authors: Array<string> = reactive([]),
  createTime = ref(''),
  playCountText = ref(''),
  subscribedText = ref(''),
  tags: Array<string> = reactive([]),
  description = ref('');

const showDescription = ref(true);
const des_height = ref<HTMLElement | null>(null);
const foldButton = ref(false);

// 观察简介长度，判断是否需要显示展开/收起按钮
const handleFoldButton = new MutationObserver(() => {
  if (des_height.value) {
    if (des_height.value.offsetHeight > 150) {
      foldButton.value = true;
      showDescription.value = false;
    }
    handleFoldButton.disconnect(); // 停止观察
  }
});

// 展开简介
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

// 获取资源信息
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

// 获取歌曲列表
const getSongList = async () => {
  await get<any>(`/playlist/track/all?id=${props.target_id}&limit=20`)
    .then((response) => {
      console.log(response);
      const songs = response.songs;
      songs.forEach((element: any) => {
        name.value = element.name;
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

getInfo();

if (props.type == 'playlist') {
  getSongList();
}

onMounted(() => {
  // 观察简介长度
  if (des_height.value) {
    handleFoldButton.observe(des_height.value, {
      attributes: false,
      childList: true,
      subtree: false,
    });
  }
});
</script>
