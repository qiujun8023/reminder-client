<template>
  <div>
    <div class="weui-cells__title">提醒信息</div>
    <div class="weui-cells weui-cells_form weui-panel__bd">
      <div class="weui-cell" :class="{'weui-cell_warn': is_advance_error}">
        <div class="weui-cell__hd">
          <label class="weui-label">提前天数</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="number" placeholder="请输入提前天数" v-model="advance">
        </div>
        <div class="weui-cell__ft" v-if="is_loading">
          <i class="weui-loading"></i>
        </div>
        <div class="weui-cell__ft" v-if="is_advance_error">
          <i class="weui-icon-warn"></i>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">提醒时间</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="time" placeholder="请输入提醒时间" v-model="time">
        </div>
        <div class="weui-cell__ft" v-if="is_loading">
          <i class="weui-loading"></i>
        </div>
      </div>
    </div>

    <div class="weui-btn-area">
      <div class="weui-flex">
        <div class="weui-flex__item">
          <div class="weui-btn weui-btn_primary" :class="{'weui-btn_disabled': !is_valid, 'weui-btn_loading': is_valid && (is_submit || is_remove)}" @click="submit()">
            <span v-if="is_submit">
              <i class="weui-loading"></i> 保存中
            </span>
            <span v-else>保存</span>
          </div>
        </div>
        <div class="weui-flex__item" v-if="setting_id">
          <div class="weui-btn weui-btn_warn" :class="{'weui-btn_loading': is_submit || is_remove}" @click="remove()">
            <span v-if="is_remove">
              <i class="weui-loading"></i> 删除中
            </span>
            <span v-else>删除</span>
          </div>
        </div>
        <div class="weui-flex__item" v-else>
          <router-link :to="{name: 'birthday-birth-detail'}" class="weui-btn weui-btn_default" :class="{'weui-btn_loading': is_submit}">返回</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'

export default {
  data () {
    return {
      birth_id: null,
      setting_id: null,
      advance: null,
      time: null,
      is_loading: false,
      is_submit: false,
      is_remove: false
    }
  },

  computed: {
    is_advance_error () {
      return this.advance && (isNaN(this.advance) || this.advance > 365 || this.advance < 0)
    },
    is_valid () {
      if (this.advance !== 0 && !this.advance) {
        return false
      }
      return !this.is_advance_error && this.time
    }
  },

  created () {
    let params = this.$route.params
    this.birth_id = Number(params.birth_id || 0) || null
    this.setting_id = Number(params.setting_id || 0) || null
    if (this.setting_id) {
      this.fetch()
    }
  },

  methods: {
    fetch () {
      this.is_loading = true
      let setting_id = this.setting_id
      Api('/api/birthday/settings/detail', {query: {setting_id}}).then((res) => {
        this.is_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.advance = res.data.advance
        this.time = res.data.time
      })
    },

    submit () {
      if (!this.is_valid || this.is_submit || this.is_remove) {
        return false
      }
      this.is_submit = true

      let method = 'POST'
      let body = {
        birth_id: this.birth_id,
        advance: this.advance,
        time: this.time
      }
      if (this.setting_id) {
        method = 'PUT'
        body.setting_id = this.setting_id
      }

      Api('/api/birthday/settings', {method, body}).then((res) => {
        this.is_submit = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.$router.push({name: 'birthday-birth-detail'})
      })
    },

    remove () {
      if (this.is_submit || this.is_remove) {
        return false
      }
      if (!confirm('你确定要删除当前提醒信息吗?')) {
        return false
      }
      this.is_remove = true
      let setting_id = this.setting_id
      Api('/api/birthday/settings', {
        method: 'DELETE',
        query: {setting_id}
      }).then((res) => {
        this.is_remove = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.$router.push({name: 'birthday-birth-detail'})
      })
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
