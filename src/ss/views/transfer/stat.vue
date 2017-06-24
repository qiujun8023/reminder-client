<template>
  <div class="transfer">
    <transfer-chart-stat :data="stat" :isloading="is_loading"></transfer-chart-stat>

    <div class="navbar">
      <router-link class="back" :to="{name: user_id? 'ss-user-detail' : 'ss-profile'}">
        <i class="fa fa-angle-left fa-lg"></i>
      </router-link>
    </div>

    <div class="weui-panel">
      <transfer-stat :isloading="is_loading" :stat="stat"></transfer-stat>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'
import TransferStat from '../../components/Transfer/Stat'
import TransferChartStat from '../../components/Transfer/Chart/Stat'

export default {
  props: ['profile'],
  components: {
    TransferStat,
    TransferChartStat
  },

  data () {
    return {
      user_id: null,
      stat: [],
      is_loading: false
    }
  },

  created () {
    this.user_id = this.$route.params.user_id
    this.fetch()
  },

  methods: {
    fetch () {
      this.is_loading = true
      let query = this.user_id ? {user_id: this.user_id} : {}
      Api('/api/ss/transfer/stat', {query}).then((res) => {
        this.is_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.stat = res.data
      })
    }
  }
}
</script>

<style scoped>
.detail {
  position: relative;
}
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.navbar .back {
  position: absolute;
  top: 15px;
  color: #fff;
  left: 15px;
}
.weui-panel {
  margin-top: 0;
}
</style>
