<script setup lang="ts">
import $ from 'jquery';
import { useRouter } from 'vue-router';

$(document).on('click', '.house', () => {
  jumpPage();
});

const router = useRouter();
const jumpPage = () => {
  router.push({
    name: 'play',
  });
};
</script>

<template>
  <div class="background">
    <div class="tree">
      <div class="leaf"></div>
    </div>
    <div class="house"></div>
    <div class="ground"></div>
  </div>
</template>
<style scoped>
.background {
  background-color: skyblue;
  min-width: 100%;
  min-height: 100%;
  left: 0px;
  top: 0px;
  position: absolute;
}
.ground {
  background-color: darkgreen;
  min-width: 100%;
  min-height: 30%;
  left: 0px;
  top: 70%;
  position: absolute;
}
.house {
  background-color: rgba(155, 94, 38, 1);
  z-index: 1;
  min-width: 400px;
  min-height: 300px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
.leaf {
  background-color: green;
  border-radius: 50%;
  z-index: 2;
  min-width: 300px;
  min-height: 300px;
  left: 90%;
  top: 40%;
  transform: translate(-50%, -50%);
  position: absolute;
}
</style>
