<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive } from 'vue';
import './sideBar.scss';

// 通过defineProps接收父组件的值
const father = defineProps({
  // 接收传值   此处的itemNum就是父组件的自定义名称
  itemNum: {
    type: Number, // 数据类型
    default: 0, // 未传值时的默认值
  },
  listItem: {
    type: Array,
    default: () => ['Item1', 'Item2', 'Item3', 'Item4'],
  },
});
const listItem = reactive(father.listItem);
// 列表项，可以通过导入实现
// const listItem = ref(['Item1','Item2','Item3','Item4']);
// let current = 0;

// const List = ref<HTMLElement>();

const createItem = () => {
  // 使用 $() 将目标元素包装为 jQuery 对象
  const $List = $('.List');

  listItem.forEach((element) => {
    // 创建新的子元素并设置其内容
    const $li = $('<li>').text(String(element));
    // $li.attr('id','"listItem'+ (father.itemNum - current) +'"');
    $li.addClass('listItem');
    // 将新创建的子元素添加为目标元素的子节点
    $List.append($li);
  });
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  createItem();
  // console.log(father.itemNum);
});
</script>

<template>
  <ul class="List" ref="List"></ul>
</template>
<style lang="scss" scoped></style>
