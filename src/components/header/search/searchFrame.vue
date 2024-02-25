<template>
  <div id="search" class="search">
    <el-autocomplete
      v-model="keyword"
      class="search_frame"
      :popper-class="popper_class"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      clearable
      placeholder="音乐/用户"
      @select="handleSelect"
      @keyup.enter="jumpResult"
    >
      <template #default="{ item }">
        <div>
          <span v-if="item.index == 0" class="category">{{
            item.category + '\u3000'
          }}</span>
          <span v-else class="category">{{ '\u3000\u3000\u3000' }}</span>
          <span class="name">{{ item.name }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup lang="ts">
import $ from 'jquery';
import { onMounted, ref } from 'vue';
import { get } from '../../../axios/insatance';
import { useRouter, useRoute } from 'vue-router';

import './searchFrame.scss';

onMounted(() => {
  const search = $('.search');
  const input = search.find('input')[0];
  const searchElement = search[0];
  input.addEventListener('focus', () => {
    searchElement.classList.add('focus');
  });
  input.addEventListener('blur', () => {
    searchElement.classList.remove('focus');
  });
});

const props = defineProps({
  popper_class: String,
});

let keyword = ref('');
const router = useRouter();

interface SourceItemObj {
  category: string;
  name: string;
  index: number;
}
const mySource = ref<SourceItemObj[]>([
  {
    category: 'none',
    name: 'none',
    index: 0,
  },
]);

const querySearch = (queryString: string, cb: any) => {
  let results: SourceItemObj[] = [];
  searchFn(queryString)
    .then((proxyArray) => {
      results = Array.from(proxyArray);
      cb(results);
    })
    .catch((error) => {
      console.error('Promise rejected:', error);
    });
};

// queryString：input输入内容
const searchFn = async (queryString: string) => {
  await get<any>(`/search/suggest?keywords=${queryString}`)
    .then((response) => {
      // 处理返回的查询结果
      const result = response.result;
      let arr: Array<SourceItemObj> = [];
      let id = 0;
      if (result.songs) {
        result.songs.forEach((element: SourceItemObj) => {
          let item: SourceItemObj = {
            category: '单曲',
            name: element.name,
            index: id++,
          };
          arr.push(item);
        });
      }

      if (result.artists) {
        id = 0;
        result.artists.forEach((element: SourceItemObj) => {
          let item: SourceItemObj = {
            category: '歌手',
            name: element.name,
            index: id++,
          };
          arr.push(item);
        });
      }

      if (result.albums) {
        id = 0;
        result.albums.forEach((element: SourceItemObj) => {
          let item: SourceItemObj = {
            category: '专辑',
            name: element.name,
            index: id++,
          };
          arr.push(item);
        });
      }

      if (result.playlists) {
        id = 0;
        result.playlists.forEach((element: SourceItemObj) => {
          let item: SourceItemObj = {
            category: '歌单',
            name: element.name,
            index: id++,
          };
          arr.push(item);
        });
      }
      mySource.value = arr;
    })
    .catch((error) => {
      // 处理请求错误
      console.log(error);
    });

  return mySource.value;
};

const jumpResult = () => {
  router.push({
    name: 'search',
    query: { keyword: keyword.value },
  });
};

// 点击搜索联想结果，打开页面
const handleSelect = (item: string) => {
  console.log(item);
};
</script>
