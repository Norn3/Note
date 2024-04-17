<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div id="commentList" class="comment_list">
    <div id="sendComment" class="send_comment">
      <el-form
        ref="commentFormRef"
        :model="inputComment"
        :rules="rules"
        label-position="left"
        label-width="auto"
        size="large"
        class="comment_form"
      >
        <el-form-item prop="text">
          <el-input
            v-model="inputComment.text"
            class="input_comment"
            :rows="5"
            type="textarea"
            placeholder="在此处输入您要发表的评论"
          />
        </el-form-item>
        <el-form-item class="buttons">
          <el-button
            class="submit_comment"
            @click="submitComment(commentFormRef)"
            >评论</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <ul id="comments" class="comments">
      <li
        :id="'commentItem' + index"
        class="comment_item"
        v-for="(item, index) in commentList"
        :key="index"
        @mouseover="toggleDeleteIcon('add', index, item.canBeDelete)"
        @mouseleave="toggleDeleteIcon('remove', index, item.canBeDelete)"
      >
        <div id="userAvatar" class="user_avatar">
          <img :src="item.userAvatar" alt="头像" />
        </div>
        <div id="commnetContent" class="comment_content">
          <div id="userComment" class="user_comment">
            <span id="userName" class="user_name">{{
              item.userName + '：'
            }}</span>
            <span id="commentText" class="comment_tet">{{ item.content }}</span>
          </div>
          <div id="beRepliedComment" class="be_replied" v-if="item.beReplied">
            <span id="userName" class="user_name">{{
              item.beReplied.userName + '：'
            }}</span>
            <span id="commentText" class="comment_tet">{{
              item.beReplied.content
            }}</span>
          </div>
        </div>

        <div id="footer" class="footer">
          <span id="commentTime" class="comment_time">{{ item.time }}</span>
          <div id="features" class="features">
            <div
              id="deleteComment"
              class="delete_commment"
              @click="deleteComment(index, item.commentId)"
            >
              删除
            </div>
            <div
              id="likeComment"
              class="like_comment"
              @click="likeComment(index, item.commentId)"
            >
              点赞 {{ item.likedCount }}
            </div>
            <div
              id="replyComment"
              class="reply_comment"
              @click="toggleReplyForm(index)"
            >
              回复
            </div>
          </div>
        </div>
        <el-form
          ref="replyCommentFormRef"
          :model="replyComment"
          :rules="rules"
          label-position="left"
          label-width="auto"
          size="large"
          id="replyCommentForm"
          class="reply_comment_form"
        >
          <el-form-item prop="text">
            <el-input
              v-model="replyComment.text"
              class="input_comment"
              :rows="5"
              type="textarea"
              placeholder="在此处输入您要回复的内容"
            />
          </el-form-item>
          <el-form-item class="buttons">
            <el-button
              class="submit_comment"
              @click="submitComment(replyCommentFormRef, index, item.commentId)"
              >回复</el-button
            >
          </el-form-item>
        </el-form>
      </li>
    </ul>
    <loading-state :loading="already_getting"></loading-state>
    <el-backtop :right="60" :bottom="60" />
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $, { event } from 'jquery';
import {
  onMounted,
  nextTick,
  ref,
  render,
  h,
  watch,
  computed,
  reactive,
} from 'vue';
import router from '../../../router/index';
import { get } from '../../../axios/insatance';
import { format, isThisYear } from 'date-fns';

import './commentList.scss';
import loadingState from '../loadingState/loadingState.vue';
import { useuserPlaylistStore } from '../../../stores/userPlaylist';
import { useLoginStateStore } from '../../../stores/loginState';
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps({
  type: {
    type: String,
    default: 'playlist',
  },
  target_id: String,
});

const userPlaylistStore = useuserPlaylistStore();
const loginStore = useLoginStateStore();

let current_comment_id = 0;
let current_comment_before = '';
const limit = 50;
let gotAllComment = ref(false);
const already_getting = ref(false);

interface comment {
  commentId: number;
  userId: string;
  userAvatar: string;
  userName: string;
  content: string;
  time: string;
  likedCount: number;
  beReplied?: { userName: string; content: string };
  canBeDelete: boolean;
}

const commentList = ref<comment[]>([]);

const commentFormRef = ref<FormInstance>();
const replyCommentFormRef = ref<FormInstance>();

let typeNum = computed(() => {
  let num;
  switch (props.type) {
    case 'song':
      num = 0;
      break;
    case 'playlist':
      num = 2;
      break;
    case 'album':
      num = 3;
      break;
    default:
      break;
  }
  return num;
});

// 根据资源类型， 决定获取数据的地址
const address = (
  type: string,
  target_id: string,
  limit: number,
  offset: number
): string => {
  let addr = '';
  switch (type) {
    case 'playlist':
      addr = '/comment/playlist';
      break;
    case 'song':
      addr = '/comment/music';
      break;
    case 'album':
      addr = '/comment/album';
      break;
  }
  addr += `?id=${target_id}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`;
  if (offset > 5000) addr += `&before=${current_comment_before}`;
  return addr;
};

const firstGetComment = async () => {
  commentList.value = [];
  current_comment_id = 0;
  already_getting.value = true;
  await getComments('batch');
  already_getting.value = false;
};

// 获取歌单中的歌曲
const getComments = async (type: string) => {
  if (type == 'single') {
    const response = await get<any>(
      `${address(props.type, props.target_id as string, 1, 0)}`
    );
    const item = response.comments[0];
    let comment: comment = {
      commentId: item.commentId,
      userId: item.user.userId,
      userAvatar: item.user.avatarUrl,
      userName: item.user.nickname,
      content: item.content,
      time: isThisYear(item.time)
        ? format(new Date(item.time), 'MM月dd日')
        : format(new Date(item.time), 'yyyy年MM月dd日'),
      likedCount: item.likedCount,
      beReplied:
        item.beReplied.length == 0
          ? undefined
          : {
              userName: item.beReplied[0].user.nickname,
              content: item.beReplied[0].content,
            },
      canBeDelete:
        item.user.userId == loginStore.getProfile().userId ? true : false,
    };
    current_comment_id++;
    commentList.value.unshift(comment);
  } else if (type == 'batch') {
    await get<any>(
      `${address(
        props.type,
        props.target_id as string,
        limit,
        current_comment_id
      )}`
    )
      .then((response) => {
        console.log(response);

        const comments = response.comments;
        if (comments.length < limit) gotAllComment.value = true;
        comments.forEach((item: any) => {
          let comment: comment = {
            commentId: item.commentId,
            userId: item.user.userId,
            userAvatar: item.user.avatarUrl,
            userName: item.user.nickname,
            content: item.content,
            time: isThisYear(item.time)
              ? format(new Date(item.time), 'MM月dd日')
              : format(new Date(item.time), 'yyyy年MM月dd日'),
            likedCount: item.likedCount,
            beReplied:
              item.beReplied.length == 0
                ? undefined
                : {
                    userName: item.beReplied[0].user.nickname,
                    content: item.beReplied[0].content,
                  },
            canBeDelete:
              item.user.userId == loginStore.getProfile().userId ? true : false,
          };
          current_comment_id++;
          if (current_comment_id > 5000) {
            current_comment_before = item.time;
          }
          commentList.value.push(comment);
        });
        return;
      })
      .catch((error) => {
        // 处理请求错误
        console.log('请求失败');
        console.log(error);
      });
  }
};

const toggleReplyForm = (index: number) => {
  const $item = $('#commentItem' + index).find('#replyCommentForm');
  $('.reply_comment_form').removeClass('show_reply');
  $item.addClass('show_reply');
};

const toggleDeleteIcon = (
  action: string,
  index: number,
  canBeDelete: boolean
) => {
  if (!canBeDelete) return;
  const $item = $('#commentItem' + index).find('#deleteComment');
  if (action == 'add') {
    $item.addClass('hovering');
  } else if (action == 'remove') {
    $item.removeClass('hovering');
  }
};

const validateText = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('评论内容不可为空！'));
  } else {
    callback();
  }
};
const inputComment = reactive({
  text: '',
});

const replyComment = reactive({
  text: '',
});

const rules = reactive<
  FormRules<typeof inputComment> | FormRules<typeof replyComment>
>({
  text: [{ validator: validateText, trigger: 'blur' }],
});

const submitComment = (
  formInstance: FormInstance | undefined,
  index?: number,
  commnetId?: number
) => {
  if (!loginStore.getLoginState()) {
    loginStore.showLoginEntry();
    return;
  }
  if (!formInstance) return;
  if (commnetId) {
    let formArray: FormInstance[] = Object.values(formInstance);
    formInstance = formArray[index as number];
  }
  formInstance.validate(async (valid) => {
    if (!valid) {
      return;
    } else {
      let response;
      if (commnetId) {
        response = await get<any>(
          `/comment?t=2&type=${typeNum.value}&id=${props.target_id}&content=${replyComment.text}&commentId=${commnetId}`
        );
        if (response.code == 200) {
          replyComment.text = '';
          $('.reply_comment_form').removeClass('show_reply');
          getComments('single');
        }
      } else {
        response = await get<any>(
          `/comment?t=1&type=${typeNum.value}&id=${props.target_id}&content=${inputComment.text}`
        );
        if (response.code == 200) {
          inputComment.text = '';
          getComments('single');
        }
      }
      return;
    }
  });
};

const deleteComment = async (index: number, commentId: number) => {
  const response = await get<any>(
    `/comment?t=0&type=${typeNum.value}&id=${props.target_id}&commentId=${commentId}`
  );
  if (response.code == 200) {
    commentList.value.splice(index, 1);
  }
};

const likeComment = async (index: number, commentId: number) => {
  if (!loginStore.getLoginState()) {
    loginStore.showLoginEntry();
    return;
  }
  const $item = $('#commentItem' + index).find('#likeComment');
  // 由于等待接口返回再改变样式太慢，所以选择先改变样式，再由请求返回来判断是否需要撤回样式
  if ($item.hasClass('clicked')) {
    $item.removeClass('clicked');
    commentList.value[index].likedCount--;
    const response = await get<any>(
      `/comment/like?id=${props.target_id}&cid=${commentId}&type=${typeNum.value}&t=0`
    );
    if (response.code != 200) {
      $item.addClass('clicked');
      commentList.value[index].likedCount++;
    }
  } else {
    $item.addClass('clicked');
    commentList.value[index].likedCount++;
    const response = await get<any>(
      `/comment/like?id=${props.target_id}&cid=${commentId}&type=${typeNum.value}&t=1`
    );
    if (response.code != 200) {
      $item.removeClass('clicked');
      commentList.value[index].likedCount--;
    }
  }
};

// type ThrottledFunction = (...args: any[]) => void;
// 节流方法, 防止达到可以请求数据的位置（already_getting == true）之前，onBottom被频繁调用，频繁获取高度数据
const throttle = (func: () => void, delay: number) => {
  let timer: any = null;
  return (...args: any) => {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this);
        timer = null;
      }, delay);
    }
  };
};
// 触底相应函数
const isReachBottom = (): boolean => {
  // 获取可视高度（不包含滚动条宽度）
  let clientHeight = $(window).height();
  // 获取滚动高度
  let scrollTop = $(window).scrollTop();
  // 滚动条高度
  let scrollHeight = $(document).height();

  // 当窗口还差100px就到达页面底部时（因为有小数，所以触底时clientHeight + scrollTop = scrollHeight - 1）
  if (
    clientHeight &&
    scrollTop &&
    scrollHeight &&
    clientHeight + scrollTop >= scrollHeight - 501
  )
    return true;
  else return false;
};
// 判断是否不是正处于获取中的状态，并且已滚动到判定线以下
const onScroll = async () => {
  if (!already_getting.value) {
    if (isReachBottom()) {
      already_getting.value = true;
      // 再请求下一批歌曲
      await getComments('batch');
      already_getting.value = false;
    }
  }
};

// 用变量储存throttle返回的函数，确保绑定和移除监听的对象是同一个
const throttleReturn = throttle(onScroll, 500);

onMounted(() => {
  firstGetComment();
  window.addEventListener('scroll', throttleReturn);
});

// 当已获取所有的歌曲，移除监听，不再滚动加载更多
watch(
  () => gotAllComment.value,
  () => {
    if (gotAllComment.value) {
      window.removeEventListener('scroll', throttleReturn);
    }
  }
);

// TODO：有时会出现滚动结束但监听器不移除的情况，需要检查

// 当页面的路由或用户创建的歌单改变，马上重新获取信息
watch(
  [() => props.target_id, () => userPlaylistStore.createList],
  (newValue) => {
    // 保证页面内只有一个监听器

    window.removeEventListener('scroll', throttleReturn);
    window.addEventListener('scroll', throttleReturn);
    gotAllComment.value = false;
    firstGetComment();
  }
);
</script>
