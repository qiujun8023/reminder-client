<template>
  <div>
    <div class="weui-cells__title">生日信息</div>
    <div class="weui-cells weui-cells_form weui-panel__bd">
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">姓名</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="text" placeholder="请输入姓名" v-model="title">
        </div>
        <div class="weui-cell__ft" v-if="is_loading">
          <i class="weui-loading"></i>
        </div>
      </div>
      <div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
          <label class="weui-label">类型</label>
        </div>
        <div class="weui-cell__bd">
          <select class="weui-select" v-model="type">
            <option value="SOLAR">公历</option>
            <option value="LUNAR">农历</option>
          </select>
        </div>
      </div>
      <div class="weui-cell" :class="{'weui-cell_warn': is_year_error}">
        <div class="weui-cell__hd">
          <label class="weui-label">年份</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="number" placeholder="请输入年份" v-model="year">
        </div>
        <div class="weui-cell__ft" v-if="is_year_error">
          <i class="weui-icon-warn"></i>
        </div>
      </div>
      <div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
          <label class="weui-label">月份</label>
        </div>
        <div class="weui-cell__bd">
          <select class="weui-select" v-model="month">
            <option :value="index + 1" v-for="(item, index) in months">{{item}}月</option>
          </select>
        </div>
      </div>
      <div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
          <label class="weui-label">日期</label>
        </div>
        <div class="weui-cell__bd">
          <select class="weui-select" v-model="day">
            <option :value="index + 1" v-for="(item, index) in days">{{item}}</option>
          </select>
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
        <div class="weui-flex__item" v-if="birth_id">
          <div class="weui-btn weui-btn_warn" :class="{'weui-btn_loading': is_submit || is_remove}" @click="remove()">
            <span v-if="is_remove">
              <i class="weui-loading"></i> 删除中
            </span>
            <span v-else>删除</span>
          </div>
        </div>
        <div class="weui-flex__item" v-else>
          <router-link :to="{name: 'birthday-births'}" class="weui-btn weui-btn_default" :class="{'weui-btn_loading': is_submit}">返回</router-link>
        </div>
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
      birth_id: null,
      title: '',
      type: '',
      year: 1990,
      months: [],
      month: 1,
      days: [],
      day: 1,
      is_loading: false,
      is_submit: false,
      is_remove: false
    }
  },

  computed: {
    is_year_error () {
      return this.year && (isNaN(this.year) || this.year > 2100 || this.year < 1900)
    },
    is_valid () {
      return this.title && this.type && this.year && !this.is_year_error && this.month && this.day
    }
  },

  created () {
    this.type = 'LUNAR'
    this.birth_id = Number(this.$route.params.birth_id || 0) || null
    if (this.birth_id) {
      this.fetch()
    }
  },

  watch: {
    type: function (val) {
      if (val === 'LUNAR') {
        this.months = '正二三四五六七八九十冬腊'
        this.days = [
          '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
          '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
          '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
        ]
      } else {
        this.months = _.range(1, 12)
        this.days = _.map(_.range(1, 31), (item) => item + '日')
      }
    }
  },

  methods: {
    format (number, length) {
      let prefix = _.repeat('0', length)
      return (prefix + number).slice(-length)
    },

    fetch () {
      this.is_loading = true
      let birth_id = this.birth_id
      Api('/api/birthday/births/detail', {query: {birth_id}}).then((res) => {
        this.is_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.title = res.data.title
        this.type = res.data.type
        let date = res.data.date.split('-')
        this.year = Number(date[0])
        this.month = Number(date[1])
        this.day = Number(date[2])
      })
    },

    submit () {
      if (!this.is_valid || this.is_submit || this.is_remove) {
        return false
      }
      this.is_submit = true

      let method = 'POST'
      let body = {
        title: this.title,
        type: this.type,
        date: `${this.year}-${this.format(this.month, 2)}-${this.format(this.day, 2)}`
      }
      if (this.birth_id) {
        method = 'PUT'
        body.birth_id = this.birth_id
      }

      Api('/api/birthday/births', {method, body}).then((res) => {
        this.is_submit = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.$router.push({name: 'birthday-birth-detail', params: {birth_id: res.data.birth_id}})
      })
    },

    remove () {
      if (this.is_submit || this.is_remove) {
        return false
      }
      if (!confirm('你确定要删除当前生日信息吗?')) {
        return false
      }
      this.is_remove = true
      let birth_id = this.birth_id
      Api('/api/birthday/births', {
        method: 'DELETE',
        query: {birth_id}
      }).then((res) => {
        this.is_remove = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.$router.push({name: 'birthday-births'})
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
