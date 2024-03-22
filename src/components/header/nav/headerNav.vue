<template>
  <ul class="header_nav" ref="nav">
    <li
      v-for="item in navItem"
      :key="item.id"
      :id="'header_li' + item.id"
      class="header_nav_item"
      @click="jumpPage(item.address, `#header_li${item.id}`)"
    >
      {{ item.text }}
    </li>
  </ul>
</template>
<style lang="scss" scoped></style>

<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import './headerNav.scss';

const router = useRouter();
const route = useRoute();

// 创建导航栏内容
const navItem = [
  { id: 0, text: '发现音乐', address: 'recommend' },
  { id: 1, text: '我的音乐', address: 'play' },
];

// 选择导航栏中的每一项，都会将改变router到对应路径，并且更改选中样式
const jumpPage = (address: string, id: string) => {
  // 如果选中“我的音乐”，则跳转并存储地址和参数
  if (address == 'play') {
    // TODO: 当pid为0时未实现
    router.push({ name: address });
    sessionStorage.setItem('lastPathName', address);
    sessionStorage.setItem('lastPathQuery', '');

    // 否则直接不带参跳转并存入地址即可
  } else {
    router.push({ name: address });
    sessionStorage.setItem('lastPathName', address);
    sessionStorage.setItem('lastPathQuery', '');
  }
};

// 会使得导航栏第一项被选中的页面集合
const selectFirstItemPageSet = new Set([
  'recommend',
  'playlist',
  'rankInfo',
  'Info',
  'artistInfo',
]);
const selectSecondItemPageSet = new Set(['myPlaylistInfo', 'play']);

// TODO：如果headerNav中再增加选项，只能一直列举下去，希望能找到一个规律将其总结起来
// 监听路由变化，根据路由判断该选中哪一项
watch(
  () => route.name,
  (newValue) => {
    $('.header_nav_item').removeClass('check');
    if (selectFirstItemPageSet.has(newValue as string)) {
      $('#header_li0')[0].classList.add('check');
    } else if (selectSecondItemPageSet.has(newValue as string)) {
      $('#header_li1')[0].classList.add('check');
    }
  }
);
</script>
