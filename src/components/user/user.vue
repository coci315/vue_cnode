<template>
<transition name="slideup">
  <div class="user">
    <div class="back" @click.stop="back">
      <Icon type="ios-arrow-back"></Icon>
    </div>
    <div class="bg-image" ref="bgImage">
      <div class="user_basic">
        <div class="avatar">
          <img :src="imgUrl" alt="用户头像">
        </div>
        <p class="loginname">{{$route.params.loginname}}</p>
        <p class="github" v-if="userData && userData.githubUsername"><a class="githubLink" :href="'https://github.com/'+userData.githubUsername">{{userData.githubUsername+'@github.com'}}</a></p>
      </div>
      <div class="user_create" v-if="userData">
        <p class="create">注册时间：{{userData.create_at.slice(0, 10)}}</p>
      </div>
      <div class="user_score" v-if="userData">
        <p class="score">积分：{{userData.score}}</p>
      </div>
    </div>
    <tabs :tabs="tabs" :currentIndex="currentIndex" @select="selectItem"></tabs>
    <div class="list-wrap" ref="listWrap">
      <div class="container-wrap"  v-if="userData">
        <scroll class="container" :data="topicCollect" ref="container">
          <div>
            <ul class="recent_replies" v-show="currentIndex === 0">
              <li class="reply" v-for="item in userData.recent_replies">
                <a :href="'/topic/' + item.id">
                  <div class="item clearfix">
                    <div class="author">
                      <a class="avatar" :href="'/user/' + item.author.loginname">
                        <img :src="item.author.avatar_url" :alt="item.author.loginname">
                      </a>
                    </div>
                    <div class="content">
                      <h3 class="title">{{item.title}}</h3>
                      <div class="other-info clearfix">
                        <p class="author_name">{{item.author.loginname}}</p>
                        <p class="reply_time">{{item.last_reply_at | fromNow}}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
            <ul class="recent_topics" v-show="currentIndex === 1">
              <li class="topic" v-for="item in userData.recent_topics">
                <a :href="'/topic/' + item.id">
                  <div class="item clearfix">
                    <div class="author">
                      <a class="avatar" :href="'/user/' + item.author.loginname">
                        <img :src="item.author.avatar_url" :alt="item.author.loginname">
                      </a>
                    </div>
                    <div class="content">
                      <h3 class="title">{{item.title}}</h3>
                      <div class="other-info clearfix">
                        <p class="author_name">{{item.author.loginname}}</p>
                        <p class="reply_time">{{item.last_reply_at | fromNow}}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
            <ul class="collect_topics" v-show="currentIndex === 2">
              <li class="topic" v-for="item in topicCollect">
                <a :href="'/topic/' + item.id">
                  <div class="item clearfix">
                    <div class="author">
                      <a class="avatar" :href="'/user/' + item.author.loginname">
                        <img :src="item.author.avatar_url" :alt="item.author.loginname">
                      </a>
                    </div>
                    <div class="content">
                      <h3 class="title">{{item.title}}</h3>
                      <div class="other-info clearfix">
                        <p class="author_name">{{item.author.loginname}}</p>
                        <p class="reply_time">{{item.last_reply_at | fromNow}}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import {getUserDetail, getTopicCollect} from '../../api/api'
import tabs from '../../base/tabs/tabs'
import scroll from '../../base/scroll/scroll'
const tabsHeight = 38
export default {
  name: 'user',
  components: {
    tabs,
    scroll
  },
  data () {
    return {
      userData: null,
      topicCollect: [],
      imgUrl: require('../../assets/default_header.png'),
      tabs: [
        {name: '最近回复'},
        {name: '最新发布'},
        {name: '话题收藏'}
      ],
      currentIndex: 0
    }
  },
  created () {
    this._getUserDetail()
    this._getTopicCollect()
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.$refs.listWrap.style.top = (this.imageHeight + tabsHeight) + 'px'
  },
  methods: {
    back () {
      this.$router.back()
    },
    selectItem (index) {
      this.currentIndex = index
      setTimeout(() => {
        this.$refs.container.refresh()
      }, 60)
    },
    _getUserDetail () {
      getUserDetail(this.$route.params.loginname).then(res => {
        this.userData = res.data
        this.imgUrl = res.data.avatar_url
      })
    },
    _getTopicCollect () {
      getTopicCollect(this.$route.params.loginname).then(res => {
        this.topicCollect = res.data
      })
    }
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
.user {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f1f1;
}
.back {
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  padding-left: 30px;
  width: 60px;
  height: 48px;
  line-height: 48px;
  font-size: 20px;
  color: #f9f9f9;
}

.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 60%;
  background-size: cover;
  background-image: url('../../assets/user_bg.jpg');
}
.user_basic {
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  width: 120px;
  height: 120px;
  transform: translateX(-50%) translateY(-50%);
  color: #f9f9f9;
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 0 auto;
    img {
      max-width: 100%;
      border-radius: 50%;
    }
  }
  .loginname {
    margin-top: 6px;
    font-size: 16px;
  }
  .github {
    margin-top: 4px;
  }
  .githubLink {
    font-size: 14px;
    color: #ccc;
    text-decoration: underline;
  }
}

.user_create,
.user_score {
  position: absolute;
  bottom: 10px;
  font-size: 12px;
}
.user_create {
  left: 16px;
  color: #ccc;
}
.user_score {
  right: 16px;
  color: #80bd01;
}

.list-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.container-wrap {
  height: 100%;
  overflow: hidden;
}
.container {
  height: 100%;
  overflow: hidden;
  li {
    padding: 12px 16px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    .author {
      float: left;
      width: 40px;
      height: 40px;
      margin-right: 16px;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        img {
          max-width: 100%;
          border-radius: 50%;
        }
      }
    }
    .content {
      .title {
        margin-bottom: 4px;
        font-size: 14px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .other-info {
        font-size: 12px;
        color: #666;
      }
      .author_name {
        float: left;
      }
      .reply_time {
        float: right;
      }
    }
  }
}
</style>
