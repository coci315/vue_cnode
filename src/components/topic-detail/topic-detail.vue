<template>
<div class="topic-detail">
  <div class="header">
    <div class="back" @click="back">
      <Icon type="ios-arrow-back"></Icon>
    </div>
    <div class="title">
      <h2>话题</h2>
    </div>
  </div>
  <div class="loading-container" v-show="!data">
    <loading :showTitle="true"></loading>
  </div>
</div>
</template>

<script>
import {getTopicDetail} from '../../api/api'
import loading from '../../base/loading/loading'
export default {
  components: {
    loading
  },
  data () {
    return {
      data: null
    }
  },
  created () {
    this._getTopicDetail()
  },
  methods: {
    back () {
      this.$router.back()
    },
    _getTopicDetail () {
      getTopicDetail(this.$route.params.id).then(res => {
        console.log(res.data)
        this.data = res.data
      })
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .topic-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }
  .header {
    display: flex;
    height: 60px;
    background-color: #444;
    .back {
      flex: 0 1 60px;
      height: 60px;
      line-height: 60px;
      padding-left: 30px;
      font-size: 20px;
      color: #f9f9f9;
    }
    .title {
      margin-left: -60px;
      flex: 1 1 275px;
      height: 60px;
      line-height: 60px;
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
</style>
