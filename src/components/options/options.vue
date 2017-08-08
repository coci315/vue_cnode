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
    <div class="option" @click="setTopicTail">
      <div class="content" :class="{disabled: !isTopicTailOn}">
        <div class="text">
          <p class="text_main">设置小尾巴</p>
        </div>
      </div>
    </div>
  </div>
  <transition name="slideup">
    <div class="topic-tail" v-if="showTopicTail">
      <div class="header">
        <div class="close" @click.stop="closeTopicTail">
          <Icon type="android-close"></Icon>
        </div>
        <div class="header_title">
          <h2>设置小尾巴</h2>
        </div>
        <div class="default-tail" @click.stop="setDefaultTail">
          <p>默认尾巴</p>
        </div>
      </div>
      <div class="main">
        <div class="set-topic-tail">
          <textarea v-model="topicTailValue" @input="changeTopicTail" ref="textarea"></textarea>
        </div>
      </div>
    </div>
  </transition>
</div>
</transition>
</template>

<script>
import mySwitch from '../../base/switch/switch'
import { mapGetters, mapActions } from 'vuex'
const DEFAULTTAIL = '来自vue-cnode'
export default {
  components: {
    mySwitch
  },
  data () {
    return {
      showTopicTail: false,
      topicTailValue: ''
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'isSaveDraft',
      'isTopicTailOn',
      'topicTail'
    ])
  },
  created () {
    this.topicTailValue = this.topicTail
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
    changeTopicTail () {
      this.saveTheTopicTail(this.topicTailValue)
    },
    closeTopicTail () {
      this.showTopicTail = false
    },
    setTopicTail () {
      if (this.isTopicTailOn) {
        this.showTopicTail = true
        this.$nextTick(() => {
          this.$refs.textarea.focus()
        })
      }
    },
    setDefaultTail () {
      this.topicTailValue = DEFAULTTAIL
      this.changeTopicTail()
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

.options,
.topic-tail {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f1f1;
}
.topic-tail {
  z-index: 100;
  .header {
    .header_title {
      margin-left: 0;
    }
  }
}
.header {
  display: flex;
  height: 48px;
  background-color: #444;
  .back,
  .close,
  .default-tail{
    flex: 0 1 60px;
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
    font-size: 20px;
    color: #f9f9f9;
  }
  .default-tail {
    font-size: 12px;
    line-height: 1;
    padding-top: 24px;
    padding-left: 0;
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
.main {
  .set-topic-tail {
    width: 100%;
    height: 100%;
    padding: 12px 16px;
    textarea {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background-color: inherit;
      font-size: 14px;
      color: #333;
      resize: none;
      caret-color: #80bd01;
    }
  }
}
</style>
