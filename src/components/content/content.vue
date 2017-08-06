<template>
<transition name="move">
  <div class="content">
    <div class="refresh" v-show="isShowRefresh" ref="refresh">
      <p v-show="isShowText">
        <span class="arrow"><Icon :class="{rotate:isRotate}" type="android-arrow-down"></Icon></span>
        {{refreshText}}
      </p>
    </div>
    <div class="loading-wrap" v-show="refreshing">
      <loading></loading>
    </div>
    <scroll class="content_wrap" 
            :data="topics"
            :pullup="true"
            @scrollToEnd="loadMore"
            :listenScroll="true"
            :probeType="3"
            @scroll="scroll"
            :pulldown="true"
            @pulldown="refreshData"
            ref="contentWrap"
    >
      <div>
        <ul>
          <li v-for="(topic,index) in topics" class="topic">
            <a :href="'/topic/' + topic.id">
            <div class="title">
              <span class="put_top" v-if="topic.top">置顶</span>
              <span class="put_good" v-else-if="topic.good">精华</span>
              <span class="topiclist_tab" v-else>{{tabs[topic.tab]}}</span>
              <h2>
                <a :href="'/topic/' + topic.id">{{topic.title}}</a>
              </h2>
            </div>
            <div class="create clearfix">
              <div class="author">
                <a class="avatar" :href="'/user/' + topic.author.loginname">
                  <img :src="topic.author.avatar_url" :alt="topic.author.loginname">
                </a>
                <div class="name">
                  <p class="author_name">{{topic.author.loginname}}</p>
                  <p class="create_time">发表于：{{topic.create_at | formatDate}}</p>
                </div>
              </div>
              <div class="info">
                <p class="count">
                  <span class="reply_count">{{topic.reply_count}}</span> /
                  <span class="visit_count">{{topic.visit_count}}</span>
                </p>
                <p class="last_reply_time">{{topic.last_reply_at | fromNow}}</p>
              </div>
            </div>
            </a>
          </li>
        </ul>
        <div class="loadMore" v-show="topics.length > 0">
          <p v-show="!loadMoreShow">没有更多了</p>
          <p v-show="!spinShow && loadMoreShow" @click="loadMore">加载更多</p>
          <loading v-show="spinShow"></loading>
        </div>
      </div>
      <div class="loading-container" v-show="!topics.length">
        <loading :showTitle="true"></loading>
      </div>
    </scroll>
    <div class="edit-btn-wrap" ref="editBtnWrap" @click.stop="toCreateTopic">
      <Icon type="edit" />
    </div>
    <router-view></router-view>
    <confirm ref="confirm" text="该操作需要登录帐户。是否现在登录？" confirmBtnText="登录" @confirm="toSignin"></confirm>
  </div>
</transition>
</template>

<script>
import router from '../../router'
import {bus} from '../../common/js/bus.js'
import scroll from '../../base/scroll/scroll'
import loading from '../../base/loading/loading'
import confirm from '../../base/confirm/confirm'
import {getTopics} from '../../api/api'
import { mapGetters } from 'vuex'
const titleTexts = {
  all: 'CNode: Node.js专业社区',
  good: 'CNode: Node.js专业社区',
  share: '分享板块 - CNode技术社区',
  ask: '问答板块 - CNode技术社区',
  job: '招聘板块 - CNode技术社区'
}
export default {
  name: 'content',
  components: {
    scroll,
    loading,
    confirm
  },
  data () {
    return {
      spinShow: false,
      loadMoreShow: true,
      topics: [],
      tabs: {
        share: '分享',
        ask: '问答',
        job: '招聘',
        dev: '客户端测试'
      },
      page: 1,
      limit: 20,
      curTab: 'all',
      scrollY: 0,
      isShowRefresh: false,
      refreshing: false,
      isShowText: true,
      refreshText: '下拉刷新',
      isRotate: false
    }
  },
  computed: {
    ...mapGetters([
      'isSignin'
    ])
  },
  watch: {
    '$route' (val, oldVal) {
      this.page = 1
      const tab = val.params.tab
      document.title = titleTexts[tab]
      this.curTab = tab
      this.loadContent()
      bus.$emit('routeTabChange', tab)
    },
    scrollY (newVal, oldVal) {
      if (newVal > 0) return
      if (newVal < oldVal) {
        this.$refs.editBtnWrap.style.bottom = '-90px'
      } else if (newVal > oldVal) {
        this.$refs.editBtnWrap.style.bottom = '20px'
      }
    }
  },
  created () {
    // this.$http.interceptors.request.use((config) => {
    //   this.spinShow = true
    //   return config
    // }, function (error) {
    //   return Promise.reject(error)
    // })
    // const vm = this
    bus.$on('changeNav', function (name, value) {
      // vm.page = 1
      // vm.curTab = value
      // vm.loadContent()
      router.push(value)
    })
    const tab = this.$route.params.tab
    this.curTab = tab
    document.title = titleTexts[tab] || 'CNode: Node.js专业社区'
    bus.$emit('routeTabChange', tab)
    this.loadContent()
  },
  methods: {
    loadMore () {
      if (!this.loadMoreShow) return
      this.page++
      this.spinShow = true
      getTopics(this.curTab, this.limit, this.page).then(res => {
        const data = res.data
        this.topics = this.topics.concat(data)
        this.page++
        this.spinShow = false
        if (data.length < this.limit) {
          this.loadMoreShow = false
        }
      })
    },
    loadContent () {
      this.loadMoreShow = true
      getTopics(this.curTab, this.limit, this.page).then(res => {
        this.topics = res.data
      })
    },
    toCreateTopic () {
      if (!this.isSignin) {
        this.$refs.confirm.show()
      } else {
        this.$router.push('/topic/create')
      }
    },
    toSignin () {
      this.$router.push('/signin')
    },
    refreshData () {
      this.$refs.contentWrap.$el.style.marginTop = '20px'
      this.isShowRefresh = false
      this.isShowText = false
      this.refreshing = true
      this.page = 1
      this.loadMoreShow = true
      getTopics(this.curTab, this.limit, this.page).then(res => {
        this.topics = res.data
        this.refreshing = false
        this.$refs.contentWrap.$el.style.marginTop = '0'
      })
    },
    scroll (pos, maxScrollY) {
      if (pos.y > 0) {
        if (pos.y > 10) {
          this.isShowRefresh = true
          this.$refs.contentWrap.$el.style.marginTop = '30px'
        }
        if (pos.y > 50) {
          this.refreshText = '释放更新'
          this.isRotate = true
        } else {
          this.refreshText = '下拉刷新'
          this.isRotate = false
        }
        return
      }
      if (pos.y < maxScrollY) return
      if (pos.y === 0) {
        this.isShowRefresh = false
        this.isShowText = true
        if (!this.refreshing) {
          this.$refs.contentWrap.$el.style.marginTop = '0'
        }
      }
      this.scrollY = pos.y
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
html,
body {
  width: 100%;
}
.refresh,
.loading-wrap {
  position: fixed;
  z-index: 20;
  left: 0;
  right: 0;
  top: 48px;
  height: 30px;
  line-height: 30px;
  padding-top: 10px;
  background-color: rgba(0,0,0,0);
  font-size: 14px;
  color: #333;
  font-weight: bold;
  text-align: center;
}
.refresh {
  .arrow i{
    transition: all .2s;
    &.rotate {
      transform: rotate(-180deg);
    }
  }
}
.content {
  position: fixed;
  z-index: 10;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
  .content_wrap {
    height: 100%;
    overflow: hidden;
    transition: all .4s;
  }
  a,
  a:hover,
  a:active,
  {
    color: #333;
  }
  a:visited {
    color: #888
  }
}

.topic {
  padding: 10px 15px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #ccc;
}

.title {
  font-size: 0;
  &>* {
    display: inline-block;
    vertical-align: top;
  }
  .put_top,
  .put_good,
  .topiclist_tab {
    padding: 2px 4px;
    font-size: 12px;
    color: #fff;
    border-radius: 3px;
    background-color: #80bd01;
  }
  .topiclist_tab {
    color: #999;
    background-color: #e5e5e5;
  }
  h2 {
    margin-left: 6px;
    width: 85%;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.create {
  margin-top: 6px;
  font-size: 12px;
  color: #666;
  .author {
    float: left;
    .avatar,
    .name {
      float: left;
    }
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      img {
        max-width: 100%;
        border-radius: 50%;
      }
    }
    .name {
      margin-left: 4px;
    }
  }
  .info {
    float: right;
    text-align: right;
    .reply_count {
      color: #80bd01;
    }
  }
}

.loadMore {
  position: relative;
  height: 40px;
  text-align: center;
  padding-top: 8px;
  p {
    height: 24px;
    line-height: 24px;
  }
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.move-enter-active,
.move-leave-active {
  transition: all .4s;
}
.move-enter,
.move-leave-active {
  transform: translate3d(100%, 0, 0);
}

.edit-btn-wrap {
  position: fixed;
  z-index: 50;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #80bd01;
  border-radius: 50%;
  box-shadow: 0 0 5px 0 #666;
  text-align: center;
  line-height: 50px;
  font-size: 24px;
  color: #f1f1f1;
  transition: all .4s;
}
</style>
