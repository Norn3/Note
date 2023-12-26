<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import router from '../../../../router/index';

const props = defineProps({
  pid: Number,
  name: String,
  coverImgUrl: String,
  trackCount: Number,
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

<template>
  <div id="sideBarItem" class="sideBarItem" @click="jumpPage">
    <img :src="coverImgUrl" alt="" id="cover" class="cover" />
    <div id="name" class="name">{{ name }}</div>
    <div id="number" class="number">{{ trackCount + '首' }}</div>
  </div>
</template>
<style lang="scss" scoped>
.sideBarItem {
  width: 100%;
  height: auto;
  display: grid;
  /*  声明列的宽度  */
  grid-template-columns: 50px repeat(3, auto);
  /*  声明行间距和列间距  */
  grid-gap: 7px;
  /*  声明行的高度  */
  grid-template-rows: repeat(2, 1fr);
  justify-items: start;

  .cover {
    width: 50px;
    height: 50px;
    grid-column: 1;
    grid-row: 1 / 3;
  }

  .name {
    grid-column: 2 / 5;
    grid-row: 1;
    max-width: 140px;
    font-size: 1em;
    overflow: hidden;
    white-space: nowrap;
    // 溢出显示省略号
    text-overflow: ellipsis;
  }

  .number {
    grid-column: 2 / 5;
    grid-row: 2;
    font-size: 0.7em;
    color: gray;
    white-space: nowrap;
  }
}
</style>
