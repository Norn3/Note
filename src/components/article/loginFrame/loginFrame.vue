<template>
  <div id="loginPage" class="login_page">
    <div id="opacityBackground" class="opacity_background">
      <div id="loginFrame" class="login_frame">
        <div id="frameTitle" class="frame_title">
          <div class="title_text">登录</div>
          <div
            id="closeFrame"
            class="close_frame"
            @click="hideLoginFrame"
          ></div>
        </div>
        <div id="frameContent" class="frame_content">
          <qrcode-login-form v-show="currentWay == 0"></qrcode-login-form>
          <captcha-login-form v-show="currentWay == 1"></captcha-login-form>
          <password-login-form v-show="currentWay == 2"></password-login-form>
        </div>
        <div id="switchLoginWay" class="switch_login_way">
          <div
            class="pre_way"
            v-show="currentWay != 0"
            @click="currentWay -= 1"
          >
            {{ loginWayText[currentWay - 1] }}
          </div>
          <div
            class="next_way"
            v-show="currentWay != loginWayText.length - 1"
            @click="currentWay += 1"
          >
            {{ loginWayText[currentWay + 1] }}
          </div>
        </div>
      </div>
      <!-- <img src="https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/9643571155/525c/faac/2dc6/fe695c03c7c358ddaa4651736b26a55f.png" alt="提示图片 ············"> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useLoginStateStore } from '../../../stores/loginState';

import passwordLoginForm from './passwordLoginForm/passwordLoginForm.vue';
import captchaLoginForm from './captchaLoginForm/captcahLoginForm.vue';
import qrcodeLoginForm from './qrcodeLoginForm/qrcodeLoginForm.vue';

import './loginFrame.scss';

const router = useRouter();
const route = useRoute();

const loginStore = useLoginStateStore();

const currentWay = ref(1);

const loginWayText = ['扫码登录', '验证码登录', '账号密码登录'];

const hideLoginFrame = () => {
  loginStore.hideLoginEntry();
};
</script>
