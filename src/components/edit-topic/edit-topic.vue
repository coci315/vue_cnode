<template>
<transition name="slideup">
  <div class="create-topic" @click="hideMenu">
    <div class="header">
      <div class="back" @click.stop="back">
        <Icon type="ios-arrow-back"></Icon>
      </div>
      <div class="header_title">
        <h2>编辑话题</h2>
      </div>
      <div class="send" @click.stop="send">
        <Icon type="android-send"></Icon>
      </div>
    </div>
    <div class="topic_tab" v-if="canEdit">
      <span class="label">发布到分类：</span>
      <span class="tab" @click.stop="showMenu">
        <span>{{tabs[tab]}}</span>
        <Icon type="arrow-down-b"></Icon>
        <transition name="fade">
          <ul v-show="isShowMenu">
            <li v-for="(option, index) in options" @click="select(index)">{{option.text}}</li>
          </ul>
        </transition>
      </span>
    </div>
    <div class="topic_title" v-if="canEdit">
      <input type="text" placeholder="标题，字数10字以上" v-model="title">
    </div>
    <div class="topic_content" v-if="canEdit">
      <editor @change="changeContent" :value="content"></editor>
    </div>
    <div class="can_not_edit" v-if="!canEdit">
      <p>对不起，你不能编辑此话题。</p>
    </div>
    <tip ref="tip"><p>{{tipText}}</p></tip>
    <confirm ref="confirm" text="该操作需要登录帐户。是否现在登录？" confirmBtnText="登录" @confirm="toSignin"></confirm>
  </div>
</transition>
</template>

<script>
import editor from '../../base/editor/editor'
import tip from '../../base/tip/tip'
import confirm from '../../base/confirm/confirm'
import {editTopic, getTopicDetail} from '../../api/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    editor,
    tip,
    confirm
  },
  data () {
    return {
      title: '',
      tab: 'share',
      content: '',
      tabs: {
        share: '分享',
        ask: '问答',
        job: '招聘',
        dev: '客户端测试'
      },
      isShowMenu: false,
      options: [
        {value: 'share', text: '分享'},
        {value: 'ask', text: '问答'},
        {value: 'job', text: '招聘'},
        {value: 'dev', text: '客户端测试'}
      ],
      tipText: '',
      authorId: ''
    }
  },
  computed: {
    ...mapGetters([
      'isSignin',
      'accesstoken',
      'id'
    ]),
    canEdit () {
      return this.id === this.authorId
    }
  },
  created () {
    getTopicDetail(this.$route.params.id, this.accesstoken, false).then(res => {
      if (res.success) {
        const data = res.data
        this.authorId = data.author_id
        this.title = data.title
        this.tab = data.tab
        this.content = data.content
      }
    })
  },
  methods: {
    back () {
      this.$router.back()
    },
    changeContent (value) {
      this.content = value
    },
    showMenu () {
      this.isShowMenu = !this.isShowMenu
    },
    hideMenu () {
      this.isShowMenu = false
    },
    select (index) {
      this.tab = this.options[index].value
    },
    send () {
      if (!this.isSignin) {
        this.$refs.confirm.show()
      } else {
        if (!this._validate()) return
        editTopic(this.accesstoken, this.$route.params.id, this.title, this.tab, this.content).then(res => {
          if (res.success) {
            this.$router.push('/topic/' + res.topic_id)
          }
        })
      }
    },
    toSignin () {
      this.$router.push('/signin')
    },
    _validate () {
      if (!this.canEdit) {
        this.tipText = '你无权编辑此话题'
        this.$refs.tip.show()
        return false
      }
      if (this.title.trim().length < 10) {
        this.tipText = '标题要求10字以上'
        this.$refs.tip.show()
        return false
      }
      if (!this.content.trim()) {
        this.tipText = '内容不能为空'
        this.$refs.tip.show()
        return false
      }
      return true
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

.fade-enter-active,
.fade-leave-active {
  transition: all .15s;
  transform-origin: top center;
}
.fade-enter,
.fade-leave-active {
  transform: scale(.9);
}
.create-topic {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f1f1;
  input,
  textarea {
    caret-color: #80bd01;
  }
}
.header {
  flex: 0 1 48px;
  display: flex;
  height: 48px;
  background-color: #444;
  .back,
  .send {
    flex: 0 1 60px;
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
    font-size: 20px;
    color: #f9f9f9;
  }
  .send {
    padding-left: 20px;
  }
  .header_title {
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
.topic_tab {
  flex: 0 1 52px;
  padding: 0 12px;
  height: 52px;
  line-height: 52px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  &>span {
    display: inline-block;
  }
  .label {
    width: 30%;
    font-size: 12px;
    color: #80bd01;
  }
  .tab {
    position: relative;
    width: 65%;
    font-size: 13px;
    color: #666;
    span {
      display: inline-block;
      width: 90%;
    }
    ul {
      position: absolute;
      z-index: 2500;
      left: -10px;
      top: 0;
      width: 95%;
      padding: 0 10px;
      background-color: #f4f4f4;
      li {
        margin: 20px 0;
        font-size: 13px;
        line-height: 1;
      }
    }
  }
}
.topic_title  {
  flex: 0 1 52px;
  padding: 0 12px;
  height: 52px;
  line-height: 52px;
  border-bottom: 1px solid #ccc;
  font-size: 15px;
  background-color: #fff;
  input {
    width: 100%;
    height: 80%;
    border: none;
    outline: none;
    font-weight: bold;
    color: #333;
  }
  ::-webkit-input-placeholder {
    color: #aaa;
  }
}
.topic_content {
  flex: 1;
  height: 300px;
  textarea {
    color: #333;
  }
}

.can_not_edit {
  flex: 1;
  position: relative;
  height: 300px;
  color: #b94a48;
  background-color: #f2dede;
  text-align: center;
  p {
    position: absolute;
    width: 100%;
    top: 50%;
    height: 20px;
    transform: translateY(-50%);
    font-size: 16px;

  }
}
</style>
