<template>
  <transition name="fade">
    <div class="tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      delay: {
        type: Number,
        default: 2000
      }
    },
    data () {
      return {
        showFlag: false
      }
    },
    methods: {
      show () {
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, this.delay)
      },
      hide () {
        this.showFlag = false
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

.tip {
  position: fixed;
  left: 50%;
  bottom: 100px;
  z-index: 2500;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, .6);
  width: 160px;
  border-radius: 80px;
  transform: translateX(-50%);
  text-align: center;
  font-size: 14px;
  color: #f1f1f1;
}
.fade-enter-active,
.fade-leave-active {
  transition: all .8s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
