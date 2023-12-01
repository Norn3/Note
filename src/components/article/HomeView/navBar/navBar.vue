<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive } from 'vue';
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
  { id: 2, text: '排行榜', address: 'rank' },
];

// 选择导航栏中的每一项，都会将改变router到对应路径，并且更改选中样式
const router = useRouter();
const jumpPage = (address: string, id: string) => {
  // 选中对应项
  $('.navItem').removeClass('check');
  $(id)[0].classList.add('check');
  // 根据地址，在sessionStorage中更改最后所在路径，并进行跳转
  if (address == 'playlist') {
    sessionStorage.setItem('lastPathName', 'playlist');
    sessionStorage.setItem(
      'lastPathQuery',
      JSON.stringify({ category: '全部' })
    );
    router.push({
      name: 'playlist',
      query: { category: '全部' },
    });
  } else {
    sessionStorage.setItem('lastPathName', address);
    router.push({ name: address });
  }
};

// 加载时，选中第一项
onMounted(() => {
  // 上次最后到哪
  let path_name = sessionStorage.getItem('lastPathName') as string;

  // 选中对应项
  let check_item = navItem.findIndex((item) => item.address == path_name);

  // 如果没有找到对应路径，比如初次打开，则打开推荐页
  if (check_item == -1) {
    check_item = 0;
    path_name = 'recommend';
  }
  $(`#li${check_item}`).addClass('check');
  console.log(check_item);

  // 若打开的是歌单页，则要连参数一起传递（后续加入其他带参页需要修改此处）
  if (check_item == 1) {
    const path_query = sessionStorage.getItem('lastPathQuery') as string;
    console.log(path_query);

    if (path_query) {
      router.push({ name: 'playlist', query: JSON.parse(path_query) });
    } else {
      router.push({ name: 'playlist', query: { category: '全部' } });
    }
  }
  // 若不是歌单页则直接打开
  else {
    router.push({ name: path_name });
  }
});
</script>

<template>
  <ul class="nav" ref="nav">
    <li
      v-for="item in navItem"
      :key="item.id"
      :id="'li' + item.id"
      class="navItem"
      @click="jumpPage(item.address, `#li${item.id}`)"
    >
      {{ item.text }}
    </li>
  </ul>
</template>
<style lang="scss" scoped></style>
