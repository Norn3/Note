<script setup lang="ts">
import { ref } from 'vue';
import { get } from '../../../axios/insatance';

import './searchFrame.scss';

const value = ref('');
const allowEmptyValueSearch = ref(false);

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
  if (item.index == 0) return `${item.category}：${item.name}`;
  else return `\u3000\u3000\u3000${item.name}`;
};
//trem：input输入内容
const searchFn = async (trem: string) => {
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
const selectValue = (e: Event) => {
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
      :delay="500"
      :formatter="formatter"
      :source="mySource"
      :search-fn="searchFn"
      is-searching
      v-model="value"
      :allow-empty-value-search="allowEmptyValueSearch"
      :select-value="selectValue"
      :trans-input-focus-emit="transInputFocusEmit"
      :position="position"
      :width="200"
      :append-to-body="false"
    >
      <template #searching="slotProps">
        <div>
          {{ `searching: ${slotProps}` }}
        </div>
      </template>
    </d-auto-complete>
  </div>
</template>
