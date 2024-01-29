<script setup lang="ts">
import { ref } from 'vue';
import { get } from '../../../axios/insatance';
import { useRouter, useRoute } from 'vue-router';

import './searchFrame.scss';

let keyword = ref('');
const allowEmptyValueSearch = ref(false);
let chosen_category = '';
const router = useRouter();

interface SourceItemObj {
  category: string;
  name: string;
  index: number;
}
type SourceType = Array<string> | Array<SourceItemObj>;
const mySource = ref<SourceType>([
  {
    category: 'none',
    name: 'none',
    index: 0,
  },
]);

const formatter = (item: SourceItemObj) => {
  chosen_category = item.category;
  return item.name;
};

//trem：input输入内容
const searchFn = async (trem: string) => {
  keyword.value = trem;
  await get<any>(`/search/suggest?keywords=${trem}`)
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
      console.log(arr);
      mySource.value = arr;
    })
    .catch((error) => {
      // 处理请求错误
      console.log(error);
    });

  return mySource.value;
};

const jumpResult = (event: any) => {
  let value = event.target.value;
  router.push({
    name: 'search',
    query: { keyword: value },
  });
  keyword.value = value;
};

// 点击搜索联想结果，打开页面
const selectValue = (e: string) => {
  console.log(e);
  console.log(chosen_category);

  get<any>(`/search/suggest?keywords=${e}`)
    .then((song) => {
      // 处理返回的用户数据
      console.log(song);
    })
    .catch((error) => {
      // 处理请求错误
      console.log(error);
    });
};

const transInputFocusEmit = () => {
  // console.log('transInputFocusEmit');
};
const position = ref(['bottom']);
</script>

<template>
  <div id="search" class="search">
    <d-auto-complete
      :delay="200"
      :source="mySource"
      :search-fn="searchFn"
      :formatter="formatter"
      is-searching
      v-model="keyword"
      @keyup.enter="jumpResult"
      :allow-empty-value-search="allowEmptyValueSearch"
      :select-value="selectValue"
      :trans-input-focus-emit="transInputFocusEmit"
      :position="position"
      :width="200"
      :append-to-body="false"
    >
      <template #item="slotProps">
        <div>
          <span v-if="slotProps.item.index == 0">{{
            slotProps.item.category + '\u3000'
          }}</span>
          <span v-else>{{ '\u3000\u3000\u3000' }}</span>
          <span>{{ slotProps.item.name }}</span>
        </div>
      </template>
      <template #nothing="slotProps">
        <div>
          {{ `没有匹配项: ${slotProps}` }}
        </div>
      </template>
      <template #searching="slotProps">
        <div>
          {{ `searching: ${slotProps}` }}
        </div>
      </template>
    </d-auto-complete>
  </div>
</template>
