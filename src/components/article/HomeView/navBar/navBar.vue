<template>
  <ul class="nav" ref="nav">
    <li
      v-for="item in navItem"
      :key="'navBarItem' + item.id"
      :id="'li' + item.id"
      class="navItem"
      @click="jumpPage(item.address, `#li${item.id}`)"
    >
      {{ item.text }}
    </li>
  </ul>
</template>
<script setup lang="ts">
import $ from 'jquery';
import { onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import './navBar.scss';

// 创建导航栏内容
const navItem = [
  { id: 0, text: '推荐', address: 'recommend' },
  { id: 1, text: '歌单', address: 'playlist' },
  { id: 2, text: '排行榜', address: 'rankInfo' },
];

// 选择导航栏中的每一项，都会将改变router到对应路径，并且更改选中样式
const router = useRouter();
const route = useRoute();

// 监听路由变化
watch(
  () => route.name,
  (newValue) => {
    selectItem(newValue as string);
  }
);

// 在导航栏中查找传入的路径的对应项，若有则选中该项
const selectItem = (select_address: string) => {
  $('.navItem').removeClass('check');
  console.log(select_address);

  let check_item = navItem.findIndex((item) => item.address == select_address);
  // 给对应项添加选中类名
  $(`#li${check_item}`).addClass('check');
};

// 根据地址，在sessionStorage中更改最后所在路径，并进行跳转
const jumpPage = (address: string, id: string) => {
  sessionStorage.setItem('lastPathName', address);

  if (address == 'playlist') {
    sessionStorage.setItem(
      'lastPathQuery',
      JSON.stringify({ category: '全部' })
    );
    router.push({
      name: 'playlist',
      query: { category: '全部' },
    });
  } else if (address == 'rankInfo') {
    sessionStorage.setItem('lastPathQuery', JSON.stringify({ id: 19723756 }));
    router.push({
      name: 'rankInfo',
      query: { id: 19723756 },
    });
  } else {
    router.push({ name: address });
    sessionStorage.setItem('lastPathQuery', '');
  }
};

// 加载时，根据路由，给对应项添加选中状态
onMounted(() => {
  // 上次最后到哪
  let path_name = sessionStorage.getItem('lastPathName') as string;
  // 如果没有找到对应路径，比如初次打开，则打开推荐页
  if (route.name == 'home' || path_name == null) {
    path_name = 'recommend';
  }
  selectItem(path_name);
});
</script>

<style lang="scss" scoped></style>
