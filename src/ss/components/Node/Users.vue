<template>
  <div>
    <div class="weui-panel__hd">
      活跃用户
      <i class="fa fa-expand" v-if="!show_all" @click="show_all = true"></i>
      <i class="fa fa-compress" v-else @click="show_all = false"></i>
    </div>
    <div class="weui-panel__bd">
      <div class="weui-media-box weui-media-box_small-appmsg">
        <div class="weui-loadmore" v-if="isloading">
          <i class="weui-loading"></i>
          <span class="weui-loadmore__tips">正在加载</span>
        </div>
        <div class="weui-loadmore weui-loadmore_line" v-else-if="!users || !users.length">
          <span class="weui-loadmore__tips">暂无用户信息</span>
        </div>
        <div class="weui-cells" v-else>
          <div class="weui-cell" v-for="user in users_filtered">
            <div class="weui-cell__bd">{{user.name}}</div>
            <div class="weui-cell__ft">{{user.active_at}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: ['isloading', 'users'],

  data () {
    return {
      show_all: false
    }
  },

  computed: {
    users_filtered () {
      return _.slice(this.users, 0, this.show_all ? this.users.length : 5)
    }
  }
}
</script>

<style scoped>
.fa {
  float: right;
}
</style>
