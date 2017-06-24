<template>
  <div>
    <div class="weui-panel">
      <div class="weui-panel__hd">服务信息</div>
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_small-appmsg">
          <div class="weui-cells">
            <div class="weui-cell">
              <div class="weui-cell__bd weui-cell_primary">
                <textarea class="weui-textarea" rows="6" v-model="service_json"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="weui-btn-area">
      <div class="weui-flex__item">
        <router-link :to="{name: 'ss-services'}" class="weui-btn weui-btn_default">返回</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Api from '../../libs/api'

export default {
  data () {
    return {
      service_id: null,
      is_loading: false,
      service_json: '加载中...'
    }
  },

  created () {
    this.service_id = Number(this.$route.params.service_id)
    this.fetch()
  },

  methods: {
    fetch () {
      this.is_loading = true
      let service_id = this.service_id
      Api('/api/ss/services/detail', {
        query: {
          service_id
        }
      }).then((res) => {
        this.is_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        let filter = ['server', 'server_port', 'password', 'method']
        res.data.server_port = res.data.port
        res.data = _.pick(res.data, filter)
        this.service_json = JSON.stringify(res.data, null, 4)
      })
    }
  }
}
</script>
