<template>
  <div id="categoryContainer" class="category_container">
    <div id="all" class="all" @click="jumpPage('全部')">全部</div>
    <dl
      id="cateList"
      class="cate_list"
      v-for="(value, index) in category_list"
      :key="index"
    >
      <dt id="mianCate" class="mian_cate">{{ value }}</dt>
      <dd id="subCate" class="sub_cate">
        <a
          href="javascript:void(0);"
          v-for="(value, key) in sub_category_list[index]"
          :key="key"
          @click="jumpPage(value)"
          >{{ value }}</a
        >
      </dd>
    </dl>
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $ from 'jquery';
import { onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { get } from '../../../axios/insatance';

import './selectCategory.scss';

// 获取所有类别
let category_list: Array<string> = reactive([]);
interface SubItem {
  category: number;
  name: string;
}
let sub_category_list: Array<Array<string>> = reactive([]);

const createItem = async () => {
  await get<any>(`/playlist/catlist`)
    .then((response) => {
      for (let item in response.categories) {
        category_list.push(response.categories[item]);
        sub_category_list.push([]);
      }
      response.sub.forEach((element: SubItem) => {
        sub_category_list[element.category].push(element.name);
      });
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

// 路由跳转方法
const router = useRouter();
const jumpPage = (cate: string) => {
  router.replace({
    name: 'playlist',
    query: { category: cate },
  });
};
onBeforeMount(() => {
  createItem();
});
</script>
