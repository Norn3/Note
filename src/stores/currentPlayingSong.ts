import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useCurrentSongStore = defineStore('currentSong', () => {
    const songUrl = ref(0);
    return { songUrl }
  })