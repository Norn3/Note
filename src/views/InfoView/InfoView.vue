<template>
  <main class="info_view">
    <section>
      <info-page
        :type="String(route.query.type)"
        :target_id="String(route.query.id)"
      ></info-page>
      <el-tabs
        v-model="activeName"
        class="infoView_tabs"
        @tab-change="handleActiveNameChange"
      >
        <el-tab-pane label="歌曲" name="songList">
          <song-list
            v-if="String(route.query.type) != 'song'"
            :type="String(route.query.type)"
            :target_id="String(route.query.id)"
          ></song-list>
        </el-tab-pane>
        <el-tab-pane label="评论" name="commentList">
          <comment-list
            :type="String(route.query.type)"
            :target_id="String(route.query.id)"
          ></comment-list>
        </el-tab-pane>
      </el-tabs>
    </section>
  </main>
</template>
<style lang="scss" scoped></style>

<script setup lang="ts">
// 展示歌曲、歌单等资源的信息，无侧边栏

// import { useRoute } from 'vue-router'
import { useRoute } from 'vue-router';

import InfoPage from '../../components/article/InfoPage/InfoPage.vue';
import songList from '../../components/article/songList/songList.vue';
import commentList from '../../components/article/commentList/commentList.vue';
import { ref } from 'vue';

import './InfoView.scss';
// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();

const activeName = ref('songList');

const handleActiveNameChange = () => {
  // console.log(activeName.value);
};
</script>
