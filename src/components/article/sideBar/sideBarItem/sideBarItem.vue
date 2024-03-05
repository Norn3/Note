<template>
  <div id="sideBarItem" class="sideBar_item" @click="jumpPage">
    <img :src="coverImgUrl" alt="" id="cover" class="cover" />
    <div id="name" class="name">{{ name }}</div>
    <div id="description" class="description">{{ description }}</div>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import router from '../../../../router/index';

import './sideBarItem.scss';

const props = defineProps({
  pid: Number,
  name: String,
  coverImgUrl: String,
  description: String,
});

const jumpPage = () => {
  router.push({
    name: 'myPlaylistInfo',
    query: { id: props.pid },
  });
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  // console.log(father.itemNum);
});
</script>
