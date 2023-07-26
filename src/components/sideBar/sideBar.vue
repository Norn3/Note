<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive } from 'vue';
import './sideBar.scss';

// 通过defineProps接收父组件的值
const father = defineProps({
  // 接收传值   此处的listLength就是父组件的自定义名称
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
  await nextTick();
  createItem();
  // console.log(father.itemNum);
});
</script>

<template>
  <ul class="List" ref="List">
    <!-- <li id="musicItem1" class="musicItem">item1</li>
    <li id="musicItem2" class="musicItem">item2</li>
    <li id="musicItem3" class="musicItem">item3</li>
    <li id="musicItem4" class="musicItem">item4</li>
    <li id="musicItem5" class="musicItem">item5</li>
    <li id="musicItem6" class="musicItem">item6</li>
    <li id="musicItem7" class="musicItem">item7</li>
    <li id="musicItem8" class="musicItem">item8</li>
    <li id="musicItem9" class="musicItem">item9</li>
    <li id="musicItem10" class="musicItem">item10</li>
    <li id="musicItem11" class="musicItem">item11</li>
    <li id="musicItem12" class="musicItem">item12</li>
    <li id="musicItem13" class="musicItem">item13</li>
    <li id="musicItem14" class="musicItem">item14</li>
    <li id="musicItem15" class="musicItem">item15</li>
    <li id="musicItem16" class="musicItem">item16</li>
    <li id="musicItem17" class="musicItem">item17</li>
    <li id="musicItem18" class="musicItem">item18</li>
    <li id="musicItem19" class="musicItem">item19</li> -->
  </ul>
</template>
<style lang="scss" scoped></style>
