<template>
<div class="signin">
  <div class="bg-image" ref="bgImage">
    <div class="back" @click.stop="back">
      <Icon type="ios-arrow-back"></Icon>
    </div>
    <div class="title">
      <h2>登录</h2>
    </div>
    <div class="home" @click.stop="toHome">
      <Icon type="android-home"></Icon>
    </div>
    <div class="logo">
      <img src="../../assets/cnodejs_light.svg" alt="logo">
      <p>cnodejs.org</p>
    </div>
  </div>
  <div class="input-wrap">
    <div class="input" :class="{error:isError}">
      <div class="label-wrap">
        <transition name="slide">
          <label for="accessToken" v-show="showLabel">Access Token:</label>
        </transition>
      </div>
      <input type="text" id="accessToken" placeholder="Access Token:" v-model.trim="inputText" @input="clearError" ref="input">
      <p class="error_info" v-show="isError">{{errorText}}</p>
    </div>
    <button type="button" @click="submit">登录</button>
    <div class="action-wrap">
      <div class="scan-signin"></div>
      <div class="github-signin"></div>
    </div>
  </div>
  <div class="mask" v-show="showLoading">
    <div class="loading-container">
      <loading :showTitle="true" title="正在登录..."></loading>
    </div>
  </div>
</div>
</template>

<script>
const uuidReg = /^\w{8}(-\w{4}){3}-\w{12}$/
import { signin, getUserDetail } from '../../api/api'
import { mapActions } from 'vuex'
import loading from '../../base/loading/loading'
export default {
  data () {
    return {
      inputText: '',
      isError: false,
      errorText: '',
      showLoading: false
    }
  },
  components: {
    loading
  },
  computed: {
    showLabel () {
      return this.inputText.length > 0
    }
  },
  mounted () {
    this.$refs.input.focus()
  },
  methods: {
    back () {
      this.$router.back()
    },
    clearError () {
      this.errorText && (this.errorText = '')
      this.isError && (this.isError = false)
    },
    submit () {
      if (!this.inputText) return
      if (!uuidReg.test(this.inputText)) {
        return this._getInputError()
      }
      this.showLoading = true
      signin(this.inputText).then(res => {
        if (res.success) {
          this.signin({...res, accesstoken: this.inputText})
          getUserDetail(res.loginname).then(res => {
            this.saveTheScore(res.data.score)
            this.showLoading = false
            this.$emit('signin')
            this.back()
          })
        }
      }).catch((e) => {
        this._getValidateError()
        this.showLoading = false
      })
    },
    toHome () {
      this.$router.push('/')
    },
    _getError (text) {
      this.errorText = text
      this.isError = true
    },
    _getInputError () {
      this._getError('AccessToken格式错误，应为UUID')
    },
    _getValidateError () {
      this._getError('AccessToken验证错误')
    },
    ...mapActions([
      'signin',
      'saveTheScore'
    ])
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: all .4s;
}
.slide-enter,
.slide-leave-active {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
.signin {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f1f1;
}

.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 60%;
  background-size: cover;
  background-image: url('../../assets/signin_bg.jpg');
}

.back,
.home {
  position: absolute;
  z-index: 50;
  top: 0;
  padding-left: 30px;
  width: 60px;
  height: 48px;
  line-height: 48px;
  font-size: 20px;
  color: #f9f9f9;
}
.back {
  left: 0;
}
.home {
  right: 0;
  padding-left: 20px;
}

.title {
  position: absolute;
  width: 100%;
  height: 48px;
  line-height: 48px;
  top: 0;
  left: 0;
  text-align: center;
  h2 {
    font-size: 18px;
    font-weight: normal;
    color: #f9f9f9;
  }
}

.logo {
  position: absolute;
  width: 60%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  p {
    text-align: center;
    font-size: 14px;
    color: #f1f1f1;
  }
}

.input-wrap {
  position: relative;
  z-index: 10;
  width: 90%;
  height: 200px;
  margin: 0 auto;
  margin-top: -30px;
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 1px 2px 6px 0 #ccc;
  input,
  button {
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    font-size: 14px;
  }
  input {
    border-bottom: 2px solid #80bd01;
    border-radius: 0;
  }
  button {
    border-radius: 2px;
    background-color: #80bd01;
    font-size: 14px;
    color: #f1f1f1;
    &:active {
      transform: scale(.995);
      background-color: lighten(#80bd01, 5%);
    }
  }
  .input {
    margin-bottom: 20px;
    .label-wrap {
      height: 14px;
    }
    label {
      display: inline-block;
      width: 80px;
      height: 14px;
      font-size: 12px;
      color: #80bd01;
    }
    &.error {
      input {
        border-color: #f00;
      }
    }
  }
  .error_info {
    padding: 4px 0;
    font-size: 12px;
    color: #f00;
  }
}

.mask {
  position: fixed;
  z-index: 500;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .7);
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    color: #f1f1f1;
  }
}
</style>
