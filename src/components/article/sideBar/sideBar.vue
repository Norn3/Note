<template>
  <div id="sideBar" class="sideBar">
    <div class="sideBarTitle"><h3>创建的歌单</h3></div>
    <ul id="create" class="List"></ul>
    <div class="sideBarTitle"><h3>收藏的歌单</h3></div>
    <ul id="like" class="List"></ul>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive, watch, h, render } from 'vue';

import './sideBar.scss';

import SideBarItem from './sideBarItem/sideBarItem.vue';

import PlaylistItem from '../../../class/PlaylistItemClass';

// 通过defineProps接收父组件的值
const father = defineProps({
  // 接收传值   此处的itemNum就是父组件的自定义名称
  itemNum: {
    type: Number, // 数据类型
    default: 0, // 未传值时的默认值
  },
  listItem: {
    type: Array<PlaylistItem>,
    default: () => [],
  },
});
const listItem = reactive(father.listItem);
const uid = 571024254;

watch(listItem, (newListItem) => {
  createItem(newListItem);
});
// 列表项，可以通过导入实现
// const listItem = ref(['Item1','Item2','Item3','Item4']);
// let current = 0;

// const List = ref<HTMLElement>();

const createItem = (listItem: Array<PlaylistItem>) => {
  // 使用 $() 将目标元素包装为 jQuery 对象
  let $List = $('#create');

  listItem.forEach((element) => {
    // 创建新的子元素并设置其内容

    if (element.userId != uid) {
      $List = $('#like');
    }
    const $li = $('<li>');
    // $li.attr('id','"listItem'+ (father.itemNum - current) +'"');
    $li.addClass('listItem');
    // 将新创建的子元素添加为目标元素的子节点
    const li = $li[0];
    $List.append(li);
    render(
      h(SideBarItem, {
        pid: element.id,
        name: element.name,
        coverImgUrl: element.coverImgUrl,
        trackCount: element.trackCount,
      }),
      li
    );
  });
  if ($('#create').children(':first') != undefined) {
    $('#create').children(':first').addClass('check');
  } else if ($('#like').children(':first') != undefined) {
    $('#like').children(':first').addClass('check');
  }
};

$(document).on('click', '.sideBarTitle', (element) => {
  const $title = $(element.currentTarget);
  const $h3 = $title.find('h3');
  $h3.toggleClass('open');
  const $list = $title.next();

  $list.toggleClass('fold');
});

// 点击列表项
$(document).on('click', '.listItem', (element) => {
  // 取消之前选中项的选中样式
  const $check = $('#create').find('.check')
    ? $('#create').find('.check')
    : $('#like').find('.check');
  $check.removeClass('check');
  // 给当前选中项添加选中样式
  const $item = $(element.currentTarget);
  $item.addClass('check');
});

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  // 加载时给第一项添加选中样式
  $('#create')[0].classList.add('check');
  // console.log(father.itemNum);
});
</script>
