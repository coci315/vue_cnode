<template>
<transition name="slideup">
  <div class="message">
    <div class="header">
      <div class="back" @click.stop="back">
        <Icon type="ios-arrow-back"></Icon>
      </div>
      <div class="header_title">
        <h2>消息</h2>
      </div>
      <div class="mark-all" @click="markAll">
        <Icon type="android-done-all"></Icon>
      </div>
    </div>
    <div class="loading-container" v-show="!data">
      <loading :showTitle="true"></loading>
    </div>
    <div class="main" v-if="data">
      <scroll class="main_wrap"
              :data="msgs"
      >
        <ul>
          <li class="msg" v-for="(item,index) in msgs">
            <div class="msg_header clearfix">
              <div class="author">
                <a class="avatar" :href="'/user/' + item.author.loginname">
                  <img :src="item.author.avatar_url" :alt="item.author.loginname">
                </a>
              </div>
              <div class="author_name">
                <p class="loginname">{{item.author.loginname}}</p>
                <p>回复了您的话题</p>
              </div>
              <div class="other-info">
                <p class="reply_time">{{item.create_at | fromNow}}</p>
                <div class="flag-wrap" v-show="item.hasNotRead">
                  <div class="has-not-read"></div>
                </div>
              </div>
            </div>
            <div class="msg_content" v-html="item.reply.content"></div>
            <div class="msg_reply_topic">
              <router-link :to="'/topic/' + item.topic.id" tag="p">话题：{{item.topic.title}}</router-link>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <tip ref="tip"><p>{{tipText}}</p></tip>
  </div>
</transition>
</template>

<script>
import loading from '../../base/loading/loading'
import scroll from '../../base/scroll/scroll'
import tip from '../../base/tip/tip'
import {getMessages, markAll} from '../../api/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    loading,
    scroll,
    tip
  },
  data () {
    return {
      data: null,
      tipText: ''
    }
  },
  computed: {
    hasReadMsgs () {
      return this.data ? this.data.has_read_messages : []
    },
    hasNotReadMsgs () {
      return this.data ? this.data.hasnot_read_messages : []
    },
    msgs () {
      const hasNotReadMsgs = this.hasNotReadMsgs.slice()
      hasNotReadMsgs.forEach(item => {
        item.hasNotRead = true
      })
      return hasNotReadMsgs.concat(this.hasReadMsgs)
    },
    ...mapGetters([
      'isSignin',
      'accesstoken'
    ])
  },
  created () {
    this._getMessages()
  },
  methods: {
    back () {
      this.$router.back()
    },
    markAll () {
      if (this.hasNotReadMsgs.length === 0) {
        this.tipText = '没有未读消息'
        this.$refs.tip.show()
      } else {
        markAll(this.accesstoken).then(res => {
          if (res.success) {
            this._getMessages()
            this.tipText = '已全部标记为已读'
            this.$refs.tip.show()
          }
        })
      }
    },
    _getMessages () {
      getMessages(this.accesstoken).then(res => {
        if (res.success) {
          this.data = res.data
        }
      })
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
.message {
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
  .mark-all {
    flex: 0 1 60px;
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
    font-size: 20px;
    color: #f9f9f9;
  }
  .mark-all {
    padding-right: 16px;
  }
  .header_title {
    flex: 1 1 275px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    h2 {
      font-size: 16px;
      color: #f9f9f9;
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
  .main_wrap {
    height: 100%;
    overflow: hidden;
  }
  .msg {
    padding: 12px 16px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    font-size: 13px;
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
    .author_name {
      float: left;
      .loginname {
        color: #333;
        font-weight: bold;
        &+p {
          margin-top: 2px;
          font-size: 12px;
        }
      }
    }
    .other-info {
      float: right;
      .reply_time {
        font-size: 12px;
      }
      .flag-wrap {
        margin-top: 8px;
      }
      .has-not-read {
        width: 8px;
        height: 8px;
        box-shadow: 0 0 10px 0 #f27040;
        margin: 0 auto;
        background-color: #f27040;
        border-radius: 50%;
      }
    }
    .msg_content {
      color: #333;
    }
    .msg_reply_topic {
      padding: 8px;
      background-color: #eee;
      border-radius: 3px;
      font-size: 12px;
      color: #333;
    }
  }
}
</style>  
