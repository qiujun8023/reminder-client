<template>
  <div>
    <div class="head" :style="{background: `url(${bg_img}) center`}">
      <div class="navbar">
        <router-link class="back" :to="{name: 'birthday-births'}">
          <i class="fa fa-angle-left fa-lg"></i>
        </router-link>
        <router-link class="edit" :to="{name: 'birthday-birth-edit'}">
          <i class="fa fa-edit fa-lg"></i>
        </router-link>
      </div>
      <div class="avatar" :style="{'background-color': bg_color}">
        <i class="weui-loading" v-if="birth_loading"></i>
        <span v-else>{{(birth.title && birth.title.slice(-1)) || '日'}}</span>
      </div>
      <div class="title">
        <i class="weui-loading" v-if="birth_loading"></i>
        <span v-else>{{birth.title || 生日}}</span>
      </div>
      <div class="date">
        <i class="weui-loading" v-if="birth_loading"></i>
        <span v-else-if="birth.type === 'SOLAR'">
          {{`${birth.year}年 ${birth.month}月${birth.day}日`}}
        </span>
        <span v-else-if="birth.type === 'LUNAR'">
          {{`${birth.year}年 ${birth.month}${birth.day}`}}
        </span>
        <span v-else>未知出生日期</span>
      </div>
    </div>
    <div class="weui-cells detail">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>年龄</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birth_loading"></i>
          <span v-else>{{(birth.age || 0) + '岁'}}</span>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>生肖</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birth_loading"></i>
          <span v-else>{{birth.zodiac || '无'}}</span>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>星座</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birth_loading"></i>
          <span v-else>{{birth.constellation || '无'}}</span>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>出生天数</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birth_loading"></i>
          <span v-else>{{(birth.days || -1) + '天'}}</span>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>生日倒计时</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birth_loading"></i>
          <span v-else-if="birth.countdown === 0">今天</span>
          <span v-else>{{(birth.countdown || -1) + '天'}}</span>
        </div>
      </div>
    </div>

    <div class="weui-cells__title">
      提醒设置
      <router-link :to="{name: 'birthday-birth-edit-setting'}">
        <i class="fa fa-plus fa-lg" style="float:right"></i>
      </router-link>
    </div>
    <div class="weui-loadmore" v-if="setting_loading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div class="weui-loadmore weui-loadmore_line" v-else-if="!setting || !setting.length">
      <span class="weui-loadmore__tips">暂无提醒</span>
    </div>
    <div class="weui-cells" v-else>
      <router-link :to="{name: 'birthday-birth-edit-setting', params: {setting_id: item.setting_id}}" class="weui-cell weui-cell_access" v-for="item in setting" :key="item.setting_id">
        <div class="weui-cell__bd">
          <p v-if="item.advance">{{`提前${item.advance}天`}}</p>
          <p v-else>当天</p>
        </div>
        <div class="weui-cell__ft">{{item.time}}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import Api from '../libs/api'

export default {
  data () {
    return {
      bg_img: null,
      bg_color: '#FB7886',
      birth_id: null,
      birth_loading: false,
      birth: {},
      setting_loading: false,
      setting: {}
    }
  },

  created () {
    let img_id = Math.floor(Math.random() * 4)
    this.bg_img = `//cdn.qiujun.me/images/birthday/bg-${img_id}.jpg!shard`
    this.birth_id = this.$route.params.birth_id
    this.bg_color = this.$route.query.bg_color || this.bg_color
    this.fetchBirth()
    this.fetchSetting()
  },

  methods: {
    fetchBirth () {
      this.birth_loading = true
      let birth_id = this.birth_id
      Api('/api/birthday/births/detail', {query: {birth_id}}).then((res) => {
        this.birth_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.birth = res.data
      })
    },

    fetchSetting () {
      this.setting_loading = true
      let birth_id = this.birth_id
      Api('/api/birthday/settings', {query: {birth_id}}).then((res) => {
        this.setting_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.setting = res.data
      })
    }
  }
}
</script>

<style scoped>
.head {
  color: #fff;
  width: 100%;
  padding: 50px 0 30px 0;
  text-align: center;
  font-weight: 300;
  position: relative;;
}
.head .navbar .back,
.head .navbar .edit {
  position: absolute;
  top: 15px;
  color: #fff;
}
.head .navbar .back {
  left: 15px;
}
.head .navbar .edit {
  right: 15px;
}
.head .avatar {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  border-radius: 50%;
  margin: auto;
}
.head .avatar span {
  font-size: 1.4em;
}
.head .title {
  font-size: 1.3em;
  margin-top: 10px;
}
.detail.weui-cells {
  margin-top: 0;
}
.weui-cells__title i.fa {
  font-size: 1.33em;
  line-height: 1.33em;
  color: #7acb7c
}
</style>
