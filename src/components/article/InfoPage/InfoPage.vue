<template>
  <div id="playlistInfoContainer" class="info_container">
    <el-text v-if="loading" v-loading="loading" class="loading"
      >Loading...</el-text
    >
    <main id="playlistBasicInfo" class="basic_info" v-show="!loading">
      <img id="cover" class="cover" alt="封面" :src="coverImgUrl" />
      <title id="title" class="title">{{ name }}</title>
      <div id="creator" class="creator text">
        <img
          v-if="props.type == 'playlist'"
          :src="creatorAvatar"
          alt="作者："
          id="creatorAvatar"
          class="creator_avatar"
        />
        <p v-else class="creator_label">歌手：</p>
        <ul class="creator_name">
          <li v-for="(name, index) in creatorName" :key="index">{{ name }}</li>
        </ul>
      </div>
      <p v-if="props.type != 'song'" id="createTime" class="create_time text">
        {{ createTime }}
      </p>

      <div
        v-if="props.type == 'playlist'"
        id="label"
        class="label_or_album text"
      >
        <p v-if="tags.length > 0">标签：</p>
        <ul v-for="(tag, index) in tags" :key="index">
          <li @click="jumpCategory(tag)">{{ tag }}</li>
        </ul>
      </div>
      <div v-else-if="props.type == 'song'" class="label_or_album text">
        <p>所属专辑：</p>
        {{ albumOfSong }}
      </div>
      <div v-else-if="props.type == 'album'" class="label_or_album text">
        <p>发行公司：</p>
        {{ company }}
      </div>

      <div id="buttons" class="buttons">
        <button id="pressToPlay" class="press_to_play" @click="playList">
          <img src="../../../assets/icons/play_infoPage.svg" alt="" />
          播放
          <p id="playCount" class="play_count">{{ playCountText }}</p>
        </button>
        <button id="like" class="like_playlist">
          <img src="../../../assets/icons/favorites.svg" alt="" />
          收藏
          <p id="likeCount" class="like_count">{{ subscribedText }}</p>
        </button>
        <button id="sharePlaylist" class="share_playist">
          <img src="../../../assets/icons/share.svg" alt="" />
          分享
        </button>
      </div>

      <div id="description" class="description">
        <strong v-if="description != null" class="text description_title"
          >介绍：</strong
        >
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
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $, { event } from 'jquery';
import {
  nextTick,
  onBeforeMount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  renderSlot,
  watch,
} from 'vue';
import { get } from '../../../axios/insatance';
import moment from 'moment';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

import './InfoPage.scss';
import processPlayCount from '../../../util/processPlayCount';
import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';

const router = useRouter();

const props = defineProps({
  target_id: String,
  type: {
    type: String,
    default: 'playlist',
  },
});

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
const loading = ref(true);

// playlist
let name = ref(''),
  coverImgUrl = ref(''),
  creatorName: Array<string> = reactive([]),
  creatorAvatar = ref(''),
  createTime = ref(''),
  playCountText = ref(''),
  subscribedText = ref(''),
  tags: Array<string> = reactive([]),
  description = ref(''),
  trackIds: Array<number> = reactive([]);

// song
let albumOfSong = ref('');

// album
let company = ref('');

let listStore = useCurrentPlayingListStore();

// 简介状态控制
const showDescription = ref(true); // 是否完全展示简介
const des_height = ref<HTMLElement | null>(null); // 显示简介内容的p标签
const foldButton = ref(false); // 是否显示展开/收起按钮

// 观察简介长度，判断是否需要显示展开/收起按钮
const handleFoldButton = () => {
  if (des_height.value) {
    if (des_height.value.offsetHeight > 150) {
      foldButton.value = true;
      showDescription.value = false;
    } else {
      foldButton.value = false;
      showDescription.value = true;
    }
  }
};

// 点击展开按钮
const unfoldDescription = () => {
  showDescription.value = !showDescription.value;
  // 展开状态
  if (showDescription.value) {
    window.scrollTo(0, window.scrollY); // 将页面滚动位置还原，不随着内容的展开直接滚动到底
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
        creatorName = reactive([]);
        creatorName.push(playlist.creator.nickname);
        creatorAvatar.value = playlist.creator.avatarUrl;
        createTime.value = moment(playlist.createTime).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        description.value = playlist.description;
        tags = [];
        playlist.tags.forEach((element: string) => {
          tags.push(element);
        });

        if (playlist.playCount != undefined) {
          playCountText.value =
            '（' + processPlayCount(playlist.playCount) + '）';
        }
        if (playlist.subscribedCount != undefined) {
          subscribedText.value =
            '（' + processPlayCount(playlist.subscribedCount) + '）';
        }
      } else if (props.type == 'song') {
        let song = response.songs[0];
        coverImgUrl.value = song.al.picUrl;
        name.value = song.name;
        creatorName = reactive([]);
        song.ar.forEach((singer: any) => {
          creatorName.push(singer.name);
        });
        albumOfSong.value = song.al.name;
        getLyrics();

        playCountText.value = '';
        subscribedText.value = '';
      } else if (props.type == 'album') {
        let album = response.album;
        coverImgUrl.value = album.picUrl;
        name.value = album.name;
        creatorName = reactive([]);
        album.artists.forEach((creator: any) => {
          creatorName.push(creator.name);
        });
        // creatorAvatar.value = album.creator.avatarUrl;
        createTime.value = moment(album.publishTime).format('YYYY-MM-DD');
        description.value = album.description;
        tags = [];
        company.value = album.company;

        playCountText.value = '';
        subscribedText.value = '';
      }
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
  loading.value = false;
};

// 获取歌词信息
const getLyrics = async () => {
  await get<any>(`/lyric?id=${props.target_id}`).then((response) => {
    console.log(response);
    // 清空description内容
    description.value = '';

    // 划分歌词
    const lrcMap = new Map();
    response.lrc.lyric.split('\n').forEach((element: string) => {
      const temp = element.split(']');
      lrcMap.set(temp[0], temp[1]);
    });

    // 若翻译版歌词为空
    if (response.tlyric.lyric == '') {
      lrcMap.forEach((value: string, key: string) => {
        if (value == undefined) {
          value = '';
        }
        description.value = description.value + value + '\n';
      });
    }

    // 若翻译版歌词不为空
    else {
      const tlyricMap = new Map();
      response.tlyric.lyric.split('\n').forEach((element: string) => {
        const temp = element.split(']');
        tlyricMap.set(temp[0], temp[1]);
      });

      // 翻译版歌词存在[]内不是时间而是翻译者的情况，因此不能选择只查当前第一个时间是否匹配，应该查到有匹配的时间为止

      lrcMap.forEach((value: string, key: string) => {
        let translate = tlyricMap.get(key);
        if (value == undefined) {
          value = '';
        }
        if (translate == undefined) {
          translate = '';
        }
        description.value = description.value + value + '\n' + translate + '\n';
      });
    }
  });
};

// 列表播放，调用listStore里的changeList方法，如果props.target_id与当前播放列表id一致，则从头播放
const playList = async () => {
  await listStore.changeList(props.type, props.target_id as string);
  listStore.resetCurSong();
};

// 点击歌单标签，跳转到歌单分类页面
const jumpCategory = (tag: string) => {
  router.push({ name: 'playlist', query: { category: tag } });
};

onMounted(async () => {
  await getInfo();

  // 判断简介长度
  handleFoldButton();
});

// 当页面的路由改变，马上重新获取信息
watch(
  () => props.target_id,
  async (newId, oldId) => {
    console.log(newId, oldId);
    await getInfo();
    // 判断简介长度
    handleFoldButton();
  }
);
</script>
