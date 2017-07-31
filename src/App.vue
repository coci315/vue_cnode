<template>
  <div id="app">
    <div class="layout">
      <div class="layout-menu" @click="showSetting">
        <Icon type="navicon-round"></Icon>
      </div>
      <div class="layout-nav">
        <Dropdown trigger="click" @on-click="changeNav">
          <a href="javascript:void(0)">
            {{navName}}
            <Icon type="arrow-down-b"></Icon>
          </a>
          <Dropdown-menu slot="list">
            <Dropdown-item :name="0">全部</Dropdown-item>
            <Dropdown-item :name="1">精华</Dropdown-item>
            <Dropdown-item :name="2">分享</Dropdown-item>
            <Dropdown-item :name="3">问答</Dropdown-item>
            <Dropdown-item :name="4">招聘</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </div>
    </div>
    <div class="setting-wrap">
      <div class="mask" v-show="settingShow" @click="hideSetting"></div>
      <transition name="slide">
        <div class="setting" v-show="settingShow">
          <div class="set-header">
            <div class="avatar-wrap" v-if="!isSignin">
              <div class="avatar" @click="toSignin">
                <img src="./assets/default_header.png" alt="头像">
                <p>点击头像登录</p>
              </div>
            </div>
            <div class="avatar-wrap" v-if="isSignin">
              <div class="avatar" @click="toUser">
                <img :src="avatarUrl" alt="头像">
                <p>{{loginname}}</p>
                <p class="score">积分:{{score}}</p>
              </div>
              <div class="signout-wrap">
                <p class="signout" @click="logout">注销</p>
              </div>
            </div>
          </div>
          <ul class="menus">
            <li class="menu" :class="{active: navName===item.text}" v-for="(item, index) in settings" @click="switchTab(index)">
              <div class="text-wrap">
                <Icon :type="item.icon"></Icon>
                <span>{{item.text}}</span>
              </div>
            </li>
            <li class="menu">
              <div class="text-wrap">
                <Icon type="ios-bell" />
                <span>消息</span>
              </div>
            </li>
            <li class="menu">
              <div class="text-wrap">
                <Icon type="android-settings" />
                <span>设置</span>
              </div>
            </li>
            <li class="menu">
              <div class="text-wrap">
                <Icon type="information-circled" />
                <span>关于</span>
              </div>
            </li>
          </ul>
        </div>
      </transition>
      <confirm ref="confirm" text="确定要注销吗？" confirmBtnText="注销" @confirm="signout"></confirm>
    </div>
    <!-- <keep-alive> -->
      <router-view @signin="showTip"></router-view>
    <!-- </keep-alive> -->
    <tip ref="tip"><p>登录成功</p></tip>
  </div>
</template>

<script>
import {bus} from './common/js/bus.js'
import router from './router'
import { mapGetters, mapActions } from 'vuex'
import tip from './base/tip/tip'
import confirm from './base/confirm/confirm'
import {getUserDetail} from './api/api'

const names = ['全部', '精华', '分享', '问答', '招聘']
const values = ['all', 'good', 'share', 'ask', 'job']
export default {
  name: 'app',
  components: {
    tip,
    confirm
  },
  data () {
    return {
      name: 0,
      settingShow: false,
      settings: [
        {
          icon: 'home',
          text: '全部',
          value: 'all'
        },
        {
          icon: 'coffee',
          text: '精华',
          value: 'good'
        },
        {
          icon: 'ios-people',
          text: '分享',
          value: 'share'
        },
        {
          icon: 'chatboxes',
          text: '问答',
          value: 'ask'
        },
        {
          icon: 'ios-briefcase',
          text: '招聘',
          value: 'job'
        }
      ]
    }
  },
  computed: {
    navName () {
      return names[this.name]
    },
    navValue () {
      return values[this.name]
    },
    ...mapGetters([
      'isSignin',
      'loginname',
      'avatarUrl',
      'id',
      'score',
      'accesstoken'
    ])
  },
  created () {
    const vm = this
    bus.$on('routeTabChange', function (tab) {
      vm.name = values.indexOf(tab)
    })
    if (this.loginname) {
      getUserDetail(this.loginname).then(res => {
        this.saveTheScore(res.data.score)
      })
    }
  },
  methods: {
    changeNav (name) {
      this.name = name
      bus.$emit('changeNav', this.navName, this.navValue)
    },
    logout () {
      this.$refs.confirm.show()
    },
    showTip () {
      this.$refs.tip.show()
    },
    showSetting () {
      this.settingShow = true
    },
    hideSetting () {
      this.settingShow = false
    },
    switchTab (index) {
      this.settingShow = false
      router.push('/topics/' + this.settings[index].value)
    },
    toSignin () {
      this.$router.push('/signin')
      this.settingShow = false
    },
    toUser () {
      this.$router.push('/user/' + this.loginname)
      this.settingShow = false
    },
    ...mapActions([
      'signout',
      'saveTheScore'
    ])
  }
}
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 48px;
  background-color: #444;
}

.layout-menu {
  flex: 0 1 60px;
  height: 48px;
  line-height: 48px;
  padding-left: 30px;
  font-size: 20px;
  color: #f9f9f9;
}

.layout-nav {
  margin-left: -60px;
  flex: 1 1 275px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 14px;
  a,
  a:hover,
  a:active,
  a:visited {
    color: #f9f9f9;
  }
}

.setting-wrap {
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, .4);
  }
  .setting {
    position: fixed;
    z-index: 101;
    top: 0;
    width: 80%;
    height: 100%;
    background-color: #fff;
    .set-header {
      position: relative;
      height: 30%;
      background: url(./assets/header_bg.jpg) no-repeat 0 0/100% 100%;
    }
    .avatar-wrap {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 98px;
      padding-left: 15%;
      padding-right: 15%;
      transform: translateY(-50%);
    }
    .avatar {
      float: left;
      height: 100%;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      p {
        margin-top: 2px;
        font-size: 14px;
        font-weight: bold;
        color: #f1f1f1;
        &.score {
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
    .signout-wrap {
      float: right;
      height: 100%;
      .signout {
        margin-top: 60px;
        padding: 10px 0 10px 10px;
        font-size: 12px;
        font-weight: normal;
        color: #f1f1f1;
      }
    }
    .menus {
      margin-top: 20px;
      height: 60%;
      .menu {
        display: table;
        width: 100%;
        height: 12.5%;
        &.active {
          background-color: #eee;
          .text-wrap {
            color: #80bd01;
          }
        }
        &:nth-child(5) {
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding-bottom: 10px;
        }
      }
      .text-wrap {
        display: table-cell;
        vertical-align: middle;
        padding-left: 15%;
        font-size: 14px;
        span {
          margin-left: 30px;
        }
      }
    }
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: all .4s;
  }
  .slide-enter,
  .slide-leave-active {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
