<template>
  <div class="births">
    <filter-bar v-model="filter"></filter-bar>
    <div class="weui-loadmore" v-if="loading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">加载中...</span>
    </div>
    <div class="weui-loadmore weui-loadmore_line"
      v-else-if="!filteredItems || !filteredItems.length">
      <span class="weui-loadmore__tips">暂无数据</span>
    </div>
    <div class="weui-panel weui-panel_access" v-else>
      <div class="weui-panel__bd">
        <router-link
          class="weui-media-box weui-media-box_appmsg"
          :to="{
            name: 'detail',
            params: {birthId: item.birthId},
            query: {bgColor: item.bgColor}
          }"
          :key="item.birthId"
          v-for="item in filteredItems">
          <div class="weui-media-box__hd"
            :style="{'background-color': item.bgColor}">
            <span>{{item.lastWord}}</span>
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
              <li class="weui-media-box__info__meta" v-if="item.type === 'SOLAR'">
                {{`${item.month}月${item.day}日`}}
              </li>
              <li class="weui-media-box__info__meta" v-if="item.type === 'LUNAR'">
                {{`${item.month}${item.day}`}}
              </li>
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
import Api from '../api'
import {randDiffColor} from '../lib/utils'
import FilterBar from '../components/FilterBar'

export default {
  data () {
    return {
      filter: '',
      loading: false,
      items: []
    }
  },

  components: {
    FilterBar
  },

  created () {
    this.fetch()
  },

  methods: {
    fetch () {
      this.loading = true
      Api('/api/births').then(({data}) => {
        this.loading = false
        let lastColor
        data.map((item) => {
          lastColor = randDiffColor(lastColor)
          item.bgColor = lastColor
          item.lastWord = item.title.slice(-1)
        })
        this.items = data
      }).catch(() => {
        this.loading = false
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
