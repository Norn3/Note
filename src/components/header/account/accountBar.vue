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
import { ref } from 'vue';
import $ from 'jquery';
import { useRouter } from 'vue-router';

import { useLoginStateStore } from '../../../stores/loginState';

import './accountBar.scss';
import { get } from '../../../axios/insatance';

const loginStore = useLoginStateStore();

// 登录

// 点击登录标签，进入登录程序
const showLoginEntry = async () => {
  await get<any>(`/login/cellphone?phone=15992154127&password=zhang2002730`)
    .then((response) => {
      console.log(response);
      loginStore.processLogin(response.cookie);
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
  changeLoginStatus();
};

// 改变登录状态
const changeLoginStatus = async () => {
  const $avatar = $('#avatar');
  if (loginStore.getLoginState()) {
    if (loginStore.getProfile().avatarUrl) {
      console.log(loginStore.getProfile().avatarUrl);

      $avatar.css(
        'background-image',
        `url(${loginStore.getProfile().avatarUrl})`
      );
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
    changeLoginStatus();
  } else {
    router.push({
      name: address,
    });
  }
};
</script>
