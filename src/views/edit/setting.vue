<template>
  <div>
    <div class="weui-cells__title">提醒信息</div>
    <div class="weui-cells weui-cells_form weui-panel__bd">
      <div class="weui-cell" :class="{'weui-cell_warn': isAdvanceError}">
        <div class="weui-cell__hd">
          <label class="weui-label">提前天数</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="number" placeholder="请输入提前天数" v-model="advance">
        </div>
        <div class="weui-cell__ft" v-if="isLoading">
          <i class="weui-loading"></i>
        </div>
        <div class="weui-cell__ft" v-if="isAdvanceError">
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
        <div class="weui-cell__ft" v-if="isLoading">
          <i class="weui-loading"></i>
        </div>
      </div>
    </div>

    <div class="weui-btn-area">
      <div class="weui-flex">
        <div class="weui-flex__item">
          <div
            class="weui-btn weui-btn_primary"
            :class="{
              'weui-btn_disabled': !isValid,
              'weui-btn_loading': isValid && (isSubmit || isRemove)
            }"
            @click="submit()">
            <span v-if="isSubmit">
              <i class="weui-loading"></i> 保存中
            </span>
            <span v-else>保存</span>
          </div>
        </div>
        <div class="weui-flex__item" v-if="settingId">
          <div
            class="weui-btn weui-btn_warn"
            :class="{'weui-btn_loading': isSubmit || isRemove}"
            @click="remove()">
            <span v-if="isRemove">
              <i class="weui-loading"></i> 删除中
            </span>
            <span v-else>删除</span>
          </div>
        </div>
        <div class="weui-flex__item" v-else>
          <router-link
            :to="{name: 'detail'}"
            class="weui-btn weui-btn_default"
            :class="{'weui-btn_loading': isSubmit}">
            返回
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api'

export default {
  data () {
    return {
      advance: null,
      time: null,
      isLoading: false,
      isSubmit: false,
      isRemove: false
    }
  },

  computed: {
    birthId () {
      return this.$route.params.birthId
    },
    settingId () {
      return this.$route.params.settingId
    },
    isAdvanceError () {
      return this.advance && (isNaN(this.advance) || this.advance > 365 || this.advance < 0)
    },
    isValid () {
      if (this.advance !== 0 && !this.advance) {
        return false
      }
      return !this.isAdvanceError && this.time
    }
  },

  created () {
    if (this.settingId) {
      this.fetch()
    }
  },

  methods: {
    fetch () {
      this.isLoading = true
      Api(`/api/settings/${this.settingId}`).then(({ data }) => {
        this.isLoading = false
        this.advance = data.advance
        this.time = data.time
      }).catch(() => {
        this.isLoading = false
      })
    },

    submit () {
      if (!this.isValid || this.isSubmit || this.isRemove) {
        return false
      }
      this.isSubmit = true

      let url = '/api/settings'
      let method = 'POST'
      if (this.settingId) {
        url = `/api/settings/${this.settingId}`
        method = 'PUT'
      }

      Api(url, {
        method,
        body: {
          birthId: Number(this.birthId),
          advance: Number(this.advance),
          time: this.time
        }
      }).then(() => {
        this.isSubmit = false
        this.$router.push({ name: 'detail' })
      }).catch(() => {
        this.isSubmit = false
      })
    },

    remove () {
      if (this.isSubmit || this.isRemove) {
        return false
      } else if (!confirm('你确定要删除当前提醒信息吗?')) {
        return false
      }

      this.isRemove = true
      Api(`/api/settings/${this.settingId}`, {
        method: 'DELETE'
      }).then(() => {
        this.isRemove = false
        this.$router.push({ name: 'detail' })
      }).catch(() => {
        this.isRemove = false
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
