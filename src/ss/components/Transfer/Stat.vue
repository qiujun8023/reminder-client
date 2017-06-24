<template>
  <div>
    <div class="weui-panel__hd">
      流量详情
      <i class="fa fa-expand" v-if="!show_all" @click="show_all = true"></i>
      <i class="fa fa-compress" v-else @click="show_all = false"></i>
    </div>
    <div class="weui-panel__bd">
      <div class="weui-media-box weui-media-box_small-appmsg">
        <div class="weui-loadmore" v-if="isloading">
          <i class="weui-loading"></i>
          <span class="weui-loadmore__tips">正在加载</span>
        </div>
        <div class="weui-loadmore weui-loadmore_line" v-else-if="!stat || !stat.length">
          <span class="weui-loadmore__tips">暂无流量信息</span>
        </div>
        <div class="weui-cells" v-else>
          <div class="weui-cell" v-for="item in data_filtered">
            <div class="weui-cell__bd">
              {{item.date.slice(0, 2) + '月' + item.date.slice(3, 5) + '日'}}
            </div>
            <div class="weui-cell__ft">{{item.flow_total_v}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: ['isloading', 'stat'],

  data () {
    return {
      show_all: false
    }
  },

  computed: {
    data_filtered () {
      return _.slice(this.stat, 0, this.show_all ? this.stat.length : 5)
    }
  },

  created () {
    this.reverseStat()
  },

  methods: {
    reverseStat () {
      if (!this.stat || !this.stat.length) {
        return false
      }
      this.stat = _.reverse(this.stat)
    }
  },

  watch: {
    stat () {
      this.reverseStat()
    }
  }
}
</script>

<style scoped>
.fa {
  float: right;
}
</style>
