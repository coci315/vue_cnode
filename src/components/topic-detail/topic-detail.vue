<template>
<!-- <transition name="slide"> -->
  <div class="topic-detail">
    <div class="header" @click="backToTop">
      <div class="back" @click.stop="back">
        <Icon type="ios-arrow-back"></Icon>
      </div>
      <div class="header_title">
        <h2>话题</h2>
      </div>
    </div>
    <div class="loading-container" v-show="!data">
      <loading :showTitle="true"></loading>
    </div>
    <div class="main" v-if="data">
      <scroll class="main_wrap" 
              :data="data.replies"
              :pullup="true"
              @scrollToEnd="refresh()"
              ref="main_wrap"
      >
        <div>
          <div class="post">
            <div class="post_title">
              <h3>{{data.title}}</h3>
            </div>
            <div class="post_info clearfix">
              <div class="author">
                <a class="avatar" :href="'/user/' + data.author.loginname">
                  <img :src="data.author.avatar_url" :alt="data.author.loginname">
                </a>
                <div class="name">
                  <p>
                    <span class="put_top" v-if="data.top">置顶</span>
                    <span class="put_good" v-else-if="data.good">精华</span>
                    <span class="topiclist_tab" v-else>{{tabs[data.tab]}}</span>
                    <span class="author_name">{{data.author.loginname}}</span>
                  </p>
                  <p>{{data.create_at | fromNow}}创建 · {{data.visit_count}}次浏览</p>
                </div>
              </div>
              <div class="collect" @click="toggleFavorite">
                <Icon :type="favoriteType"></Icon>
              </div>        
            </div>
            <div class="post_content">
              <div class="content" v-html="data.content"></div>
            </div>
          </div>
          <!-- <div class="separation"></div> -->
          <div class="replies" v-if="data.reply_count">
            <div class="reply_count">
              <p>{{data.reply_count}}条回复</p>
            </div>
            <div class="replies_container">
              <ul>
                <li class="reply" v-for="(reply, index) in data.replies">
                    <div class="reply_header clearfix">
                      <div class="author">
                        <a class="avatar" :href="'/user/' + reply.author.loginname">
                          <img :src="reply.author.avatar_url" :alt="reply.author.loginname">
                        </a>
                        <div class="name">
                          <p>
                            <span class="author_name">{{reply.author.loginname}}</span>
                          </p>
                          <p class="info"><span class="floor">{{index+1}}楼</span> · {{reply.create_at | fromNow}}</p>
                        </div>
                      </div>
                      <div class="actions">
                        <span class="action_up" :class="{'uped': reply.is_uped}" @click="actionUp(index)">
                          <Icon type="thumbsup"></Icon>
                        </span>
                        <span class="ups_count">{{reply.ups.length}}</span>
                        <span class="action_reply">
                          <Icon type="reply"></Icon>
                        </span>
                      </div> 
                    </div>
                    <div class="reply_content_wrap">
                      <div class="reply_to" v-if="reply.reply_id">
                        <p>回复：{{calculate(reply.reply_id)}}楼</p>
                      </div>
                      <div class="reply_content" v-html="reply.content"></div>
                    </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="no_reply" v-if="!data.reply_count">
            <p>暂无回复</p>
          </div>
          <!-- <div class="separation"></div> -->
        </div>
      </scroll>
    </div>
  </div>
<!-- </transition> -->
</template>

<script>
import {getTopicDetail} from '../../api/api'
import scroll from '../../base/scroll/scroll'
import loading from '../../base/loading/loading'
export default {
  components: {
    loading,
    scroll
  },
  data () {
    return {
      tabs: {
        share: '分享',
        ask: '问答',
        job: '招聘'
      },
      data: null,
      isFavorite: false
    }
  },
  computed: {
    favoriteType () {
      return this.isFavorite ? 'android-favorite' : 'android-favorite-outline'
    }
  },
  created () {
    this._getTopicDetail()
  },
  methods: {
    actionUp (index) {
      const replies = this.data.replies
      replies[index].is_uped = !replies[index].is_uped
    },
    back () {
      this.$router.back()
    },
    backToTop () {
      this.$refs.main_wrap.scrollTo(0, 0, 500)
    },
    calculate (id) {
      const index = this.data.replies.findIndex(reply => {
        return reply.id === id
      })
      return index + 1
    },
    refresh () {
      this.$refs.main_wrap.refresh()
    },
    toggleFavorite () {
      this.isFavorite = !this.isFavorite
    },
    _getTopicDetail () {
      getTopicDetail(this.$route.params.id).then(res => {
        const data = res.data
        this.data = data
        this.isFavorite = data.is_collect
      })
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .topic-detail {
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
    .back {
      flex: 0 1 60px;
      height: 48px;
      line-height: 48px;
      padding-left: 30px;
      font-size: 20px;
      color: #f9f9f9;
    }
    .header_title {
      margin-left: -60px;
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
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  .main {
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
    bottom: 0;
    a {
      color: #0d2b91;
    }
    .main_wrap {
      height: 100%;
      overflow: hidden;
    }
    .post {
      padding: 12px 16px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      box-shadow: 0 2px 3px 0 #ccc;
      .post_title {
        h3 {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }

  .post_info {
    margin-top: 10px;
    font-size: 12px;
    color: #666;
    .author {
      float: left;
      .avatar,
      .name {
        float: left;
      }
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        img {
          max-width: 100%;
          border-radius: 50%;
        }
      }
      .name {
        margin-left: 16px;
        .author_name {
          margin-left: 6px;
          font-size: 14px;
          color: #333;
        }
      }
    }
    .collect {
      float: right;
      text-align: right;
      font-size: 24px;
    }
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

  .post_content {
    margin-top: 10px;
    line-height: 1.6em;
    font-size: 14px;
    color: #333;
  }

  .separation {
    height: 6px;
    background-color: #f1f1f1;
  }
  .post,
  .replies,
  .no_reply {
    background-color: #fff;
  }
  .replies,
  .no_reply {
    margin-top: 8px;
    border-bottom: 1px solid #ccc;
    box-shadow: 0 2px 3px 0 #ccc;
    font-size: 14px;
    color: #333;
  }
  .no_reply {
    padding: 20px;
    text-align: center;
    color: #999;
  }
  .reply_count,
  .reply {
    padding: 12px 16px;
  }
  .reply {
    border-top: 1px solid #ccc;
  }
  .reply_header {
    .author {
      float: left;
      .avatar,
      .name {
        float: left;
      }
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        img {
          max-width: 100%;
          border-radius: 50%;
        }
      }
      .name {
        margin-left: 16px;
        .author_name {
          font-size: 14px;
          color: #333;
        }
        .info {
          font-size: 12px;
          color: #666;
          .floor {
            color: #80bd01;
          }
        }
      }
    }
    .actions {
      float: right;
      vertical-align: top;
      text-align: right;
      font-size: 24px;
      color: #888;
      .uped {
        color: #80bd01;
      }
      span {
        display: inline-block;
        margin-right: 6px;
        vertical-align: middle;
      }
      .ups_count {
        font-size: 14px;
      }
    }    
  }

  .reply_content_wrap {
    margin-top: 10px;
    .reply_to {
      margin-bottom: 10px;
      color: #80bd01;
    }
  }

  // .slide-enter-active,
  // .slide-leave-active {
  //   transition: all .4s;
  // }
  // .slide-enter,
  // .slide-leave-active {
  //   transform: translate3d(100%, 0, 0);
  // }

</style>
