<template>
  <div>
    <div class="weui-loadmore" v-if="loading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">加载中...</span>
    </div>
    <div class="weui-loadmore weui-loadmore_line" v-else-if="!items || !items.length">
      <span class="weui-loadmore__tips">暂无数据</span>
    </div>
    <div class="weui-panel weui-panel_access" v-else>
      <div class="weui-panel__bd">
        <router-link :to="{name: 'ss-user-detail', params: {user_id: item.user_id}}"
          class="weui-media-box weui-media-box_appmsg" v-for="item in items" :key="item.user_id">
          <div class="weui-media-box__bd">
            <h4 class="weui-media-box__title">
              <span>{{item.name}}</span>
              <span class="value">{{item.transfer_used_v}}</span>
            </h4>
            <ul class="weui-media-box__info">
              <li class="weui-media-box__info__meta">
                {{'活跃于 '+ item.active_at}}
              </li>
              <li class="weui-media-box__info__meta">
                {{'已用，共 ' + item.transfer_enable_v}}
              </li>
            </ul>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'
import {getTransferPercent} from '../../libs/utils'

export default {
  data () {
    return {
      loading: false,
      items: []
    }
  },

  created () {
    this.fetch()
  },

  methods: {
    fetch () {
      this.loading = true
      Api('/api/ss/users').then((res) => {
        this.loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        for (let item of res.data) {
          let transfer_percent = getTransferPercent(item.transfer_enable, item.transfer_used) * 100
          item.transfer_percent = transfer_percent.toFixed(2)
        }
        this.items = res.data
      })
    }
  }
}
</script>

<style scoped>

.weui-media-box__title {
  font-size: 1.1em;
}
.weui-media-box__title .value {
  float: right;
  color: #FB7886;
}
.weui-media-box__title .value span:last-child {
  font-size: 0.6em;
}
.weui-media-box__info {
  margin-top: 10px;
}
.weui-media-box__info .weui-media-box__info__meta:last-child {
  float: right;
  padding-right: 0;
}
</style>
