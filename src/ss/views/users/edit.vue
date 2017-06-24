<template>
  <div>
    <div class="weui-loadmore" v-show="is_loading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div v-show="!is_loading">
      <div class="weui-cells__title">服务信息</div>
      <div class="weui-cells weui-cells_form weui-panel__bd">
        <div class="weui-cell" :class="{'weui-cell_warn': is_port_error}">
          <div class="weui-cell__hd">
            <label class="weui-label">SS 端口</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="number" placeholder="请输入 SS 端口" v-model="port">
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
            <input class="weui-input" type="text" placeholder="请输入 SS 密码" v-model="password">
          </div>
          <div class="weui-cell__ft" v-if="is_password_error">
            <i class="weui-icon-warn"></i>
          </div>
        </div>
        <div class="weui-cell" :class="{'weui-cell_warn': is_transfer_error}">
          <div class="weui-cell__hd">
            <label class="weui-label">流量上限</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="number" placeholder="请输入流量上限" v-model="transfer_enable">
          </div>
          <div class="weui-cell__ft" v-if="is_transfer_error">
            <i class="weui-icon-warn"></i>
          </div>
          <div class="weui-cell__ft" v-else>GB</div>
        </div>
      </div>

      <div class="weui-cells__title">用户信息</div>
      <div class="weui-cells weui-cells_form weui-panel__bd">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">用户姓名</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入姓名" v-model="name">
          </div>
        </div>
        <div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label class="weui-label">用户角色</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select" v-model="is_admin">
              <option value="N">用户</option>
              <option value="Y">管理员</option>
            </select>
          </div>
        </div>
        <div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label class="weui-label">用户状态</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select" v-model="is_locked">
              <option value="N">正常</option>
              <option value="Y">锁定</option>
            </select>
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
            <router-link :to="{name: 'ss-user-detail'}" class="weui-btn weui-btn_default" :class="{'weui-btn_loading': is_submit}">返回</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'
import {formatTransfer, formatBoolean} from '../../libs/utils'

export default {
  data () {
    return {
      user_id: null,
      port: null,
      password: null,
      transfer_enable: null,
      name: null,
      is_admin: null,
      is_locked: null,
      is_loading: false,
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
    is_transfer_error () {
      return this.transfer_enable && isNaN(this.transfer_enable)
    },
    is_valid () {
      return this.port && !this.is_password_error &&
             this.password && !this.is_advance_error &&
             this.transfer_enable && !this.is_transfer_error &&
             this.name && this.is_admin && this.is_locked
    }
  },

  created () {
    this.user_id = this.$route.params.user_id
    this.fetch()
  },

  methods: {
    fetch () {
      this.is_loading = true
      let user_id = this.user_id
      Api('/api/ss/users/detail', {query: {user_id}}).then((res) => {
        this.is_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.port = res.data.port
        this.password = res.data.password
        this.transfer_enable = formatTransfer(res.data.transfer_enable, true)
        this.name = res.data.name
        this.is_admin = formatBoolean(res.data.is_admin, true)
        this.is_locked = formatBoolean(res.data.is_locked, true)
      })
    },

    submit () {
      if (!this.is_valid || this.is_submit) {
        return false
      }
      this.is_submit = true

      let body = {
        user_id: this.user_id,
        port: Number(this.port),
        password: this.password,
        transfer_enable: formatTransfer(this.transfer_enable),
        name: this.name,
        is_admin: formatBoolean(this.is_admin),
        is_locked: formatBoolean(this.is_locked)
      }
      Api('/api/ss/users', {method: 'PUT', body}).then((res) => {
        this.is_submit = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.$router.push({name: 'ss-user-detail'})
      })
    }
  }
}
</script>

<style scoped>
.weui-cell .weui-cell__ft {
  font-size: 1em;
}
.weui-btn {
  margin: 0 5px;
}
.weui-btn:after {
  border: 0px;
}
</style>
