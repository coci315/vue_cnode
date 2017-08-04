<template>
<transition name="move">
  <div class="content">
    <scroll class="content_wrap" 
            :data="topics"
            :pullup="true"
            @scrollToEnd="loadMore"
            :listenScroll="true"
            :probeType="3"
            @scroll="scroll"
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
      scrollY: 0
    }
  },
  computed: {
    ...mapGetters([
      'isSignin'
    ])
  },
  watch: {
    '$route' (val, oldVal) {
      console.log(val)
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
      this.spinShow = true
      // const response = await this.$http.get(baseUrl, {
      //   params: {
      //     tab: this.curTab,
      //     limit: this.limit,
      //     page: this.page
      //   }
      // }).catch(err => console.log(err))
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
      // const response = await this.$http.get(baseUrl, {
      //   params: {
      //     tab: this.curTab,
      //     limit: this.limit,
      //     page: this.page
      //   }
      // }).catch(err => console.log(err))
      getTopics(this.curTab, this.limit, this.page).then(res => {
        this.topics = res.data
        this.page++
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
    scroll (pos, maxScrollY) {
      if (pos.y > 0) return
      if (pos.y < maxScrollY) return
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
