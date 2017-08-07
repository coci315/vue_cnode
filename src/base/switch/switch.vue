<template>
<div class="switch" :class="{on: on}" @click.stop="toggleSwitch">
  <div class="dot"></div>
</div>
</template>

<script>
export default {
  data () {
    return {
      on: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.on = this.value
  },
  methods: {
    toggleSwitch () {
      this.on = !this.on
      this.$emit('change', this.on)
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.switch {
  position: relative;
  width: 30px;
  height: 15px;
  border-radius: 15px;
  background-color: #aaa;
  .dot {
    position: absolute;
    left: 0;
    top: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    border-radius: 50%;
    background-color: #ddd;
    transition: left .3s;
  }
  &.on {
    background-color: #b8da72;
    .dot {
      left: 10px;
      background-color: #80bd01;
    }
  }
}
</style>  
