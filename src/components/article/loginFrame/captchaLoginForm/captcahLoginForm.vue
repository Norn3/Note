<template>
  <el-form
    ref="captchaLoginFormRef"
    :model="phoneAndCaptcha"
    :rules="rules"
    label-position="left"
    label-width="auto"
    size="large"
    class="captcha_login_form"
    :inline="true"
  >
    <el-form-item prop="phone">
      <el-input
        v-model="phoneAndCaptcha.phone"
        placeholder="请输入手机号"
        class="phone_input"
        clearable
      />
    </el-form-item>
    <el-form-item prop="captcha">
      <el-input
        v-model="phoneAndCaptcha.captcha"
        placeholder="请输入验证码"
        class="captcha_input"
        clearable
        @keyup.enter="onSubmit(captchaLoginFormRef)"
      />
    </el-form-item>
    <el-form-item class="keep_inline">
      <el-button
        class="get_captcha_button"
        @click="getCaptcha()"
        :disabled="!allow_send_captcha"
        >{{ send_button_text }}</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-button class="submit_button" @click="onSubmit(captchaLoginFormRef)"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useLoginStateStore } from '../../../../stores/loginState';

import './captchaLoginForm.scss';
import type { FormInstance, FormRules } from 'element-plus';
import { get } from '../../../../axios/insatance';

const router = useRouter();
const route = useRoute();

const loginStore = useLoginStateStore();

const allow_send_captcha = ref(true);
let send_button_text = ref('获取验证码');

// // 命名settimeout和setinterval
// let reset: any = null;
// let countdown: any = null

const captchaLoginFormRef = ref<FormInstance>();

// TODO：未验证外国手机号
const validatePhone = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入手机号！'));
  } else {
    const phone_reg =
      /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!phone_reg.test(value)) {
      callback(new Error('请输入正确的手机号！'));
    }
    callback();
  }
};

const validateCaptcha = (rule: any, value: string, callback: any) => {
  const regex = /^\d+$/;
  if (value === '') {
    callback(new Error('请输入验证码！'));
  } else {
    if (value.length > 6 || value.length < 4 || !regex.test(value)) {
      callback(new Error('请输入正确的验证码！'));
    } else {
      get<any>(
        `/captcha/verify?phone=${phoneAndCaptcha.phone}&captcha=${value}`
      )
        .then((response) => {
          console.log(response);
          callback();
        })
        .catch((error) => {
          // 处理请求错误
          callback(new Error('验证码错误！'));
        });
    }
  }
};

const phoneAndCaptcha = reactive({
  phone: '',
  captcha: '',
});

const rules = reactive<FormRules<typeof phoneAndCaptcha>>({
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
});

const getCaptcha = () => {
  if (!captchaLoginFormRef.value) return;
  captchaLoginFormRef.value.validateField('phone', (valid) => {
    if (!valid) return;
    else {
      get<any>(`/captcha/sent?phone=${phoneAndCaptcha.phone}`)
        .then((response) => {
          allow_send_captcha.value = false;
          console.log(response);
          let time = 60;
          let countdown = setInterval(() => {
            send_button_text.value = `${--time}秒后重新获取`;
          }, 1000);
          setTimeout(() => {
            clearInterval(countdown);
            send_button_text.value = '获取验证码';
            allow_send_captcha.value = true;
          }, 60000);
        })
        .catch((error) => {
          // 处理请求错误
          console.log('发送验证码失败');
          console.log(error);
        });
    }
  });
};

const onSubmit = (formInstance: FormInstance | undefined) => {
  if (!formInstance) return;
  formInstance.validate(async (valid) => {
    if (!valid) {
      return;
    } else {
      const login_result = await loginStore.processLogin(
        'captcha',
        phoneAndCaptcha.phone,
        phoneAndCaptcha.captcha
      );
      // 登录成功
      if (login_result) {
        // 隐藏登录框
        loginStore.hideLoginEntry();
        // 清空登录框内的内容
        if (formInstance) {
          formInstance.resetFields();
        }
        // 跳转到首页
        router.push({ name: 'recommend' });
        sessionStorage.setItem('lastPathName', 'recommend');
      }
      // 登录失败
      else {
        alert('手机号或验证码不正确！');
      }
    }
  });
};

watch(
  () => loginStore.useLogin,
  (newValue) => {
    console.log(newValue);
    if (newValue) {
      // clearTimeout(reset);
      // clearInterval(countdown);
      // send_button_text.value = '获取验证码';
      // allow_send_captcha.value = true;
      captchaLoginFormRef.value?.resetFields();
    }
  }
);
</script>
