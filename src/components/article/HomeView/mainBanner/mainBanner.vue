<script setup lang="ts">
import $ from 'jquery';
import { nextTick, onMounted, ref } from 'vue';
import './mainBanner.scss';

import { get } from '../../../../axios/insatance';

// import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper/modules';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/scrollbar';
import 'swiper/scss/a11y';

const onSwiper = (swiper: any) => {
  console.log(swiper);
};
const onSlideChange = () => {
  console.log('slide change');
};

const modules = [Navigation, Pagination, Scrollbar, A11y, Autoplay];
// let pictureList: Array<string>;

// console.log('开始发送请求');

// get<any>("/banner")
//   .then((picture) => {
//     // 处理返回的用户数据
//     console.log('请求成功');
//     console.log(picture);
//     pictureList = picture;
//   })
//   .catch((error) => {
//     // 处理请求错误
//     console.log('请求失败');
//     console.log(error);
//   });

// const createPicture = () => {
//   const $pictureComponent = $('#picture');
//   $pictureComponent.removeClass('loading');
//   let id = 0;
//   pictureList.forEach((element) => {
//     // 创建新的子元素并设置其内容
//     const $li = $('<li>').css('background-image',element)
//     $(document).on('click',`#dot${id}`, () =>{

//     })
//     // $li.attr('id','"listItem'+ (father.itemNum - current) +'"');
//     // $li.addClass('listItem');
//     // 将新创建的子元素添加为目标元素的子节点
//     $pictureComponent.append($li);
//   });
// }

// let id = 0;

// const circulate = setInterval(() => {
//   $(`#dot${id++}`).removeClass('check');
//   $(`#dot${id}`).addClass('check');
//   $('#picture')[0].style.backgroundImage = pictureList[id];

// },3000)

// $(document).on('click','.dot',(event) => {
//   clearInterval(circulate);
//   $(`#dot${id}`).removeClass('check');
//   event.target.addClass('check');

// })

// async function getBanner(){
// 	const res = await get<any>("/banner");
//   console.log(res);
// }

// onMounted(async () => {
//   await nextTick();
//   getBanner();
//   // createPicture();
// });
</script>

<template>
  <div id="mainBanner" class="mainBanner">
    <!-- <div id="left" class="left"></div>
    <div id="banner" class="banner">
      <div id="picture" class="picture loading"></div>
      <div id="dots" class="dots">
        <ul>
          <li id="dot0" class="dot check"></li>
          <li id="dot1" class="dot"></li>
          <li id="dot2" class="dot"></li>
          <li id="dot3" class="dot"></li>
          <li id="dot4" class="dot"></li>
          <li id="dot5" class="dot"></li>
          <li id="dot6" class="dot"></li>
          <li id="dot7" class="dot"></li>
          <li id="dot8" class="dot"></li>
          <li id="dot9" class="dot"></li>
        </ul>
      </div>
    </div>
    <div id="right" class="right"></div> -->
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="50"
      :navigation="true"
      :rewind="true"
      :pagination="{ clickable: true }"
      :scrollbar="{ draggable: true }"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
    >
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 4</swiper-slide>
      <swiper-slide>Slide 5</swiper-slide>
      <swiper-slide>Slide 6</swiper-slide>
      ...
    </swiper>
  </div>
</template>
