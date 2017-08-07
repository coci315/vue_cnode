<template>
<transition name="slideup">
<div class="options">
  <div class="header">
    <div class="back" @click.stop="back">
      <Icon type="ios-arrow-back"></Icon>
    </div>
    <div class="header_title">
      <h2>设置</h2>
    </div>
  </div>
  <div class="main">
    <div class="option">
      <p class="title">主题</p>
      <div class="content">
        <div class="text">
          <p class="text_main">夜间模式</p>
        </div>
        <div class="switch"><my-switch :value="theme==='dark'" @change="changeTheme"></my-switch></div>
      </div>
    </div>
    <div class="option">
      <p class="title">话题</p>
      <div class="content">
        <div class="text">
          <p class="text_main">保存草稿</p>
          <p class="text_desc">没有发布的话题内容会被保存</p>
        </div>
        <div class="switch"><my-switch :value="isSaveDraft" @change="changeDraftSetting"></my-switch></div>
      </div>
    </div>
    <div class="option">
      <div class="content">
        <div class="text">
          <p class="text_main">话题小尾巴</p>
          <p class="text_desc">开启后可以自定义</p>
        </div>
        <div class="switch"><my-switch :value="isTopicTailOn" @change="changeTopicTailSetting"></my-switch></div>
      </div>
    </div>
    <div class="option">
      <div class="content" :class="{disabled: !isTopicTailOn}">
        <div class="text">
          <p class="text_main">设置小尾巴</p>
        </div>
      </div>
    </div>
  </div>
</div>
</transition>
</template>

<script>
import mySwitch from '../../base/switch/switch'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    mySwitch
  },
  computed: {
    ...mapGetters([
      'theme',
      'isSaveDraft',
      'isTopicTailOn',
      'topicTail'
    ])
  },
  methods: {
    back () {
      this.$router.back()
    },
    changeTheme (on) {
      if (on) {
        this.saveTheTheme('dark')
      } else {
        this.saveTheTheme('white')
      }
    },
    changeDraftSetting (on) {
      this.saveTheDraftSetting(on)
    },
    changeTopicTailSetting (on) {
      this.saveTheTopicTailSetting(on)
    },
    ...mapActions([
      'saveTheTheme',
      'saveTheDraftSetting',
      'saveTheTopicTailSetting',
      'saveTheTopicTail'
    ])
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.slideup-enter-active,
.slideup-leave-active {
  transition: all .4s;
}
.slideup-enter,
.slideup-leave-active {
  transform: translate3d(0, 100%, 0);
}

.options {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f1f1;
}
.header {
  display: flex;
  height: 48px;
  background-color: #444;
  .back{
    flex: 0 1 60px;
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
    font-size: 20px;
    color: #f9f9f9;
  }
  .header_title {
    flex: 1 1 275px;
    margin-left: -60px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    h2 {
      font-size: 16px;
      color: #f9f9f9;
    }
  }
}
.main {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
  .option {
    padding: 12px 16px;
    margin-bottom: 10px;
    font-size: 12px;
    background-color: #f9f9f9;
    .title {
      margin-bottom: 20px;
      color: #80bd01;
    }
    .content {
      position: relative;
      .text {
        .text_main {
          font-size: 13px;
          font-weight: bold;
          color: #333;
        }
        .text_desc {
          margin-top: 6px;
          font-size: 12px;
          color: #666;
        }
      }
      .switch {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &.disabled {
        .text {
          .text_main {
            color: #aaa;
          }
        }
      }
    }
  }
}
</style>
