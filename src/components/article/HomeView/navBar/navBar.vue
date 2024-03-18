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
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import './navBar.scss';

// // 通过defineProps接收父组件的值
// const father = defineProps({
//   // 接收传值   此处的itemNum就是父组件的自定义名称
//   itemNum: {
//     type: Number, // 数据类型
//     default: 0, // 未传值时的默认值
//   },
//   navItem: {
//     type: Array,
//     default: () => [
//       'Item11568468796/8746844654134854135',
//       'Item2',
//       'Item3',
//       'Item4',
//     ],
//   },
// });
// const navItem = reactive(father.navItem);

// const createItem = () => {
//   // 使用 $() 将目标元素包装为 jQuery 对象
//   const $nav = $('.nav');

//   navItem.forEach((element) => {
//     // 创建新的子元素并设置其内容
//     const $li = $('<li>').text(String(element));
//     $li.addClass('navItem');
//     // 将新创建的子元素添加为目标元素的子节点
//     $nav.append($li);
//   });
// };

// onMounted(async () => {
//   await nextTick();
//   createItem();
// });

// 创建导航栏内容
const navItem = [
  { id: 0, text: '推荐', address: 'recommend' },
  { id: 1, text: '歌单', address: 'playlist' },
  { id: 2, text: '排行榜', address: 'rankInfo' },
];

// 选择导航栏中的每一项，都会将改变router到对应路径，并且更改选中样式
const router = useRouter();
const route = useRoute();
const jumpPage = (address: string, id: string) => {
  // 选中对应项
  $('.navItem').removeClass('check');
  $(id)[0].classList.add('check');
  // 根据地址，在sessionStorage中更改最后所在路径，并进行跳转
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

// 加载时，选中第一项，用onMounted才能给选中项添加样式
onMounted(() => {
  // 上次最后到哪
  let path_name = sessionStorage.getItem('lastPathName') as string;

  // 选中对应项
  let check_item = navItem.findIndex((item) => item.address == path_name);

  // 如果没有找到对应路径，比如初次打开，则打开推荐页
  if (route.name == 'home' && path_name == null) {
    check_item = 0;
  }
  // 给对应项添加选中类名
  $(`#li${check_item}`).addClass('check');
});
</script>

<style lang="scss" scoped></style>
