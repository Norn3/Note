<template>
  <div id="account" class="account">
    <div id="avatar" class="avatar">
      <span
        id="loginEntry"
        v-if="!loginStore.getLoginState()"
        @click="showLoginEntry"
        >登录</span
      >
    </div>
    <div id="accountMenu" class="accountMenu">
      <ul>
        <li
          v-for="item in accountMenuList"
          :key="'accountMenuList' + item.id"
          @click="clickMenuItem(item.address)"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import $ from 'jquery';
import { useRouter } from 'vue-router';

import { useLoginStateStore } from '../../../stores/loginState';

import './accountBar.scss';
import { get } from '../../../axios/insatance';

const loginStore = useLoginStateStore();

// 登录

// TODO: 登录程序还没做
// 点击登录标签，进入登录程序
const showLoginEntry = async () => {
  loginStore.showLoginEntry();
  // router.push({ name: 'recommend' });
  // sessionStorage.setItem('lastPathName', 'recommend');
};

watch(
  () => loginStore.already_login,
  () => {
    console.log(loginStore.already_login);

    changeLoginStatus();
  }
);

// 改变登录状态
const changeLoginStatus = async () => {
  const $avatar = $('#avatar');
  if (loginStore.getLoginState()) {
    const avatarUrl = loginStore.getProfile().avatarUrl;
    if (avatarUrl) {
      // TODO: 头像出错，登录后显示默认的
      $avatar.css('background-image', `url(${avatarUrl})`);
    } else {
      $avatar.addClass('default_avatar');
    }
  } else {
    $avatar.removeClass('default_avatar');
    $avatar.css('background-image', '');
  }
};

// 菜单显隐
$(document).on('mouseenter', '#avatar', () => {
  if (loginStore.getLoginState()) {
    $('#accountMenu')[0].style.display = 'block';
  }
});
$(document).on('mouseover', '#account', () => {
  if ($('#accountMenu')[0].style.display == 'block') {
    $('#accountMenu')[0].style.display = 'block';
  }
});
$(document).on('mouseleave', '#account', () => {
  $('#accountMenu')[0].style.display = 'none';
});

// 菜单跳转
const accountMenuList = [
  { id: 0, text: '我的主页', address: 'accountHome' },
  { id: 1, text: '我的信息', address: 'accountMessage' },
  { id: 2, text: '个人设置', address: 'accountInformation' },
  { id: 3, text: '退出', address: 'exit' },
];

const router = useRouter();
const clickMenuItem = async (address: string) => {
  if (address == 'exit') {
    await loginStore.processLogout();
    $('#accountMenu')[0].style.display = 'none';
    router.push({ name: 'recommend' });
  } else {
    router.push({
      name: address,
    });
    sessionStorage.setItem('lastPathName', 'recommend');
  }
};
</script>
