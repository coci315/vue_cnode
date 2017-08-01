<template>
<transition name="slideup">
  <div class="create-topic" @click="hideMenu">
    <div class="header">
      <div class="back" @click.stop="back">
        <Icon type="ios-arrow-back"></Icon>
      </div>
      <div class="header_title">
        <h2>发布话题</h2>
      </div>
      <div class="send" @click.stop="send">
        <Icon type="android-send"></Icon>
      </div>
    </div>
    <div class="topic_tab">
      <span class="label">发布到分类：</span>
      <span class="tab" @click.stop="showMenu">
        <span>{{tabs[tab]}}</span>
        <Icon type="arrow-down-b"></Icon>
        <transition name="fade">
          <ul v-show="isShowMenu">
            <li v-for="(option, index) in options" @click="select(index)">{{option.text}}</li>
          </ul>
        </transition>
      </span>
    </div>
    <editor></editor>
  </div>
</transition>
</template>

<script>
import editor from '../../base/editor/editor'
export default {
  components: {
    editor
  },
  data () {
    return {
      title: '',
      tab: 'share',
      content: '',
      tabs: {
        share: '分享',
        ask: '问答',
        job: '招聘',
        dev: '客户端测试'
      },
      isShowMenu: false,
      options: [
        {value: 'share', text: '分享'},
        {value: 'ask', text: '问答'},
        {value: 'job', text: '招聘'},
        {value: 'dev', text: '客户端测试'}
      ]
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    showMenu () {
      this.isShowMenu = !this.isShowMenu
    },
    hideMenu () {
      this.isShowMenu = false
    },
    select (index) {
      this.tab = this.options[index].value
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.slideup-enter-active,
.slideup-leave-active {
  transition: all .4s;
}
.slideup-enter,
.slideup-leave-active {
  transform: translate3d(0, 100%, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all .15s;
  transform-origin: top center;
}
.fade-enter,
.fade-leave-active {
  transform: scale(.9);
}
.create-topic {
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
  .back,
  .send {
    flex: 0 1 60px;
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
    font-size: 20px;
    color: #f9f9f9;
  }
  .send {
    padding-left: 20px;
  }
  .header_title {
    flex: 1 1 275px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    h2 {
      font-size: 18px;
      color: #f9f9f9;
      font-weight: normal;
    }
  }
}
.topic_tab {
  padding: 16px 12px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  &>span {
    display: inline-block;
  }
  .label {
    width: 30%;
    font-size: 12px;
    color: #80bd01;
  }
  .tab {
    position: relative;
    width: 65%;
    font-size: 13px;
    color: #666;
    span {
      display: inline-block;
      width: 90%;
    }
    ul {
      position: absolute;
      z-index: 10000;
      left: -10px;
      top: -16px;
      width: 95%;
      padding: 6px 10px;
      background-color: #f4f4f4;
      li {
        margin: 10px 0;
        font-size: 13px;
      }
    }
  }
}
</style>
