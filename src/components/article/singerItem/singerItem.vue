<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div id="singerContainer" class="sinegr_container" @click="jumpPage()">
    <div
      id="image"
      class="image"
      :style="{ 'background-image': `url(${imgUrl})` }"
    ></div>
    <div id="description" class="description">
      <div id="name" class="name">{{ name }}</div>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import router from '../../../router/index';

import './singerItem.scss';

const props = defineProps({
  id: String,
  accountId: String,
  imgUrl: String,
  name: String,
});

const jumpPage = () => {
  sessionStorage.setItem('lastPathName', 'artistInfo');
  sessionStorage.setItem('lastPathQuery', JSON.stringify({ id: props.id }));

  router.push({
    name: 'artistInfo',
    query: { id: props.id },
  });
};
</script>
