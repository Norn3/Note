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
        id="mySlide"
        v-for="(picture, index) in pictureList"
        :key="index"
      >
        <div
          class="background"
          :style="{ 'background-image': `url(${picture.src})` }"
        >
          <img
            alt="Slide"
            :src="picture.src"
            :url="picture.url"
            :targetId="picture.targetId"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
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
import router from '../../../../router';

interface Picture {
  src: string;
  url: {
    type: string;
    default: null;
  };
  targetId: {
    type: number;
    default: 0;
  };
}
let pictureList: Array<Picture> = reactive([]);
const getPicture = async () => {
  await get<any>('/banner')
    .then((response) => {
      // 处理返回的用户数据
      response.banners.forEach((element: any) => {
        const picture: Picture = {
          src: element.imageUrl,
          url: element.url,
          targetId: element.targetId,
        };
        pictureList.push(picture);
      });
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

$(document).on('click', '#mySlide', (e) => {
  // e.target是DOM对象，只能用getAttribute而非attr方法
  const url = e.target.getAttribute('url');
  const target_id = e.target.getAttribute('targetId');

  console.log(url);

  if (url != null && url != 'null') {
    window.open(url, '_blank');
  }
  // else if (target_id != null && target_id != 0){
  //   router.push({
  //   name: 'songInfo',
  //   query: { pid: target_id },
  // });
  // }
});

const modules = [Navigation, Pagination, A11y, Autoplay];
</script>
