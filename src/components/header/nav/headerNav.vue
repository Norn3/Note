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
import { onMounted, ref, nextTick, reactive } from 'vue';
import { useRouter } from 'vue-router';
import './headerNav.scss';
import { get } from '../../../axios/insatance';

// 创建导航栏内容
const navItem = [
  { id: 0, text: '发现音乐', address: 'recommend' },
  { id: 1, text: '我的音乐', address: 'myPlaylistInfo' },
];

const uid = 571024254;
let pid = 0;
const getPid = async (uid: number) => {
  await get<any>(`/user/playlist?uid=${uid}`)
    .then((response) => {
      console.log(response);
      pid = response.playlist[0].id;
      console.log(pid);
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
  return 0;
};

// 选择导航栏中的每一项，都会将改变router到对应路径，并且更改选中样式
const router = useRouter();
const jumpPage = (address: string, id: string) => {
  // 删除所有项的被选中样式，然后给选中项加上选中样式
  $('.header_nav_item').removeClass('check');
  $(id)[0].classList.add('check');
  console.log(address);

  // 如果选中“我的音乐”，则跳转并存储地址和参数
  if (address == 'myPlaylistInfo') {
    router.push({ name: address, query: { id: pid } });
    sessionStorage.setItem('lastPathName', address);
    sessionStorage.setItem('lastPathQuery', JSON.stringify({ id: pid }));
    // 否则直接不带参跳转并存入地址即可
  } else {
    router.push({ name: address });
    sessionStorage.setItem('lastPathName', address);
  }
};

// 加载时，选中第一项
onMounted(() => {
  const path_name = sessionStorage.getItem('lastPathName') as string;
  let check_item = navItem.findIndex((item) => item.address == path_name);
  // 如果sessionStorage中存入的路径在navItem项中找不到，那么选中“发现音乐”项
  if (check_item == -1) $(`#header_li0`)[0].classList.add('check');
  else $(`#header_li${check_item}`)[0].classList.add('check');

  // 如果是路径是“我的音乐”，则直接带参跳转
  if (path_name == 'myPlaylistInfo') {
    const path_query = sessionStorage.getItem('lastPathQuery') as string;
    console.log(path_name, path_query);
    router.push({ name: path_name, query: JSON.parse(path_query) });
  }
  // 否则，不带参跳转即可
  else {
    router.push({ name: path_name });
  }
  getPid(uid);
});
</script>
