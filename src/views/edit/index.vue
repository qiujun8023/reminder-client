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
        <div class="weui-cell__ft" v-if="isLoading">
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
      <div class="weui-cell" :class="{'weui-cell_warn': isYearError}">
        <div class="weui-cell__hd">
          <label class="weui-label">年份</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="number" placeholder="请输入年份" v-model="year">
        </div>
        <div class="weui-cell__ft" v-if="isYearError">
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
          <div class="weui-btn weui-btn_primary"
            :class="{'weui-btn_disabled': !isValid, 'weui-btn_loading': isValid && (isSubmit || isRemove)}"
            @click="submit()">
            <span v-if="isSubmit">
              <i class="weui-loading"></i> 保存中
            </span>
            <span v-else>保存</span>
          </div>
        </div>
        <div class="weui-flex__item" v-if="birthId">
          <div class="weui-btn weui-btn_warn"
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
            class="weui-btn weui-btn_default"
            :to="{name: 'births'}"
            :class="{'weui-btn_loading': isSubmit}">
            返回
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Api from '../../api'

export default {
  data () {
    return {
      birthId: null,
      title: '',
      type: '',
      year: 1990,
      months: [],
      month: 1,
      days: [],
      day: 1,
      isLoading: false,
      isSubmit: false,
      isRemove: false
    }
  },

  computed: {
    isYearError () {
      return this.year && (isNaN(this.year) || this.year > 2100 || this.year < 1900)
    },
    isValid () {
      return this.title && this.type && this.year && !this.isYearError && this.month && this.day
    }
  },

  created () {
    this.type = 'LUNAR'
    this.birthId = Number(this.$route.params.birthId || 0) || null
    if (this.birthId) {
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
      this.isLoading = true
      let birthId = this.birthId
      Api('/api/births/detail', {query: {birthId}}).then(({data}) => {
        this.isLoading = false
        this.title = data.title
        this.type = data.type
        let date = data.date.split('-')
        this.year = Number(date[0])
        this.month = Number(date[1])
        this.day = Number(date[2])
      }).catch(() => {
        this.isLoading = false
      })
    },

    submit () {
      if (!this.isValid || this.isSubmit || this.isRemove) {
        return false
      }
      this.isSubmit = true

      let method = 'POST'
      let body = {
        title: this.title,
        type: this.type,
        date: `${this.year}-${this.format(this.month, 2)}-${this.format(this.day, 2)}`
      }
      if (this.birthId) {
        method = 'PUT'
        body.birthId = this.birthId
      }

      Api('/api/births', {method, body}).then(({data}) => {
        this.isSubmit = false
        console.log(data)
        this.$router.push({name: 'birth-detail', params: {birthId: data.birthId}})
      }).catch(() => {
        this.isSubmit = false
      })
    },

    remove () {
      if (this.isSubmit || this.isRemove) {
        return false
      } else if (!confirm('你确定要删除当前生日信息吗?')) {
        return false
      }

      this.isRemove = true
      let birthId = this.birthId
      Api('/api/births', {method: 'DELETE', query: {birthId}}).then((res) => {
        this.isRemove = false
        this.$router.push({name: 'births'})
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
