<script setup lang="ts">
import $ from 'jquery';
import './mainBanner.scss';

import { get } from '../../../../axios/insatance';
import { onBeforeMount, reactive } from 'vue';

// import Swiper core and required modules
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/a11y';

interface Picture {
  src: string;
  url: string;
}
let pictureList: Array<Picture> = reactive([]);
const getPicture = async () => {
  await get<any>('/banner')
    .then((response) => {
      // 处理返回的用户数据
      console.log('请求成功');
      console.log(response.banners);

      response.banners.forEach((element: any) => {
        const picture: Picture = { src: element.imageUrl, url: element.url };
        pictureList.push(picture);
      });
      console.log(pictureList);
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

onBeforeMount(async () => {
  await getPicture();
});

const onSwiper = (swiper: any) => {
  // console.log('onSwiper');*
};
const onSlideChange = () => {
  // console.log('slide change');
};

$(document).on('click', '[id^="mySlide"]', (e) => {
  // e.target是DOM对象，只能用getAttribute而非attr方法
  const url = e.target.getAttribute('url');
  console.log(url);

  if (url != null && url != 'null') {
    window.open(url, '_blank');
  }
});

const modules = [Navigation, Pagination, A11y, Autoplay];
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
      <swiper-slide
        id="mySlide0"
        v-for="(picture, index) in pictureList"
        :key="index"
      >
        <img alt="Slide0" :src="picture.src" :url="picture.url" />
      </swiper-slide>
    </swiper>
  </div>
</template>
