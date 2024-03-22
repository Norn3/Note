<template>
  <div id="sidebar" class="sidebar">
    <div class="sidebar_title">
      <h3>{{ list_title1 }}</h3>
    </div>
    <ul id="create" class="list"></ul>
    <div class="sidebar_title">
      <h3>{{ list_title2 }}</h3>
    </div>
    <ul id="like" class="list"></ul>
    <el-text v-if="loading" v-loading="loading" class="loading"
      >Loading...</el-text
    >
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import $ from 'jquery';
import {
  onMounted,
  ref,
  nextTick,
  reactive,
  watch,
  h,
  render,
  computed,
} from 'vue';

import './sideBar.scss';

import SideBarItem from './sideBarItem/sideBarItem.vue';

import PlaylistItem from '../../../class/PlaylistItemClass';

import { useLoginStateStore } from '../../../stores/loginState';

const loginStore = useLoginStateStore();

const loading = ref(true);

// 通过defineProps接收父组件的值
const props = defineProps({
  // 接收传值   此处的itemNum就是父组件的自定义名称
  listType: {
    // 为了让侧边菜单项知道被点击后应该跳转至myPlaylistInfo还是rankInfo
    type: String,
    default: 'playlist',
  },
  itemNum: {
    type: Number, // 数据类型
    default: 0, // 未传值时的默认值
  },
  listItem: {
    type: Array<PlaylistItem>,
    default: () => [],
  },
});
const listItem = reactive(props.listItem);
// TODO：此处暂时设置为默认值1，后续需要优化
let uid = 1;

const list_title1 = computed(() => {
  return props.listType == 'playlist' ? '创建的歌单' : '热门榜单';
});

const list_title2 = computed(() => {
  return props.listType == 'playlist' ? '收藏的歌单' : '所有榜单';
});

watch(listItem, (newListItem) => {
  loading.value = true;
  uid = loginStore.already_login ? loginStore.getProfile().userId : 1;
  addItemToList(newListItem);
  loading.value = false;
});

// 决定列表项的分割位置，然后将列表项加到对应列表中
const addItemToList = (listItem: Array<PlaylistItem>) => {
  let slice = 4;
  if (props.listType == 'playlist') {
    slice = 0;
    for (let element of listItem) {
      if (element.userId != uid) break;
      slice++;
    }
  }
  createItem(listItem, 0, slice, '#create');
  createItem(listItem, slice, listItem.length, '#like');

  if ($('#create').children(':first').length != 0) {
    $('#create').children(':first').addClass('check');
  } else if ($('#like').children(':first').length != 0) {
    $('#like').children(':first').addClass('check');
  }
};

const createItem = (
  listItem: Array<PlaylistItem>,
  start: number,
  end: number,
  listId: string
) => {
  // 使用 $() 将目标元素包装为 jQuery 对象
  let $list = $(listId);
  $list.empty();
  $list.css('display', 'none');
  for (let i = start; i < end; i++) {
    // 创建新的子元素并设置其内容
    const $li = $('<li>');
    // $li.attr('id','"listItem'+ (father.itemNum - current) +'"');
    $li.addClass('list_item');
    // 将新创建的子元素添加为目标元素的子节点
    const li = $li[0];
    $list.append(li);
    render(
      h(SideBarItem, {
        listType: props.listType,
        pid: listItem[i].id,
        name: listItem[i].name,
        coverImgUrl: listItem[i].coverImgUrl,
        description:
          props.listType == 'playlist'
            ? listItem[i].trackCount + '首'
            : listItem[i].updateFrequency,
      }),
      li
    );
  }
  $list.css('display', 'block');
};

onMounted(() => {
  // 点击收起或展开列表
  $(document).on('click', '.sidebar_title', (element) => {
    const $title = $(element.currentTarget);
    const $h3 = $title.find('h3');
    $h3.toggleClass('open');
    const $list = $title.next();
    $list.toggleClass('fold');
  });

  // 点击列表项
  $(document).on('click', '.list_item', (element) => {
    // 取消之前选中项的选中样式
    const $check = $('#create').find('.check')
      ? $('#create').find('.check')
      : $('#like').find('.check');
    $check.removeClass('check');
    // 给当前选中项添加选中样式
    const $item = $(element.currentTarget);
    $item.addClass('check');
  });
});
</script>
