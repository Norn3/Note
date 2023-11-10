<script setup lang="ts">
import $ from 'jquery';
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
import 'swiper/scss/a11y';

const onSwiper = (swiper: any) => {
  get<any>('/banner')
    .then((response) => {
      // 处理返回的用户数据
      console.log('请求成功');
      pictureList = response.banners;
      console.log(pictureList);
      let id = 0;
      pictureList.forEach((element) => {
        let $swiperslide = $(`#mySlide${id++} img`);
        $swiperslide.attr('src', `${element.imageUrl}`);
        $swiperslide.attr('url', `${element.url}`);
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};
const onSlideChange = () => {
  // console.log('slide change');
};

$(document).on('click', '[id^="mySlide"]', (e) => {
  // e.target是DOM对象，只能用getAttribute而非attr方法
  const url = e.target.getAttribute('url');
  if (url != null && url != 'null') {
    window.open(url, '_blank');
  }
});

const modules = [Navigation, Pagination, A11y, Autoplay];
let pictureList: Array<any>;
</script>

<template>
  <div id="mainBanner" class="mainBanner">
    <swiper
      id="mySwiper"
      :modules="modules"
      :slides-per-view="1"
      :space-between="50"
      :navigation="true"
      :rewind="true"
      :pagination="{ clickable: true }"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
    >
      <swiper-slide id="mySlide0"><img alt="Slide0" /></swiper-slide>
      <swiper-slide id="mySlide1"><img alt="Slide1" /></swiper-slide>
      <swiper-slide id="mySlide2"><img alt="Slide2" /></swiper-slide>
      <swiper-slide id="mySlide4"><img alt="Slide4" /></swiper-slide>
      <swiper-slide id="mySlide5"><img alt="Slide5" /></swiper-slide>
      <swiper-slide id="mySlide6"><img alt="Slide6" /></swiper-slide>
      <swiper-slide id="mySlide7"><img alt="Slide7" /></swiper-slide>
      ...
    </swiper>
  </div>
</template>
