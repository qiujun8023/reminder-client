<template>
  <div>
    <div class="weui-loadmore" v-show="is_loading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div v-show="!is_loading">
      <div class="weui-cells__title">节点信息</div>
      <div class="weui-cells weui-cells_form weui-panel__bd">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">节点名称</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入节点名称" v-model="name">
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">节点图标</label>
          </div>
          <div class="weui-cell__bd">
            <textarea class="weui-textarea" placeholder="请输入图标地址" rows="3" v-model="avatar"></textarea>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">节点描述</label>
          </div>
          <div class="weui-cell__bd">
            <textarea class="weui-textarea" placeholder="请输入节点描述" rows="3" v-model="description"></textarea>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">连接地址</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入服务器地址" v-model="server">
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">加密方式</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入 SS 加密方式" v-model="method">
          </div>
        </div>
        <div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label class="weui-label">是否可见</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select" v-model="is_visible">
              <option value="Y">可见</option>
              <option value="N">隐藏</option>
            </select>
          </div>
        </div>
        <div class="weui-cell" :class="{'weui-cell_warn': is_sort_error}">
          <div class="weui-cell__hd">
            <label class="weui-label">节点排序</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="number" placeholder="请输入排序 ID" v-model="sort">
          </div>
          <div class="weui-cell__ft" v-if="is_sort_error">
            <i class="weui-icon-warn"></i>
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
        <div class="weui-flex__item" v-if="node_id">
          <div class="weui-btn weui-btn_warn" :class="{'weui-btn_loading': is_submit || is_remove}" @click="remove()">
            <span v-if="is_remove">
              <i class="weui-loading"></i> 删除中
            </span>
            <span v-else>删除</span>
          </div>
        </div>
        <div class="weui-flex__item" v-else>
          <router-link :to="{name: 'ss-nodes'}" class="weui-btn weui-btn_default" :class="{'weui-btn_loading': is_submit}">返回</router-link>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'
import {formatBoolean} from '../../libs/utils'

export default {
  data () {
    return {
      node_id: null,
      name: null,
      avatar: null,
      description: null,
      server: null,
      method: null,
      is_visible: 'Y',
      sort: 1,
      is_loading: false,
      is_submit: false,
      is_remove: false
    }
  },

  computed: {
    is_sort_error () {
      return this.sort && (isNaN(this.sort) || this.sort <= 0)
    },
    is_valid () {
      return this.name && this.avatar && this.description && this.server &&
             this.method && this.is_visible && this.sort && !this.is_sort_error
    }
  },

  created () {
    this.node_id = this.$route.params.node_id
    if (this.node_id) {
      this.fetch()
    }
  },

  methods: {
    fetch () {
      this.is_loading = true
      let node_id = this.node_id
      Api('/api/ss/nodes/detail', {query: {node_id}}).then((res) => {
        this.is_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.name = res.data.name
        this.avatar = res.data.avatar
        this.description = res.data.description
        this.server = res.data.server
        this.method = res.data.method
        this.is_visible = formatBoolean(res.data.is_visible, true)
        this.sort = res.data.sort
      })
    },

    submit () {
      if (!this.is_valid || this.is_submit || this.is_remove) {
        return false
      }
      this.is_submit = true

      let method = 'POST'
      let body = {
        name: this.name,
        avatar: this.avatar,
        description: this.description,
        server: this.server,
        method: this.method,
        is_visible: formatBoolean(this.is_visible),
        sort: this.sort
      }
      if (this.node_id) {
        method = 'PUT'
        body.node_id = this.node_id
      }

      Api('/api/ss/nodes', {method, body}).then((res) => {
        this.is_submit = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.$router.push({name: 'ss-node-detail', params: {node_id: res.data.node_id}})
      })
    },

    remove () {
      if (this.is_submit || this.is_remove) {
        return false
      }
      if (!confirm('你确定要删除当前节点吗?')) {
        return false
      }
      this.is_remove = true
      let node_id = this.node_id
      Api('/api/ss/nodes', {
        method: 'DELETE',
        query: {node_id}
      }).then((res) => {
        this.is_remove = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.$router.push({name: 'ss-nodes'})
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
