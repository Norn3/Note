<template>
  <div
    id="sideBarItem"
    class="sideBar_item"
    @click="jumpPage"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div id="cover" class="cover">
      <img :src="coverImgUrl" alt="" />
      <div
        v-if="
          hovering && listType == 'playlist' && String(pid) != likePlaylistId
        "
        id="deleteIcon"
        class="delete_icon"
        @click.stop="deletePlaylist"
      ></div>
    </div>
    <div id="name" class="name">{{ name }}</div>
    <div id="description" class="description">{{ description }}</div>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import { useuserPlaylistStore } from '../../../../stores/userPlaylist';
import router from '../../../../router/index';

import './sideBarItem.scss';

const userPlaylistStore = useuserPlaylistStore();

const hovering = ref(false);

const props = defineProps({
  listType: {
    type: String,
    default: 'playlist',
  },
  playlistType: String,
  likePlaylistId: String,
  pid: Number,
  name: String,
  coverImgUrl: String,
  description: String,
});

const jumpPage = () => {
  $(window).scrollTop(0);
  router.push({
    name: props.listType == 'playlist' ? 'myPlaylistInfo' : 'rankInfo',
    query: { id: props.pid },
  });
};

const deletePlaylist = () => {
  if (props.playlistType == 'create') {
    userPlaylistStore.deletePlaylist(String(props.pid));
  } else {
    userPlaylistStore.processSubscribePlaylist(String(props.pid), '2');
  }
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
});
</script>
