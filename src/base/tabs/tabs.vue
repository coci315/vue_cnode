<template>
  <ul class="tabs">
    <li class="tab-item" v-for="(item,index) in tabs" :class="{'active':currentIndex === index}"
        @click="selectItem(index)">
      <span>{{item.name}} </span>
      <div class="border" v-show="currentIndex === index"></div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      tabs: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      selectItem (index) {
        this.$emit('select', index)
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .tabs {
    display: flex;
    align-items: center;
    margin: 0 auto;
    height: 38px;
    .tab-item {
      position: relative;
      flex: 1;
      height: 100%;
      padding: 8px;
      text-align: center;
      font-size: 14px;
      line-height: 1.5;
      color: #ccc;
      background-color: #444;
      &.active {
        color: #f9f9f9;
      }
      .border {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: #80bd01;
      }
    }
  }
</style>

