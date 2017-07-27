<template>
<transition name="slideup">
  <div class="user">
    <div class="back" @click.stop="back">
      <Icon type="ios-arrow-back"></Icon>
    </div>
    <div class="bg-image">
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
    <div class="list-wrap">
      <tabs :tabs="tabs" :currentIndex="currentIndex" @select="selectItem"></tabs>
    </div>
  </div>
</transition>
</template>

<script>
import {getUserDetail, getTopicCollect} from '../../api/api'
import tabs from '../../base/tabs/tabs'
export default {
  name: 'user',
  components: {
    tabs
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
  methods: {
    back () {
      this.$router.back()
    },
    selectItem (index) {
      this.currentIndex = index
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
</style>
