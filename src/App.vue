<template>
  <div id="app">
    <div class="layout">
      <div class="layout-menu">
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
    <router-view></router-view>
  </div>
</template>

<script>
import {bus} from './common/js/bus.js'
const names = ['全部', '精华', '分享', '问答', '招聘']
const values = ['all', 'good', 'share', 'ask', 'job']
export default {
  name: 'app',
  data () {
    return {
      name: 0
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
</style>
