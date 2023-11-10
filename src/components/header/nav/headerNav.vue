<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive } from 'vue';
import { useRouter } from 'vue-router';
import './headerNav.scss';

// 创建导航栏内容
const navItem = [
  { id: 0, text: '发现音乐', address: 'home' },
  { id: 1, text: '我的音乐', address: 'play' },
];

// 选择导航栏中的每一项，都会将改变router到对应路径，并且更改选中样式
const router = useRouter();
const jumpPage = (address: string, id: string) => {
  $('.header_nav_item').removeClass('check');
  $(id)[0].classList.add('check');
  router.push({ name: address });
};

// 加载时，选中第一项
onMounted(() => {
  $('#header_li0')[0].classList.add('check');
  router.push({ name: 'home' });
});
</script>

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
