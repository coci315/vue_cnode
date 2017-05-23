<template>
  <div class="content">
  
    <ul>
      <li v-for="(topic,index) in topics" class="topic">
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
      </li>
    </ul>
    <div class="loadMore">
      <p v-if="!loadMoreShow">没有更多了</p>
      <p v-if="!spinShow && loadMoreShow" @click="loadMore">加载更多</p>
      <Spin fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>

<script>
import router from '../../router'
import {bus} from '../../common/js/bus.js'
const baseUrl = 'https://cnodejs.org/api/v1/topics'
const titleTexts = {
  all: 'CNode: Node.js专业社区',
  good: 'CNode: Node.js专业社区',
  share: '分享板块 - CNode技术社区',
  ask: '问答板块 - CNode技术社区',
  job: '招聘板块 - CNode技术社区'
}
export default {
  name: 'content',
  data () {
    return {
      spinShow: false,
      loadMoreShow: true,
      topics: [],
      tabs: {
        share: '分享',
        ask: '问答',
        job: '招聘'
      },
      page: 1,
      limit: 20,
      curTab: 'all'
    }
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
    document.title = titleTexts[this.$route.params.tab]
    this.loadContent()
  },
  methods: {
    async loadMore () {
      this.spinShow = true
      const response = await this.$http.get(baseUrl, {
        params: {
          tab: this.curTab,
          limit: this.limit,
          page: this.page
        }
      }).catch(err => console.log(err))
      const data = response.data.data
      this.topics = this.topics.concat(data)
      this.page++
      this.spinShow = false
      if (data.length < this.limit) {
        this.loadMoreShow = false
      }
    },
    async loadContent () {
      this.loadMoreShow = true
      const response = await this.$http.get(baseUrl, {
        params: {
          tab: this.curTab,
          limit: this.limit,
          page: this.page
        }
      }).catch(err => console.log(err))
      this.topics = response.data.data
      this.page++
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
html,
body {
  width: 100%;
}

.content {
  position: relative;
  margin-top: 60px;
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
  p {
    height: 40px;
    line-height: 40px;
  }
}
</style>
