<template>
  <div>
    <transfer-chart-sum :user="profile"></transfer-chart-sum>

    <div class="weui-panel">
      <transfer-info :user="profile" :isloading="is_loading" :isprofile="true"></transfer-info>
      <service-info :title="'服务信息'" :user="profile" :isloading="is_loading"></service-info>

      <div class="weui-panel__hd">个人信息</div>
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_small-appmsg">
          <div class="weui-cells">
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>姓名</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="!profile.name"></i>
                <span v-else>{{profile.name}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>用户 ID</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="!profile.user_id"></i>
                <span v-else>{{profile.user_id}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>最后在线</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="!profile.active_at"></i>
                <span v-else>{{profile.active_at}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>加入时间</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="!profile.regist_at"></i>
                <span v-else>{{profile.regist_at}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TransferChartSum from '../../components/Transfer/Chart/Sum'
import TransferInfo from '../../components/Transfer/Info'
import ServiceInfo from '../../components/Service/Info'

export default {
  props: ['profile'],
  components: {
    TransferChartSum,
    TransferInfo,
    ServiceInfo
  },
  computed: {
    is_loading () {
      return !this.profile.port && !this.profile.password
    }
  }
}
</script>

<style scoped>
.weui-panel {
  margin-top: 0;
}
</style>
