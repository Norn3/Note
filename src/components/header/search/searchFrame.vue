<script setup lang="ts">
import { ref } from 'vue';

import './searchFrame.scss';

// defineProps<{ keyword: string }>()

const keyword = ref<string | null>('');
</script>

<template>
  <div id="search" class="search">
    <input type="search" placeholder="search" v-model="keyword" />
  </div>
</template>
