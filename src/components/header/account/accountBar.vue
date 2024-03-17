<script setup lang="ts">
import { ref } from 'vue';
import $ from 'jquery';
import { useRouter } from 'vue-router';

import './accountBar.scss';

// defineProps<{ keyword: string }>()

// 头像
$(document).on('mouseenter', '#avatar', () => {
  $('#accountMenu')[0].style.display = 'block';
});
$(document).on('mouseover', '#account', () => {
  if ($('#accountMenu')[0].style.display == 'block') {
    $('#accountMenu')[0].style.display = 'block';
  }
});
$(document).on('mouseleave', '#account', () => {
  $('#accountMenu')[0].style.display = 'none';
});

// 菜单

const router = useRouter();
const jumpPage = (address: string) => {
  router.push({
    name: address,
  });
};

const accountMenuList = [
  { id: 0, text: '我的主页', address: 'accountHome' },
  { id: 1, text: '我的信息', address: 'accountMessage' },
  { id: 2, text: '个人设置', address: 'accountInformation' },
];
</script>

<template>
  <div id="account" class="account">
    <div id="avatar" class="avatar"></div>
    <div id="accountMenu" class="accountMenu">
      <ul>
        <li
          v-for="item in accountMenuList"
          :key="'accountMenuList' + item.id"
          @click="jumpPage(item.address)"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>
