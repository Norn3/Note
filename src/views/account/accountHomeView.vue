<template>
  <div class="account_view">
    <main>
      <section>
        <div id="userInfoContainer" class="user_info_container">
          <div id="userAvatar" class="user_avatar"></div>
          <div id="userBasicInfo" class="user_basic_info">
            <div id="userName" class="user_name">{{ userName }}</div>
            <div id="userLevel" class="user_level">{{ 'Lv.' + userLevel }}</div>
            <div id="userGender" class="user_gender"></div>
          </div>
          <div id="followInfo" class="follow_info">
            <div id="userFollows" class="user_follows">
              <span class="follow_num">{{ userFollows }}</span
              ><span>关注</span>
            </div>
            <div id="userFolloweds" class="user_followeds">
              <span class="follow_num">{{ userFolloweds }}</span
              ><span>粉丝</span>
            </div>
          </div>
          <div id="userAddressAndAge" class="user_address_and_age">
            <div id="userAddress" class="user_address">
              {{ '地址：' + userProvince + '-' + userCity }}
            </div>
            <div id="userAge" class="user_age">
              {{ '年龄：' + userAge + '岁' }}
            </div>
          </div>
          <!-- <div id="userCreateDays" class="user_create_days">
            {{ '这是您加入我们的第' + userCreateDays + '天' }}
          </div>
          <div id="userListenedSongs" class="user_listened_songs">
            {{ '您已听歌' + userListenedSongs + '首' }}
          </div> -->
        </div>
        <div
          id="personalPlaylist"
          class="personal_playlist"
          v-if="createList.length || faroviteList.length"
        >
          <playlistList
            v-if="createList.length"
            type="myCreate"
            :playlists="createList"
          ></playlistList>
          <playlistList
            v-if="faroviteList.length"
            type="myFavorite"
            :playlists="faroviteList"
          ></playlistList>
          <noData v-else></noData>
        </div>
      </section>
    </main>
  </div>
</template>
<style lang="scss" scoped>
@import '../../mainStyle.scss';
.account_view {
  position: relative;
  width: 100%;
  min-height: 92vh;
  height: 100%;
  background-color: rgb(255, 255, 255);
  main {
    position: relative;
    min-height: 92vh;
    height: 100%;
    display: flex;
    box-shadow: 0 0 3px 0 #4e53548d;

    section {
      position: relative;
      top: 10vh;
      height: 100%;
      min-height: 92vh;
      width: 100%;
      margin: 0 auto;

      .user_info_container {
        position: relative;
        display: grid;
        padding: 0 5vw 5vh;
        width: calc(100% - 10vw);
        margin: 0 auto;
        text-align: left;
        grid-template-columns: 11vw 1fr;
        grid-auto-rows: minmax(30px, auto);
        grid-column-gap: 60px;
        grid-row-gap: 20px;
        grid-template-areas:
          'avatar basic_info'
          'avatar follow_info'
          'avatar address_and_age';

        transition: all 0.5s;

        .user_avatar {
          grid-area: avatar;
          width: 100%;
          filter: drop-shadow(1px 1px 3px rgb(80, 80, 80));
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }

        .user_basic_info {
          grid-area: basic_info;
          display: flex;
          align-items: center;
          gap: 3%;
          .user_name {
            font-size: 1.7em;
            font-weight: 500;
          }

          .user_level {
            padding: 2px 5px;
            color: $titleTextColor;
            border-radius: 40%;
            border: 2px solid $titleTextColor;
          }

          .user_gender {
            width: 30px;
            height: 30px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;

            &.male {
              background-image: url('../../assets/icons/male.svg');
            }

            &.female {
              background-image: url('../../assets/icons/female.svg');
            }
          }
        }

        .follow_info {
          grid-area: follow_info;
          display: flex;

          .user_follows,
          .user_followeds {
            padding: 5px 40px 5px 0;
            display: flex;
            flex-direction: column;
            align-items: center;

            .follow_num {
              font-size: 1.7em;
            }
          }

          .user_follows {
          }
        }

        .user_address_and_age {
          grid-area: address_and_age;
          display: flex;
          flex-wrap: wrap;
          gap: 3%;

          .user_address {
          }

          .user_age {
          }
        }

        .user_create_days {
          grid-area: create_days;
        }

        .user_listened_songs {
          grid-area: listened_songs;
        }

        @media screen and (max-width: 1000px) {
          grid-template-columns: 20vw 1fr;
        }

        @media screen and (max-width: 650px) {
          grid-template-columns: 30vw 1fr;
          grid-column-gap: 30px;

          .user_basic_info {
            .user_name {
              font-size: 1.2em;
            }

            .user_level {
              padding: 1px 3px;
            }

            .user_gender {
              width: 25px;
              height: 25px;
            }
          }

          .follow_info {
            .user_follows,
            .user_followeds {
              padding: 5px 20px 5px 0;
              .follow_num {
                font-size: 1.2em;
              }
            }

            .user_follows {
            }
          }
        }
      }
    }
  }
}
</style>
<script setup lang="ts">
// TODO：后续把这个页面改成个人主页，accountHomeView内用vue router指向这一页，用userId作为参数传入
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  h,
  render,
  onBeforeMount,
  watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { get } from '../../axios/insatance';
import { differenceInYears, fromUnixTime } from 'date-fns';
import cascaderOptions, { DivisionUtil } from '@pansy/china-division';

import { useLoginStateStore } from '../../stores/loginState';
import { useuserPlaylistStore } from '../../stores/userPlaylist';

import playlistList from '../../components/article/playlistList/playlistList.vue';
import noData from '../../components/article/noData/noData.vue';

const loginState = useLoginStateStore();

const userPlaylistStore = useuserPlaylistStore();

const userName = ref('');
const userLevel = ref('');
const userFollows = ref('');
const userFolloweds = ref('');
const userProvince = ref('');
const userCity = ref('');
const userAge = ref('');
// const userCreateDays = ref('');
// const userListenedSongs = ref('');

const createList = ref<any[]>([]);
const faroviteList = ref<any[]>([]);

const divisionUtil = new DivisionUtil(cascaderOptions);

const getPlaylists = () => {
  createList.value = userPlaylistStore.getCreateList();
  faroviteList.value = userPlaylistStore.getLikeList();
};

const getInfo = (uid: string) => {
  get<any>(`/user/detail?uid=${uid}`)
    .then((response) => {
      console.log(response);
      $('#userAvatar').css(
        'background-image',
        `url(${response.profile.avatarUrl})`
      );
      userName.value = response.profile.nickname;
      userLevel.value = response.level;
      $('#userGender').removeClass('male');
      $('#userGender').removeClass('female');
      if (response.profile.gender == 1) {
        $('#userGender').addClass('male');
      } else if (response.profile.gender == 2) {
        $('#userGender').addClass('female');
      }
      userProvince.value = divisionUtil.getNameByCode(
        String(response.profile.province)
      );
      userCity.value = divisionUtil.getNameByCode(
        String(response.profile.city)
      );
      userAge.value = String(
        differenceInYears(
          new Date(),
          fromUnixTime(response.profile.birthday / 1000)
        )
      );
      userFollows.value = response.profile.follows;
      userFolloweds.value = response.profile.followeds;

      // userCreateDays.value = response.createDays;
      // userListenedSongs.value = response.listenSongs;
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

onMounted(() => {
  const uid = loginState.getProfile().userId;
  getInfo(uid);
  getPlaylists();
});

watch(
  () => loginState.profile,
  (newValue) => {
    getInfo(newValue);
    getPlaylists();
  }
);
</script>
