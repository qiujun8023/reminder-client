<template>
  <div class="weui-tab">
    <div class="weui-tab__panel" :style="{'padding-bottom': tabber_show? '50px':'0'}">
      <router-view :profile="profile" @profileUpdate="fetchProfile()"></router-view>
    </div>
    <div class="weui-tabbar" v-show="tabber_show">
      <router-link :to="{name: 'ss-services'}" class="weui-tabbar__item" :class="tabber_class[0]">
        <i class="fa fa-paper-plane weui-tabbar__icon"></i>
        <p class="weui-tabbar__label">服务</p>
      </router-link>
      <router-link :to="{name: 'ss-profile'}" class="weui-tabbar__item" :class="tabber_class[1]">
        <i class="fa fa-user weui-tabbar__icon"></i>
        <p class="weui-tabbar__label">我</p>
      </router-link>
      <router-link :to="{name: 'ss-offer'}" class="weui-tabbar__item" :class="tabber_class[2]" v-if="!profile.is_admin">
        <i class="fa fa-heart weui-tabbar__icon"></i>
        <p class="weui-tabbar__label">捐助</p>
      </router-link>
      <router-link :to="{name: 'ss-users'}" class="weui-tabbar__item" :class="tabber_class[3]" v-if="profile.is_admin">
        <i class="fa fa-users weui-tabbar__icon"></i>
        <p class="weui-tabbar__label">用户</p>
      </router-link>
      <router-link :to="{name: 'ss-nodes'}" class="weui-tabbar__item" :class="tabber_class[4]" v-if="profile.is_admin">
        <i class="fa fa-sitemap weui-tabbar__icon"></i>
        <p class="weui-tabbar__label">节点</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import Api from './libs/api'

export default {
  data () {
    return {
      profile: {},
      tabber_show: false,
      tabber_class: []
    }
  },

  created () {
    this.updateTabber()
    this.fetchProfile()
  },

  methods: {
    fetchProfile () {
      Api('/api/ss/profile').then((res) => {
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.profile = res.data
      })
    },
    updateTabber () {
      let now = this.$route.name
      let tabbers = ['ss-services', 'ss-profile', 'ss-offer', 'ss-users', 'ss-nodes']

      if (tabbers.indexOf(now) === -1) {
        this.tabber_show = false
        return
      }

      this.tabber_show = true
      for (let i = 0; i < tabbers.length; i++) {
        if (now === tabbers[i]) {
          this.tabber_class[i] = ['weui-bar__item_on']
        } else {
          this.tabber_class[i] = []
        }
      }
    }
  },

  watch: {
    $route () {
      this.updateTabber()
    }
  }
}
</script>

<style scoped>
.weui-tab {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
}
</style>
