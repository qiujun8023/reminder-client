<template>
  <div>
    <div class="weui-panel weui-panel_access">
      <service-info :title="'全局配置'" :user="profile" :isloading="is_loading"></service-info>

      <div class="weui-panel__hd">服务列表</div>
      <div class="weui-panel__bd">
        <div class="weui-loadmore" v-if="loading">
          <i class="weui-loading"></i>
          <span class="weui-loadmore__tips">加载中...</span>
        </div>
        <div class="weui-loadmore weui-loadmore_line" v-else-if="!items || !items.length">
          <span class="weui-loadmore__tips">暂无服务</span>
        </div>
        <router-link :to="{name: 'ss-service-detail', params: {service_id: item.service_id}}"
          class="weui-media-box weui-media-box_appmsg" v-for="item in items" :key="item.service_id">
          <div class="weui-media-box__hd">
            <img class="weui-media-box__thumb" :src="item.avatar">
          </div>
          <div class="weui-media-box__bd">
            <h4 class="weui-media-box__title">{{item.name}}</h4>
            <p class="weui-media-box__desc">{{item.description}}</p>
            <ul class="weui-media-box__info">
              <li class="weui-media-box__info__meta">{{item.server}}</li>
              <li class="weui-media-box__info__meta weui-media-box__info__meta_extra">{{item.method}}</li>
            </ul>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'
import ServiceInfo from '../../components/Service/Info'

export default {
  props: ['profile'],
  components: {
    ServiceInfo
  },

  data () {
    return {
      loading: false,
      items: []
    }
  },

  computed: {
    is_loading () {
      return !this.profile.port && !this.profile.password
    }
  },

  created () {
    this.fetch()
  },

  methods: {
    fetch () {
      this.loading = true
      Api('/api/ss/services').then((res) => {
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
</style>
