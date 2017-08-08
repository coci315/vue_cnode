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
              :listenScroll="true"
              :probeType="3"
              @scroll="scroll"
              :pulldown="true"
              @pulldown="refreshData"
      >
        <div :style="{minHeight: mainMinHeight + 'px'}" ref="div">
          <div class="refresh" v-show="isShowRefresh" ref="refresh">
            <p v-show="isShowText">
              <span class="arrow"><Icon :class="{rotate:isRotate}" type="android-arrow-down"></Icon></span>
              {{refreshText}}
            </p>
            <div class="loading-wrap" v-show="refreshing">
              <loading></loading>
            </div>
          </div>
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
              <div class="collect" :class="{favorite: isFavorite}" @click="toggleFavorite">
                <Icon :type="favoriteType"></Icon>
              </div>
              <div class="edit" v-if="showEdit" @click="toEditTopic">
                <Icon type="compose"></Icon>  
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
                        <span class="action_reply" @click="actionReply(index)">
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
    <div class="reply-btn-wrap" ref="replyBtnWrap" @click.stop="showEditor">
      <Icon type="reply" />
    </div>
    <div class="mask" v-show="isShowEditor" @click="hideEditor"></div>
    <transition name="drop">
      <div class="editor-wrap" v-show="isShowEditor" :class="{'has_reply_to': (replyTo>0)}">
        <div class="reply_to" v-show="replyTo>0">
          <span class="text">回复：{{replyTo}}楼</span>
          <span class="icon" @click.stop="resetReplyTo"><Icon type="android-close"></Icon></span> 
        </div>
        <editor @change="changeContent" :value="content"></editor>
        <div class="send-btn" @click.stop="send">
          <Icon type="android-send"></Icon>
        </div>
      </div>
    </transition>
    <tip ref="tip"><p>{{tipText}}</p></tip>
    <confirm ref="confirm" text="该操作需要登录帐户。是否现在登录？" confirmBtnText="登录" @confirm="toSignin"></confirm>
  </div>
<!-- </transition> -->
</template>

<script>
import {getTopicDetail, collectTopic, cancelCollectTopic, upOrDownReply, createReply} from '../../api/api'
import { mapGetters } from 'vuex'
import scroll from '../../base/scroll/scroll'
import loading from '../../base/loading/loading'
import tip from '../../base/tip/tip'
import confirm from '../../base/confirm/confirm'
import editor from '../../base/editor/editor'
// import Reply from '../../common/js/reply'
const headerHeight = 47
export default {
  components: {
    loading,
    scroll,
    tip,
    confirm,
    editor
  },
  data () {
    return {
      tabs: {
        share: '分享',
        ask: '问答',
        job: '招聘',
        dev: '客户端测试'
      },
      data: null,
      isFavorite: false,
      tipText: '',
      topicId: '',
      scrollY: 0,
      isShowEditor: false,
      content: '',
      // renderContent: '',
      replyId: '',
      replyTo: 0,
      isShowRefresh: true,
      isShowText: true,
      refreshText: '下拉刷新',
      isRotate: false,
      refreshing: false
    }
  },
  computed: {
    favoriteType () {
      return this.isFavorite ? 'android-favorite' : 'android-favorite-outline'
    },
    ...mapGetters([
      'isSignin',
      'accesstoken',
      'id',
      'loginname',
      'avatarUrl',
      'isTopicTailOn',
      'topicTail'
    ]),
    showEdit () {
      return this.id === this.data.author_id
    }
  },
  created () {
    this._getTopicDetail()
  },
  mounted () {
    this.mainMinHeight = window.innerHeight - headerHeight
  },
  methods: {
    actionUp (index) {
      if (!this.isSignin) {
        this.$refs.confirm.show()
      } else {
        const replies = this.data.replies
        upOrDownReply(replies[index].id, this.accesstoken).then(res => {
          if (res.success) {
            replies[index].is_uped = !replies[index].is_uped
            if (res.action === 'up') {
              replies[index].ups.push(this.id)
            } else {
              const i = replies[index].ups.indexOf(this.id)
              replies[index].ups.splice(i, 1)
            }
          }
        })
      }
    },
    actionReply (index) {
      if (!this.isSignin) {
        this.$refs.confirm.show()
      } else {
        const replies = this.data.replies
        this.replyId = replies[index].id
        this.replyTo = index + 1
        this.content = '@' + replies[index].author.loginname + ' '
        this.showEditor()
      }
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
    changeContent (value, render) {
      this.content = value
      // this.renderContent = render
    },
    refresh () {
      this.$refs.main_wrap.refresh()
    },
    refreshData () {
      this.$refs.div.style.marginTop = '30px'
      this.refreshing = true
      this.isShowText = false
      getTopicDetail(this.$route.params.id, this.accesstoken).then(res => {
        const data = res.data
        this.data = data
        this.isFavorite = data.is_collect
        this.topicId = data.id
        this.refreshing = false
        setTimeout(() => {
          this.isShowText = true
        }, 500)
        this.$refs.div.style.marginTop = '0'
        this.tipText = '刷新成功'
        this.$refs.tip.show()
      })
    },
    resetReplyTo () {
      this.replyId = ''
      this.replyTo = 0
    },
    scroll (pos, maxScrollY) {
      const y = pos.y
      if (y > 50) {
        this.refreshText = '释放更新'
        this.isRotate = true
      } else {
        this.refreshText = '下拉刷新'
        this.isRotate = false
      }
      if (pos.y > 0) return
      if (pos.y < maxScrollY) return
      this.scrollY = pos.y
    },
    send () {
      if (!this.isSignin) {
        this.$refs.confirm.show()
      } else {
        if (!this._validate()) return
        let content = this.content
        // let renderContent = this.renderContent
        if (this.isTopicTailOn) {
          content += ('\n\n' + this.topicTail)
          // renderContent += ('\n\n' + this.topicTail)
        }
        createReply(this.topicId, this.accesstoken, content, this.replyId).then(res => {
          if (res.success) {
            this.hideEditor()
            // this.data.replies.push(new Reply({
            //   id: res.reply_id,
            //   loginname: this.loginname,
            //   avatar_url: this.avatarUrl,
            //   content: renderContent,
            //   reply_id: this.replyId
            // }))
            this.content = ''
            // this.renderContent = ''
            this.replyId = ''
            this.replyTo = 0
            this._getTopicDetail()
          }
        })
      }
    },
    showEditor () {
      if (!this.isSignin) {
        this.$refs.confirm.show()
      } else {
        this.isShowEditor = true
      }
    },
    hideEditor () {
      this.isShowEditor = false
    },
    toggleFavorite () {
      if (!this.isSignin) {
        this.$refs.confirm.show()
      } else {
        if (this.isFavorite) {
          cancelCollectTopic(this.accesstoken, this.topicId).then(res => {
            if (res.success) {
              this.isFavorite = false
              this.tipText = '取消收藏成功'
              this.$refs.tip.show()
            }
          })
        } else {
          collectTopic(this.accesstoken, this.topicId).then(res => {
            if (res.success) {
              this.isFavorite = true
              this.tipText = '收藏成功'
              this.$refs.tip.show()
            }
          })
        }
      }
    },
    toSignin () {
      this.$router.push('/signin')
    },
    toEditTopic () {
      this.$router.push('/topic/' + this.topicId + '/edit')
    },
    _getTopicDetail () {
      getTopicDetail(this.$route.params.id, this.accesstoken).then(res => {
        const data = res.data
        this.data = data
        this.isFavorite = data.is_collect
        this.topicId = data.id
      })
    },
    _validate () {
      if (!this.content.trim()) {
        this.tipText = '内容不能为空'
        this.$refs.tip.show()
        return false
      }
      return true
    }
  },
  watch: {
    scrollY (newVal, oldVal) {
      if (newVal > 0) return
      if (newVal < oldVal) {
        this.$refs.replyBtnWrap.style.bottom = '-90px'
      } else if (newVal > oldVal) {
        this.$refs.replyBtnWrap.style.bottom = '20px'
      }
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .refresh {
    position: absolute;
    z-index: 20;
    left: 0;
    right: 0;
    top: -30px;
    height: 30px;
    line-height: 30px;
    background-color: rgba(0, 0, 0, 0);
    font-size: 14px;
    color: #333;
    font-weight: bold;
    text-align: center;
    .arrow i{
      transition: all .2s;
      &.rotate {
        transform: rotate(-180deg);
      }
    }
  }
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
      &.favorite {
        color: #80bd01;
      }
    }
    .edit {
      float: right;
      margin-right: 20px;
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

.reply-btn-wrap {
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

.mask {
  position: fixed;
  z-index: 98;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .7);
}

.editor-wrap {
  position: fixed;
  z-index: 99;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 300px;
  textarea {
    caret-color: #80bd01;
    color: #333;
  }
  .send-btn {
    position: absolute;
    z-index: 2000;
    top: 40px;
    right: 12px;
    font-size: 20px;
  }
  .reply_to {
    position: absolute;
    z-index: 2000;
    top: -30px;
    left: 0;
    width: 100%;
    height: 30px;
    padding: 0 18px;
    line-height: 30px;
    background-color: #80bd01;
    color: #fff;
    font-size: 13px;
    .text {
      float: left;
    }
    .icon {
      float: right;
      font-size: 16px;
    }
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

  .drop-enter-active,
  .drop-leave-active {
    transition: all .2s;
  }
  .drop-enter,
  .drop-leave-active {
    height: 0;
  }

  .dark {
    .refresh {
      color: #eee;
    }

    .topic-detail {
      background-color: #555;
    }

    .loading-container {
      color: #eee;
    }

    .main {
      .post,
      .replies,
      .no_reply {
        background-color: #666;
      }
      .post {
        border-color: #888;
        box-shadow: 0 2px 3px 0 #888;
        .post_title {
          h3 {
            color: #ddd;
          }
        }
        .post_info {
          color: #ddd;
          .author {
            .name {
              .author_name {
                color: #eee;
              }
            }
          }
        }
        .topiclist_tab {
          color: #e5e5e5;
          background-color: #999;
        }
        .post_content {
          color: #ddd;
          .markdown-text {
            pre,
            code {
              background-color: #888 !important;
              color: #ccc !important;
            }
          }
        }
      }

      .replies,
      .no_reply {
        border-color: #888;
        box-shadow: 0 2px 3px 0 #888;
        color: #ddd;
      }
      .no_reply {
        color: #ddd;
      }
      .reply {
        border-color: #888;
      }
      .reply_header {
        .author {
          .name {
            .author_name {
              color: #eee;
            }
          }
          .info {
            color: #ddd;
          }
        }
        .actions {
          color: #ddd;
        }
      }
    }
  }
</style>
