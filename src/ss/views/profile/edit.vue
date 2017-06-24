<template>
  <div>
    <div class="weui-cells__title">服务信息</div>
    <div class="weui-cells weui-cells_form weui-panel__bd">
      <div class="weui-cell" :class="{'weui-cell_warn': is_port_error}">
        <div class="weui-cell__hd">
          <label class="weui-label">SS 端口</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="number" placeholder="请输入端口" v-model="port">
        </div>
        <div class="weui-cell__ft" v-if="is_loading">
          <i class="weui-loading"></i>
        </div>
        <div class="weui-cell__ft" v-if="is_port_error">
          <i class="weui-icon-warn"></i>
        </div>
      </div>
      <div class="weui-cell" :class="{'weui-cell_warn': is_password_error}">
        <div class="weui-cell__hd">
          <label class="weui-label">SS 密码</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="text" placeholder="请输入密码" v-model="password">
        </div>
        <div class="weui-cell__ft" v-if="is_loading">
          <i class="weui-loading"></i>
        </div>
        <div class="weui-cell__ft" v-if="is_password_error">
          <i class="weui-icon-warn"></i>
        </div>
      </div>
    </div>

    <div class="weui-btn-area">
      <div class="weui-flex">
        <div class="weui-flex__item">
          <div class="weui-btn weui-btn_primary" :class="{'weui-btn_disabled': !is_valid, 'weui-btn_loading': is_valid && is_submit}" @click="submit()">
            <span v-if="is_submit">
              <i class="weui-loading"></i> 保存中
            </span>
            <span v-else>保存</span>
          </div>
        </div>
        <div class="weui-flex__item">
          <div class="weui-btn weui-btn_default" :class="{'weui-btn_loading': is_submit}" @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'

export default {
  props: ['profile'],

  data () {
    return {
      port: null,
      password: null,
      is_submit: false
    }
  },

  computed: {
    is_loading () {
      return !this.profile.port && !this.profile.password
    },
    is_port_error () {
      return this.port && (isNaN(this.port) || this.port > 65535 || this.port <= 1024)
    },
    is_password_error () {
      return this.password && (this.password.length < 6 || this.password.length > 12)
    },
    is_valid () {
      return this.port && this.password && !this.is_password_error && !this.is_advance_error
    }
  },

  created () {
    this.port = this.profile.port
    this.password = this.profile.password
  },

  methods: {
    submit () {
      if (!this.is_valid || this.is_submit) {
        return false
      }
      this.is_submit = true

      let port = Number(this.port)
      let password = this.password
      Api('/api/ss/profile', {
        method: 'PUT',
        body: {port, password}
      }).then((res) => {
        this.is_submit = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.$emit('profileUpdate')
        this.$router.go(-1)
      })
    }
  },

  watch: {
    profile () {
      this.port = this.profile.port
      this.password = this.profile.password
    }
  }
}
</script>

<style scoped>
.weui-btn {
  margin: 0 5px;
}
.weui-btn:after {
  border: 0px;
}
</style>
