<template>
  <div id="mainBanner" class="mainBanner">
    <loading-state :loading="loading" class="loading"></loading-state>
    <swiper
      v-if="!loading"
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
        :key="'mySlide' + index"
        @click="jumpPage(picture)"
      >
        <div
          class="background"
          :style="{ 'background-image': `url(${picture.src})` }"
        >
          <img
            alt="Slide"
            :src="picture.src"
            :url="picture.url"
            :targetType="picture.targetType"
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
import { onBeforeMount, reactive, ref } from 'vue';
import loadingState from '../../loadingState/loadingState.vue';

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
  url: string;
  targetType: number;
  targetId: {
    type: number;
    default: 0;
  };
}
const pictureList: Array<Picture> = reactive([]);
const loading = ref(true);
const getPicture = async () => {
  await get<any>('/banner')
    .then((response) => {
      console.log(response);

      // 处理返回的用户数据
      response.banners.forEach((element: any) => {
        const picture: Picture = {
          src: element.imageUrl,
          url: element.url,
          targetType: element.targetType,
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
  loading.value = false;
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

const jumpPage = (slideItem: Picture) => {
  console.log(slideItem);

  if (slideItem.url != null) {
    window.open(slideItem.url as string, '_blank');
  } else if (slideItem.targetId != null || slideItem.targetId != 0) {
    let type = '';
    switch (slideItem.targetType) {
      case 1:
        type = 'song';
        break;
      case 10:
        type = 'album';
        break;
      case 100:
        type = 'singer';
        break;
      case 1000:
        type = 'playlist';
        break;
    }
    if (type != '') {
      router.push({
        name: 'Info',
        query: { type: type, id: Number(slideItem.targetId) },
      });
    }
  }
};

const modules = [Navigation, Pagination, A11y, Autoplay];
</script>
