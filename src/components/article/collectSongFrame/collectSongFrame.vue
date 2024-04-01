<template>
  <div id="collectSongPage" class="collect_song_page">
    <div id="opacityBackground" class="opacity_background">
      <div id="collectSongFrame" class="collect_song_frame">
        <div id="frameTitle" class="frame_title">
          <div class="title_text">添加到歌单</div>
          <div
            id="closeFrame"
            class="close_frame"
            @click="hideCollectSongFrame"
          ></div>
        </div>
        <div id="frameContent" class="frame_content">
          <ul
            id="userCreateList"
            class="user_create_list"
            v-if="!showCreatePlaylistEntry"
          >
            <li
              id="createPlaylist"
              class="create_playlist"
              @click="showCreatePlaylistFrame"
            >
              新歌单
            </li>
            <li
              id="userListItem"
              class="user_list_item"
              v-for="(item, index) in userPlaylist"
              :key="index"
              @click="addToPlaylist(item.id)"
            >
              <img :src="item.coverImgUrl" alt="" id="cover" class="cover" />
              <div id="name" class="name">{{ item.name }}</div>
              <div id="description" class="description">
                {{ item.trackCount + '首' }}
              </div>
            </li>
          </ul>
          <el-form
            v-if="showCreatePlaylistEntry"
            ref="createPlaylistFormRef"
            :model="createPlaylist"
            :rules="rules"
            label-position="left"
            label-width="auto"
            size="large"
            class="create_playlist_form"
          >
            <el-form-item prop="name">
              <el-input
                v-model="createPlaylist.name"
                placeholder="请输入歌单名"
                clearable
              />
            </el-form-item>
            <el-form-item class="text">
              *创建歌单后会将歌曲收藏到该歌单中
            </el-form-item>
            <el-form-item class="buttons">
              <el-button
                class="submit_button button"
                @click="onSubmit(createPlaylistFormRef)"
                >创建</el-button
              >
              <el-button
                class="cancel_button button"
                @click="hideCollectSongFrame"
                >取消</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref, nextTick, reactive, watch, render, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useuserPlaylistStore } from '../../../stores/userPlaylist';

import type { FormInstance, FormRules } from 'element-plus';

import './collectSongFrame.scss';

const router = useRouter();
const route = useRoute();

const userPlaylistStore = useuserPlaylistStore();

const userPlaylist = ref<any[]>([]);

const showCreatePlaylistEntry = ref(false);

const createPlaylistFormRef = ref<FormInstance>();

// TODO：可以加一个单选项，选择歌单是否隐私
const createItem = () => {
  userPlaylist.value.splice(
    0,
    userPlaylist.value.length,
    ...userPlaylistStore.getCreateList()
  );
};
const addToPlaylist = (pid: string) => {
  userPlaylistStore.processSongInPlaylist('add', pid);
};

const showCreatePlaylistFrame = () => {
  showCreatePlaylistEntry.value = true;
};

const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入歌单名！'));
  } else {
    callback();
  }
};
const createPlaylist = reactive({
  name: '',
});

const rules = reactive<FormRules<typeof createPlaylist>>({
  name: [{ validator: validateName, trigger: 'blur' }],
});

const onSubmit = (formInstance: FormInstance | undefined) => {
  if (!formInstance) return;
  formInstance.validate(async (valid) => {
    if (!valid) {
      return;
    } else {
      userPlaylistStore.createPlaylist(createPlaylist.name);
    }
  });
};

const hideCollectSongFrame = () => {
  showCreatePlaylistEntry.value = false;
  userPlaylistStore.hideCollectFrame();
};

onMounted(() => {
  createItem();
});

// TODO: 有延迟，短时间之内getCreateList()结果不变，再次打开还是显示原来的列表
watch(
  () => userPlaylistStore.createList,
  () => {
    createItem();
  },
  { deep: true }
);
</script>
