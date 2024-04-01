<template>
  <div id="sidebar" class="sidebar">
    <div class="sidebar_title">
      <h3>{{ list_title1 }}</h3>
    </div>
    <ul id="create" class="list" v-show="!loading"></ul>
    <div class="sidebar_title">
      <h3>{{ list_title2 }}</h3>
    </div>
    <ul id="like" class="list" v-show="!loading"></ul>
    <loading-state :loading="loading"></loading-state>
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
import loadingState from '../loadingState/loadingState.vue';

import { useuserPlaylistStore } from '../../../stores/userPlaylist';

const userPlaylistStore = useuserPlaylistStore();

const loading = ref(true);

// 通过defineProps接收父组件的值
const props = defineProps({
  // 接收传值   此处的itemNum就是父组件的自定义名称
  listType: {
    // 为了让侧边菜单项知道被点击后应该跳转至myPlaylistInfo还是rankInfo
    type: String,
    default: 'playlist',
  },
  checkId: String,
  // itemNum: {
  //   type: Number, // 数据类型
  //   default: 0, // 未传值时的默认值
  // },
  // listItem: {
  //   type: Array<PlaylistItem>,
  //   default: () => [],
  // },
});

const list_title1 = computed(() => {
  return props.listType == 'playlist' ? '创建的歌单' : '热门榜单';
});

const list_title2 = computed(() => {
  return props.listType == 'playlist' ? '收藏的歌单' : '所有榜单';
});

const createItem = (listItem: Array<PlaylistItem>, listId: string) => {
  // 使用 $() 将目标元素包装为 jQuery 对象
  let $list = $('#' + listId);
  $list.empty();
  $list.css('display', 'none');
  for (const item of listItem) {
    // 创建新的子元素并设置其内容
    const $li = $('<li>');
    $li.addClass('list_item');
    // 选中MyPlaylistInfo对应歌单项
    if (String(item.id) == props.checkId) {
      $li.addClass('check');
    }
    // 将新创建的子元素添加为目标元素的子节点
    const li = $li[0];
    $list.append(li);
    render(
      h(SideBarItem, {
        listType: props.listType,
        playlistType: props.listType == 'playlist' ? listId : '',
        likePlaylistId: listId == 'create' ? String(listItem[0].id) : '',
        pid: item.id,
        name: item.name,
        coverImgUrl: item.coverImgUrl,
        description:
          props.listType == 'playlist'
            ? item.trackCount + '首'
            : item.updateFrequency,
      }),
      li
    );
  }
  $list.css('display', 'block');
};

// 决定列表项的分割位置，然后将列表项加到对应列表中
const addItemToList = () => {
  loading.value = true;
  createItem(userPlaylistStore.getCreateList(), 'create');
  createItem(userPlaylistStore.getLikeList(), 'like');
  // if ($('#create').children(':first').length != 0) {
  //   $('#create').children(':first').addClass('check');
  // } else if ($('#like').children(':first').length != 0) {
  //   $('#like').children(':first').addClass('check');
  // }
  loading.value = false;
};

const clickSidebarTitle = (event: any) => {
  const $title = $(event.currentTarget);
  const $h3 = $title.find('h3');
  $h3.toggleClass('open');
  const $list = $title.next();
  $list.toggleClass('fold');
};

const clickSideBarItem = (event: any) => {
  // 取消之前选中项的选中样式
  const $check = $('#create').find('.check')
    ? $('#create').find('.check')
    : $('#like').find('.check');
  $check.removeClass('check');
  // 给当前选中项添加选中样式
  const $item = $(event.currentTarget);
  $item.addClass('check');
};

onMounted(() => {
  addItemToList();

  // 点击收起或展开列表
  $(document).on('click', '.sidebar_title', (event) => {
    clickSidebarTitle(event);
  });

  // 点击列表项
  $(document).on('click', '.list_item', (event) => {
    clickSideBarItem(event);
  });
});

watch(
  [() => userPlaylistStore.createList, () => userPlaylistStore.likeList],
  () => {
    addItemToList();
  }
);

watch(
  () => props.checkId,
  () => {
    addItemToList();
  }
);
</script>
