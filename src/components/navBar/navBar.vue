<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive } from 'vue';
import './navBar.scss';

// 通过defineProps接收父组件的值
const father = defineProps({
  // 接收传值   此处的itemNum就是父组件的自定义名称
  itemNum: {
    type: Number, // 数据类型
    default: 0, // 未传值时的默认值
  },
  navItem: {
    type: Array,
    default: () => [
      'Item11568468796/8746844654134854135',
      'Item2',
      'Item3',
      'Item4',
    ],
  },
});
const navItem = reactive(father.navItem);

const createItem = () => {
  // 使用 $() 将目标元素包装为 jQuery 对象
  const $nav = $('.nav');

  navItem.forEach((element) => {
    // 创建新的子元素并设置其内容
    const $li = $('<li>').text(String(element));
    $li.addClass('navItem');
    // 将新创建的子元素添加为目标元素的子节点
    $nav.append($li);
  });
};

onMounted(async () => {
  await nextTick();
  createItem();
});
</script>

<template>
  <ul class="nav" ref="nav"></ul>
</template>
<style lang="scss" scoped></style>
