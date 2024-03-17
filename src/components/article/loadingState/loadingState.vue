<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <el-text v-if="loading" v-loading="loading" class="loading"
    >Loading...</el-text
  >
</template>
<style lang="scss"></style>
<script setup lang="ts">
import './loadingState.scss';

const props = defineProps({
  loading: Boolean,
});
</script>
