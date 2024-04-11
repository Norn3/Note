<template>
  <el-form
    ref="passwordLoginFormRef"
    :model="phoneAndPassword"
    :rules="rules"
    label-position="left"
    label-width="auto"
    size="large"
    class="password_login_form"
  >
    <el-form-item prop="phone">
      <el-input
        v-model="phoneAndPassword.phone"
        placeholder="请输入手机号"
        clearable
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="phoneAndPassword.password"
        placeholder="请输入密码"
        type="password"
        show-password
        clearable
        @keyup.enter="onSubmit(passwordLoginFormRef)"
      />
    </el-form-item>
    <el-form-item>
      <el-button class="submit_button" @click="onSubmit(passwordLoginFormRef)"
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

import './passwordLoginForm.scss';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';

import { Md5 } from 'ts-md5';

const router = useRouter();
const route = useRoute();

const loginStore = useLoginStateStore();

const passwordLoginFormRef = ref<FormInstance>();

// TODO：未验证外国手机号
const validatePhone = (rule: any, value: any, callback: any) => {
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
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'));
  } else {
    callback();
  }
};

const phoneAndPassword = reactive({
  phone: '',
  password: '',
});

const rules = reactive<FormRules<typeof phoneAndPassword>>({
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
});

const onSubmit = (formInstance: FormInstance | undefined) => {
  if (!formInstance) return;
  formInstance.validate(async (valid) => {
    if (!valid) {
      return;
    } else {
      // 定义MD5对象
      const md5: any = new Md5();
      md5.appendAsciiStr(phoneAndPassword.password);
      const password = md5.end();
      const login_result = await loginStore.processLogin(
        'password',
        phoneAndPassword.phone,
        password
      );
      console.log(login_result);

      // 登录成功
      if (login_result) {
        // 隐藏登录框
        loginStore.hideLoginEntry();
        // 清空登录框内的账号密码
        if (formInstance) {
          formInstance.resetFields();
        }
        // 跳转到首页
        router.push({ name: 'recommend' });
        sessionStorage.setItem('lastPathName', 'recommend');
      }
      // 登录失败
      else {
        console.log('失败');

        ElMessage({
          message: '账号或密码不正确！',
          type: 'error',
          customClass: 'el_message',
        });
      }
    }
  });
};
</script>
