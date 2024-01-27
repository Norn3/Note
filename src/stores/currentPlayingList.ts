import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


export const useCurrentPlayingListStore = defineStore('currentPlayingList', () => {
    const playingListIds: Array<number> = reactive([]);
    const patchState = ref(false);
    return { playingListIds, patchState }
  })