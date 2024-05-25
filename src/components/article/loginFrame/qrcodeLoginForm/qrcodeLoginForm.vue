<template>
  <div id="qrcodeLoginForm" class="qrcode_login_form">
    <div class="qrcode_picture"></div>
    <div id="qrcodeContainer" class="qrcode_container">
      <div class="mask" v-if="qrcodeState != 801">
        <div class="message" v-if="qrcodeState != 801">{{ message }}</div>
        <el-button
          class="re_get_code"
          @click="reGetCode"
          v-if="qrcodeState == 800 || qrcodeState == 802"
          >刷新二维码</el-button
        >
      </div>
      <div id="qrcode" class="qrcode">
        <img :src="imageSrc" alt="二维码图片" />
      </div>
      <div id="qrcodeText" class="qrcode_text">请使用网易云APP扫码登录</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useLoginStateStore } from '../../../../stores/loginState';

import './qrcodeLoginForm.scss';
import { get } from '../../../../axios/insatance';

const router = useRouter();
const route = useRoute();

const loginStore = useLoginStateStore();

const key = ref('');
const imageSrc = ref('');
const base64Data = ref('');
const message = ref('');
const qrcodeState = ref(801);
let checkQRCode: any = null;

const getKey = async () => {
  let key = '';
  await get<any>(`/login/qr/key?timestamp=${Date.now()}`)
    .then(async (response) => {
      if (response.code == 200) {
        key = response.data.unikey;
      }
    })
    .catch((error) => {
      // 处理请求错误
      console.log('获取二维码key失败');
      console.log(error);
    });
  return key;
};

const getBase64Data = async (): Promise<string> => {
  let qrimg = '';
  key.value = await getKey();
  if (key.value == '') return '';
  await get<any>(
    `/login/qr/create?key=${key.value}&qrimg=true&timestamp=${Date.now()}`
  )
    .then(async (response) => {
      console.log(response);
      if (response.code == 200) console.log(response);
      qrimg = response.data.qrimg;
    })
    .catch((error) => {
      // 处理请求错误
      console.log('获取二维码base64失败');
      console.log(error);
    });
  return qrimg;
};

const getQRCode = async () => {
  const img = new Image();
  base64Data.value = await getBase64Data();
  if (base64Data.value == '') return;
  img.src = base64Data.value;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context?.drawImage(img, 0, 0);

    const imageURL = canvas.toDataURL('image/png');
    imageSrc.value = imageURL;
  };
};
onMounted(() => {
  getQRCode();
});

const reGetCode = () => {
  getQRCode();
};

watch(
  () => loginStore.useLogin,
  (newValue) => {
    if (newValue) {
      if (key.value == '') return;
      console.log(key.value);
      checkQRCode = setInterval(async () => {
        await get<any>(
          `/login/qr/check?key=${key.value}&timestamp=${Date.now()}`
        )
          .then(async (response) => {
            console.log(response.code);

            switch (response.code) {
              case 800: {
                qrcodeState.value = 800;
                message.value = '二维码已过期';
                break;
              }
              case 801: {
                message.value = '';
                qrcodeState.value = 801;
                break;
              }
              case 802: {
                message.value = '请在app中确认登录';
                qrcodeState.value = 802;
                break;
              }
              case 803: {
                message.value = '登录成功';
                qrcodeState.value = 803;
                loginStore.hideLoginEntry();
                loginStore.getLoginStatus();
                // 跳转到首页
                router.push({ name: 'recommend' });
                sessionStorage.setItem('lastPathName', 'recommend');
              }
            }
          })
          .catch((error) => {
            // 处理请求错误
            console.log('轮询二维码失败');
            console.log(error);
          });
      }, 3000);
    } else {
      clearInterval(checkQRCode);
    }
  }
);
</script>
