<template>
  <div class="weui-panel weui-panel_access">
    <div class="weui-panel__bd">
      <div class="weui-loadmore" v-if="loading">
        <i class="weui-loading"></i>
        <span class="weui-loadmore__tips">加载中...</span>
      </div>
      <div class="weui-loadmore weui-loadmore_line" v-else-if="!items || !items.length">
        <span class="weui-loadmore__tips">暂无服务</span>
      </div>
      <router-link :to="{name: 'ss-node-detail', params: {node_id: item.node_id}}"
        class="weui-media-box weui-media-box_appmsg" v-for="item in items" :key="item.node_id">
        <div class="weui-media-box__hd">
          <img class="weui-media-box__thumb" :src="item.avatar">
        </div>
        <div class="weui-media-box__bd">
          <h4 class="weui-media-box__title">
            <span>{{item.name}}</span>
            <span class="visible" v-if="item.is_visible">
              <i class="fa fa-eye"></i>
            </span>
            <span class="hidden" v-else>
              <i class="fa fa-eye-slash"></i>
            </span>
          </h4>
          <p class="weui-media-box__desc">{{item.description}}</p>
          <ul class="weui-media-box__info">
            <li class="weui-media-box__info__meta">{{item.server}}</li>
            <li class="weui-media-box__info__meta weui-media-box__info__meta_extra">{{item.method}}</li>
          </ul>
        </div>
      </router-link>
    </div>
    <div class="weui-panel__ft">
      <router-link :to="{name: 'ss-node-add'}" class="weui-cell weui-cell_access weui-cell_link">
        <div class="weui-cell__bd">添加节点</div>
        <span class="weui-cell__ft"></span>
      </router-link>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'

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
      Api('/api/ss/nodes').then((res) => {
        this.loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.items = res.data
      })
    }
  }
}
</script>

<style scoped>
.weui-media-box__info {
  margin-top: 10px;
}
.weui-media-box_appmsg .weui-media-box__thumb {
  vertical-align: middle;
}
.weui-media-box__title .visible,
.weui-media-box__title .hidden {
  float: right;
}
.weui-media-box__title .visible {
  color: #36A2EB;
}
.weui-media-box__title .hidden {
  color: #FB7886;
}
</style>
