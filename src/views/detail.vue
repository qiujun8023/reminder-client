<template>
  <div>
    <div class="head" :style="{background: `url(${bgImg}) center`}">
      <div class="navbar">
        <router-link class="back" :to="{name: 'births'}">
          <i class="fa fa-angle-left fa-lg"></i>
        </router-link>
        <router-link class="edit" :to="{name: 'birth-edit'}">
          <i class="fa fa-edit fa-lg"></i>
        </router-link>
      </div>
      <div class="avatar" :style="{'background-color': bgColor}">
        <i class="weui-loading" v-if="birthLoading"></i>
        <span v-else>{{(birth.title && birth.title.slice(-1)) || '日'}}</span>
      </div>
      <div class="title">
        <i class="weui-loading" v-if="birthLoading"></i>
        <span v-else>{{birth.title || 生日}}</span>
      </div>
      <div class="date">
        <i class="weui-loading" v-if="birthLoading"></i>
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
          <i class="weui-loading" v-if="birthLoading"></i>
          <span v-else>{{(birth.age || 0) + '岁'}}</span>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>生肖</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birthLoading"></i>
          <span v-else>{{birth.zodiac || '无'}}</span>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>星座</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birthLoading"></i>
          <span v-else>{{birth.constellation || '无'}}</span>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>出生天数</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birthLoading"></i>
          <span v-else>{{(birth.days || -1) + '天'}}</span>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <p>生日倒计时</p>
        </div>
        <div class="weui-cell__ft">
          <i class="weui-loading" v-if="birthLoading"></i>
          <span v-else-if="birth.countdown === 0">今天</span>
          <span v-else>{{(birth.countdown || -1) + '天'}}</span>
        </div>
      </div>
    </div>

    <div class="weui-cells__title">
      提醒设置
      <router-link :to="{name: 'birth-edit-setting'}">
        <i class="fa fa-plus fa-lg" style="float:right"></i>
      </router-link>
    </div>
    <div class="weui-loadmore" v-if="settingLoading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div class="weui-loadmore weui-loadmore_line" v-else-if="!setting || !setting.length">
      <span class="weui-loadmore__tips">暂无提醒</span>
    </div>
    <div class="weui-cells" v-else>
      <router-link
        class="weui-cell weui-cell_access"
        :to="{name: 'birth-edit-setting', params: {settingId: item.settingId}}"
        :key="item.settingId"
        v-for="item in setting">
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
import Api from '../api'

export default {
  data () {
    return {
      bgImg: null,
      bgColor: '#FB7886',
      birthId: null,
      birthLoading: false,
      birth: {},
      settingLoading: false,
      setting: {}
    }
  },

  created () {
    let imgId = Math.floor(Math.random() * 4)
    this.bgImg = `//cdn.qiujun.me/images/birthday/bg-${imgId}.jpg!shard`
    this.birthId = this.$route.params.birthId
    this.bgColor = this.$route.query.bgColor || this.bgColor
    this.fetchBirth()
    this.fetchSetting()
  },

  methods: {
    fetchBirth () {
      this.birthLoading = true
      let birthId = this.birthId
      Api('/api/births/detail', {query: {birthId}}).then(({data}) => {
        this.birthLoading = false
        this.birth = data
      }).catch(() => {
        this.birthLoading = false
      })
    },

    fetchSetting () {
      this.settingLoading = true
      let birthId = this.birthId
      Api('/api/settings', {query: {birthId}}).then(({data}) => {
        this.settingLoading = false
        this.setting = data
      }).catch(() => {
        this.settingLoading = false
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
