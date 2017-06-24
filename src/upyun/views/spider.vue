<template>
  <div class="weui-tab">
    <div class="weui-navbar">
      <div class="weui-navbar__item"
        :class="{'weui-bar__item_on': tab_active === 'list'}"
        @click="tab_active = 'list'">
        任务列表
      </div>
      <div class="weui-navbar__item"
        :class="{'weui-bar__item_on': tab_active === 'add'}"
        @click="tab_active = 'add'">
        添加任务
      </div>
    </div>
    <div class="weui-tab__panel">
      <div v-show="tab_active === 'list'">
        <div class="weui-panel">
          <div class="weui-panel__hd">最近任务</div>
          <template v-if="!spiders || !spiders.length">
            <div class="weui-loadmore" v-if="is_loading">
              <i class="weui-loading"></i>
              <span class="weui-loadmore__tips">加载中...</span>
            </div>
            <div class="weui-loadmore weui-loadmore_line" v-else>
              <span class="weui-loadmore__tips">暂无任务</span>
            </div>
          </template>
          <div class="weui-panel__bd" v-else>
            <div class="weui-media-box weui-media-box_small-appmsg">
              <div class="weui-cells">
                <template v-for="spider in spiders">
                  <div class="weui-cell" v-if="spider.status !== 'COMPLETE'">
                    <div class="weui-cell__hd">
                      <i class="fa fa-clock-o" v-if="spider.status === 'ADDED'"></i>
                      <i class="fa fa-download" v-else-if="spider.status === 'DOWNLOADING'"></i>
                      <i class="fa fa-close" v-else-if="spider.status === 'FAILURE'"></i>
                    </div>
                    <div class="weui-cell__bd weui-cell_primary">
                      <p>{{spider.save_name}}</p>
                    </div>
                    <div class="weui-cell__ft">{{spider.updated_at}}</div>
                  </div>
                  <a class="weui-cell weui-cell_access" :href="spider.save_url" v-else download>
                    <div class="weui-cell__hd">
                      <i class="fa fa-check"></i>
                    </div>
                    <div class="weui-cell__bd weui-cell_primary">
                      <p>{{spider.save_name}}</p>
                    </div>
                    <span class="weui-cell__ft">{{spider.updated_at}}</span>
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="weui-btn-area">
          <div class="weui-flex">
            <div class="weui-flex__item">
              <div class="weui-btn weui-btn_default" :class="{'weui-btn_loading': is_adding}" @click="back()">返回</div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="tab_active === 'add'">
        <div class="weui-panel">
          <div class="weui-panel__hd">任务详情</div>
          <div class="weui-panel__bd">
            <div class="weui-media-box weui-media-box_small-appmsg">
              <div class="weui-cells">
                <div class="weui-cell" :class="{'weui-cell_warn': is_request_url_error}">
                  <div class="weui-cell__hd">
                    <label class="weui-label">下载地址</label>
                  </div>
                  <div class="weui-cell__bd">
                    <input class="weui-input" type="text" placeholder="仅支持 http 与 https" v-model="request_url">
                  </div>
                  <div class="weui-cell__ft" v-if="is_request_url_error">
                    <i class="weui-icon-warn"></i>
                  </div>
                </div>
                <div class="weui-cell" :class="{'weui-cell_warn': is_save_name_error}">
                  <div class="weui-cell__hd">
                    <label class="weui-label">保存文件名</label>
                  </div>
                  <div class="weui-cell__bd">
                    <input class="weui-input" type="text" placeholder="文件名称" v-model="save_name">
                  </div>
                  <div class="weui-cell__ft" v-if="is_save_name_error">
                    <i class="weui-icon-warn"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="weui-btn-area">
          <div class="weui-flex">
            <div class="weui-flex__item">
              <div class="weui-btn weui-btn_primary" :class="{'weui-btn_disabled': !can_add, 'weui-btn_loading': is_adding}" @click="addSpider()">
                <span v-if="is_adding">
                  <i class="weui-loading"></i> 添加中
                </span>
                <span v-else>添加</span>
              </div>
            </div>
            <div class="weui-flex__item">
              <div class="weui-btn weui-btn_default" :class="{'weui-btn_loading': is_adding}" @click="back()">返回</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../common/api'

export default {
  data () {
    return {
      tab_active: 'list',
      is_loading: false,
      is_adding: false,
      request_url: '',
      save_name: '',
      spiders: [],
      timer: null
    }
  },

  computed: {
    path () {
      return this.$route.query.path
    },
    is_request_url_error () {
      if (!this.request_url) {
        return false
      } else if (this.request_url.startsWith('http://')) {
        return false
      } else if (this.request_url.startsWith('https://')) {
        return false
      }
      return true
    },
    is_save_name_error () {
      let invalid_name = /[/\\<>*?|"]+/
      return this.save_name && invalid_name.test(this.save_name)
    },
    can_add () {
      return this.save_name && !this.is_save_name_error &&
        this.request_url && !this.is_request_url_error
    }
  },

  created () {
    this.fetchSpiders()
  },

  destroyed () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },

  methods: {
    fetchSpiders () {
      this.is_loading = true
      Api('/api/upyun/spiders').then((res) => {
        this.timer = setTimeout(() => this.fetchSpiders(), 3000)
        this.is_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }
        this.spiders = res.data
      })
    },
    addSpider () {
      if (!this.can_add || this.is_adding) {
        return false
      }
      this.is_adding = true
      let body = {
        request_url: this.request_url,
        save_name: this.save_name
      }
      Api('/api/upyun/spiders', {body, method: 'POST'}).then((res) => {
        this.is_adding = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }
        this.spiders.unshift(res.data)
        this.request_url = this.save_name = ''
        this.tab_active = 'list'
      })
    },
    back () {
      if (this.is_uploading) {
        return false
      }
      let path = this.path
      this.$router.push({name: 'upyun-list', query: {path}})
    }
  }
}
</script>

<style scoped>
.weui-cell .weui-cell__hd .fa {
  width: 28px;
  text-align: center;
}
.weui-cell .weui-cell__hd .fa.fa-clock-o {
  color: #FFBE00;
}
.weui-cell .weui-cell__hd .fa.fa-download {
  color: #10AEFF;
}
.weui-cell .weui-cell__hd .fa.fa-close {
  color: #F76260;
}
.weui-cell .weui-cell__hd .fa.fa-check {
  color: #09BB07;
}
.weui-btn {
  margin: 0 5px;
}
.weui-btn:after {
  border: 0px;
}
</style>
