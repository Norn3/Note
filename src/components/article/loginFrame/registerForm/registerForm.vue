<template>
  <el-form
    ref="registerFormRef"
    :model="register"
    :rules="rules"
    label-position="left"
    label-width="auto"
    class="register_form"
    :inline="true"
  >
    <el-form-item prop="phone">
      <el-input
        v-model="register.phone"
        placeholder="请输入手机号"
        class="input"
        clearable
      />
    </el-form-item>
    <el-form-item prop="captcha">
      <el-input
        v-model="register.captcha"
        placeholder="请输入验证码"
        class="captcha_input"
        clearable
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
    <el-form-item prop="name">
      <el-input
        v-model="register.name"
        placeholder="请输入昵称"
        class="input"
        clearable
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="register.password"
        placeholder="请输入密码"
        class="input"
        type="password"
        show-password
        clearable
        @keyup.enter="onSubmit(registerFormRef)"
      />
    </el-form-item>
    <el-form-item>
      <el-button class="submit_button" @click="onSubmit(registerFormRef)"
        >注册</el-button
      >
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useLoginStateStore } from '../../../../stores/loginState';

import './registerForm.scss';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';

import { Md5 } from 'ts-md5';
import { get } from '../../../../axios/insatance';

const router = useRouter();
const route = useRoute();

const loginStore = useLoginStateStore();

const registerFormRef = ref<FormInstance>();

const allow_send_captcha = ref(true);
let send_button_text = ref('获取验证码');

// TODO：未验证外国手机号
const validatePhone = (rule: any, value: any, callback: any) => {
  const phone_reg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (value === '') {
    callback(new Error('请输入手机号！'));
  } else if (!phone_reg.test(value)) {
    callback(new Error('请输入正确的手机号！'));
  } else {
    get<any>(`/cellphone/existence/check?phone=${value}`).then((response) => {
      if (response.exist != -1) {
        callback(new Error('该手机号已注册！'));
      } else {
        callback();
      }
    });
  }
};
const validateCaptcha = (rule: any, value: string, callback: any) => {
  const regex = /^\d+$/;
  if (value === '') {
    callback(new Error('请输入验证码！'));
  } else if (value.length > 6 || value.length < 4 || !regex.test(value)) {
    callback(new Error('请输入正确的验证码！'));
  } else {
    get<any>(`/captcha/verify?phone=${register.phone}&captcha=${value}`)
      .then((response) => {
        console.log(response);
        callback();
      })
      .catch((error) => {
        // 处理请求错误
        callback(new Error('验证码错误！'));
      });
  }
};
const validateName = (rule: any, value: any, callback: any) => {
  const name_reg = /^[\u4E00-\u9FFF\w-]+$/;
  if (value === '') {
    callback(new Error('请输入昵称！'));
  } else if (!name_reg.test(value)) {
    callback(new Error('昵称内只允许存在汉字、字母、数字、-和_'));
  } else {
    let length = 0;
    const regex = /^[\u4E00-\u9FFF]$/;
    for (let i = 0; i < value.length; i++) {
      if (regex.test(value.charAt(i))) {
        length += 2;
      } else {
        length += 1;
      }
    }
    if (length < 4 || length > 30) {
      callback(new Error('昵称长度为4-30个字符'));
    } else {
      get<any>(`/nickname/check?nickname=${value}`)
        .then((response) => {
          console.log(response);
          if (response.duplicated) {
            callback(new Error('昵称已存在'));
          }
          callback();
        })
        .catch((error) => {
          // 处理请求错误
          callback(new Error('昵称检测出现错误'));
        });
    }
  }
};
const validatePassword = (rule: any, value: any, callback: any) => {
  const regex = /^(?=.*[a-zA-Z\d])(?=.*[a-zA-Z\W])(?=.*[\d\W]).{8,20}$/;
  if (value === '') {
    callback(new Error('请输入密码！'));
  } else if (!regex.test(value)) {
    callback(new Error('需要8-20位字符，至少包含字母/数字/符号的任意2种！'));
  } else {
    callback();
  }
};

const register = reactive({
  phone: '',
  captcha: '',
  name: '',
  password: '',
});

const rules = reactive<FormRules<typeof register>>({
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
  name: [{ validator: validateName, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
});

const getCaptcha = () => {
  if (!registerFormRef.value) return;
  registerFormRef.value.validateField('phone', (valid) => {
    if (!valid) return;
    else {
      get<any>(`/captcha/sent?phone=${register.phone}`)
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
      ElMessage({
        message: '注册功能因接口原因暂不可用！',
        type: 'error',
        customClass: 'el_message',
      });
      // // 定义MD5对象
      // const md5: any = new Md5();
      // md5.appendAsciiStr(register.password);
      // const password = md5.end();
      // const register_result = await get<any>(`/register/cellphone?phone=${register.phone}&password=${register.password}&captcha=${register.captcha}&nickname=${register.name}`)

      // // 注册成功
      // if (register_result.code == 200) {
      //     // 隐藏登录框
      //     loginStore.hideLoginEntry();
      //     loginStore.processLogin(
      //         'password',
      //         register.phone,
      //         password
      //     );
      //     // 清空注册框内的账号密码
      //     if (formInstance) {
      //         formInstance.resetFields();
      //     }
      //     // 跳转到首页
      //     router.push({ name: 'recommend' });
      //     sessionStorage.setItem('lastPathName', 'recommend');
      // }
      // // 注册失败
      // else {
      //     alert('注册失败！');
      // }
    }
  });
};
</script>
