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
            <div class="avatar-wrap">
              <div class="avatar">
                <img src="./assets/default_header.png" alt="头像">
                <p>点击头像登录</p>
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
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {bus} from './common/js/bus.js'
import router from './router'

const names = ['全部', '精华', '分享', '问答', '招聘']
const values = ['all', 'good', 'share', 'ask', 'job']
export default {
  name: 'app',
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
    }
  },
  created () {
    const vm = this
    bus.$on('routeTabChange', function (tab) {
      vm.name = values.indexOf(tab)
    })
  },
  methods: {
    changeNav (name) {
      this.name = name
      bus.$emit('changeNav', this.navName, this.navValue)
    },
    showSetting () {
      this.settingShow = true
    },
    hideSetting () {
      this.settingShow = false
    },
    switchTab (index) {
      this.settingShow = false
      router.push(this.settings[index].value)
    }
  }
}
</script>

<style lang="scss">
.layout {
  position: fixed;
  z-index: 10;
  display: flex;
  left: 0;
  top: 0;
  right: 0;
  height: 60px;
  background-color: #444;
}

.layout-menu {
  flex: 0 1 60px;
  height: 60px;
  line-height: 60px;
  padding-left: 30px;
  font-size: 20px;
  color: #f9f9f9;
}

.layout-nav {
  margin-left: -60px;
  flex: 1 1 275px;
  height: 60px;
  line-height: 60px;
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
      height: 30%;
      background: url(./assets/header_bg.jpg) no-repeat 0 0/100% 100%;
    }
    .avatar-wrap {
      float: left;
      width: 50%;
      text-align: center;
    }
    .avatar {
      padding-top: 30%;
      padding-left: 30%;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      p {
        margin-top: 2px;
        font-size: 12px;
        font-weight: bold;
        color: #eee;
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
