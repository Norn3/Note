<template>
  <div class="play_view"></div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import { nextTick, onMounted, reactive, ref, h, render } from 'vue';
import { useRouter } from 'vue-router';
import { get } from '../../axios/insatance';
</script>
