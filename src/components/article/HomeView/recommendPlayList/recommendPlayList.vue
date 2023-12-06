<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive } from 'vue';
import { get } from '../../../../axios/insatance';

import './recommendPlaylist.scss';

import PlayList from '../../PlayList/PlayList.vue';

const createItem = async () => {
  await get<any>(`/top/playlist`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  createItem();
});
</script>

<template>
  <div id="recommend" class="recommend"></div>
</template>
<style lang="scss" scoped></style>
../../../../util/processPlayCount
