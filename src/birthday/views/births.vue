<template>
  <div class="births">
    <div class="weui-search-bar" :class="{'weui-search-bar_focusing': focusing || !!filter}">
      <form class="weui-search-bar__form" @submit="submit">
        <div class="weui-search-bar__box">
          <i class="weui-icon-search"></i>
          <input type="search" class="weui-search-bar__input" placeholder="搜索" required ref="input" v-model="filter" @blur="focusing = false" />
          <a href="javascript:" class="weui-icon-clear" @click="clearInput"></a>
        </div>
        <label for="search_input" class="weui-search-bar__label" @click="focusInput()">
          <i class="weui-icon-search"></i>
          <span>搜索</span>
        </label>
      </form>
      <router-link :to="{name: 'birthday-birth-add'}" class="weui-search-bar__cancel-btn">
        <i class="fa fa-plus fa-lg"></i>
      </router-link>
    </div>
    <div class="weui-loadmore" v-if="loading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">加载中...</span>
    </div>
    <div class="weui-loadmore weui-loadmore_line" v-else-if="!filteredItems || !filteredItems.length">
      <span class="weui-loadmore__tips">暂无数据</span>
    </div>
    <div class="weui-panel weui-panel_access" v-else>
      <div class="weui-panel__bd">
        <router-link :to="{name: 'birthday-birth-detail', params: {birth_id: item.birth_id}, query: {bg_color: item.bg_color}}"
          class="weui-media-box weui-media-box_appmsg" v-for="item in filteredItems" :key="item.birth_id">
          <div class="weui-media-box__hd" :style="{'background-color': item.bg_color}">
            <span>{{item.last_word}}</span>
          </div>
          <div class="weui-media-box__bd">
            <h4 class="weui-media-box__title">
              <span>{{item.title}}</span>
              <span class="countdown">
                <span v-if="item.countdown">{{item.countdown}}</span>
                <span v-else>今</span>
                <span>天</span>
              </span>
            </h4>
            <ul class="weui-media-box__info">
              <li class="weui-media-box__info__meta" v-if="item.type === 'SOLAR'">{{`${item.month}月${item.day}日`}}</li>
              <li class="weui-media-box__info__meta" v-if="item.type === 'LUNAR'">{{`${item.month}${item.day}`}}</li>
              <li class="weui-media-box__info__meta">{{item.zodiac}}</li>
              <li class="weui-media-box__info__meta">{{item.constellation}}</li>
              <li class="weui-media-box__info__meta">
                <span v-if="item.countdown === 0">{{item.age}} 岁</span>
                <span v-else>后 {{item.age + 1}} 岁</span>
              </li>
            </ul>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Api from '../libs/api'

export default {
  data () {
    return {
      filter: '',
      loading: false,
      focusing: false,
      items: [],
      colors: [
        '#fdbe53',
        '#b590d2',
        '#da767c',
        '#f88c96',
        '#fed486',
        '#fe966e',
        '#fb7886',
        '#61b8fa'
      ]
    }
  },

  created () {
    this.fetch()
  },

  methods: {
    clearInput () {
      this.filter = ''
      this.focusInput()
    },

    focusInput () {
      this.focusing = true
      this.$refs.input.focus()
    },

    submit (event) {
      event.preventDefault()
    },

    fetch () {
      this.loading = true
      Api('/api/birthday/births').then((res) => {
        this.loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        // 取随机颜色，并保证相邻两个颜色不同
        for (let i = 0; i < res.data.length; i++) {
          let bg_color = _.sample(this.colors)
          if (i === 0 || bg_color !== res.data[i - 1].bg_color) {
            let item = res.data[i]
            item.bg_color = bg_color
            item.last_word = item.title.slice(-1)
          } else {
            i--
          }
        }
        this.items = res.data
      })
    }
  },

  computed: {
    filteredItems: function () {
      if (!this.filter || !this.items) {
        return this.items
      }

      let exp = new RegExp(this.filter)
      return this.items.filter(function (item) {
        return item.title.match(exp) ||
               item.constellation.match(exp) ||
               item.zodiac.match(exp) ||
               item.date.match(exp)
      })
    }
  }
}
</script>

<style scoped>
.births {
  padding-top: 44px;
}
.weui-search-bar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99999;
}
.weui-search-bar__cancel-btn {
  display: block !important;
  color: #7acb7c;
}
.weui-panel.weui-panel_access {
  margin-top: 0;
}
.weui-media-box__hd {
  color: #fff;
  border-radius: 50%
}
.weui-media-box__hd span {
  font-size: 1.4em;
  font-weight: 300;
}
.weui-media-box__title {
  font-size: 1.1em;
}
.weui-media-box__title .countdown {
  float: right;
  color: #fb7886;
}
.weui-media-box__title .countdown span:last-child {
  font-size: 0.6em;
}
.weui-media-box__info {
  margin-top: 10px;
}
.weui-media-box__info .weui-media-box__info__meta:last-child {
  float: right;
  padding-right: 0;
}
</style>
