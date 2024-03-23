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
          <el-form
            label-position="left"
            label-width="auto"
            :model="phoneAndPassword"
            size="large"
            class="password_login_form"
          >
            <el-form-item>
              <el-input
                v-model="phoneAndPassword.phone"
                placeholder="请输入手机号"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="phoneAndPassword.password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button class="submit_button" @click="onSubmit"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
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

import './loginFrame.scss';

const router = useRouter();
const route = useRoute();

const loginStore = useLoginStateStore();

const phoneAndPassword = reactive({
  phone: '',
  password: '',
});

const onSubmit = async () => {
  console.log(phoneAndPassword);
  const login_result = await loginStore.processLogin(
    phoneAndPassword.phone,
    phoneAndPassword.password
  );
  if (login_result) {
    loginStore.hideLoginEntry();
    router.push({ name: 'recommend' });
    sessionStorage.setItem('lastPathName', 'recommend');
  } else {
    alert('账号或密码不正确');
  }
};

const hideLoginFrame = () => {
  loginStore.hideLoginEntry();
};
</script>
