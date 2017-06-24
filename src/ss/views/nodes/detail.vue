<template>
  <div class="detail">
    <transfer-chart-stat :data="stat" :isloading="is_stat_loading"></transfer-chart-stat>

    <div class="navbar">
      <router-link class="back" :to="{name: 'ss-nodes'}">
        <i class="fa fa-angle-left fa-lg"></i>
      </router-link>
      <router-link class="edit" :to="{name: 'ss-node-edit'}">
        <i class="fa fa-edit fa-lg"></i>
      </router-link>
    </div>

    <div class="weui-panel">
      <div class="weui-panel__hd">节点信息</div>
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_small-appmsg">
          <div class="weui-cells">
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>节点ID</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="is_node_loading"></i>
                <span v-else>{{node.node_id}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>节点名称</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="is_node_loading"></i>
                <span v-else>{{node.name}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>节点地址</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="is_node_loading"></i>
                <span v-else>{{node.server}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>加密方式</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="is_node_loading"></i>
                <span v-else>{{node.method}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>节点描述</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="is_node_loading"></i>
                <span v-else>{{node.description}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>更新时间</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="is_node_loading"></i>
                <span v-else>{{node.updated_at}}</span>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <p>创建时间</p>
              </div>
              <div class="weui-cell__ft">
                <i class="weui-loading" v-if="is_node_loading"></i>
                <span v-else>{{node.created_at}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <node-users :isloading="is_users_loading" :users="users"></node-users>
      <transfer-stat :isloading="is_stat_loading" :stat="stat"></transfer-stat>
    </div>
  </div>
</template>

<script>
import Api from '../../libs/api'
import NodeUsers from '../../components/Node/Users'
import TransferStat from '../../components/Transfer/Stat'
import TransferChartStat from '../../components/Transfer/Chart/Stat'

export default {
  props: ['profile'],
  components: {
    NodeUsers,
    TransferStat,
    TransferChartStat
  },

  data () {
    return {
      node_id: null,
      node: {},
      users: [],
      stat: [],
      is_node_loading: false,
      is_stat_loading: false,
      is_users_loading: false
    }
  },

  created () {
    this.node_id = this.$route.params.node_id
    this.fetchNode()
    this.fetchStat()
    this.fetchUsers()
  },

  methods: {
    fetchNode () {
      this.is_node_loading = true
      let node_id = this.node_id
      Api('/api/ss/nodes/detail', {query: {node_id}}).then((res) => {
        this.is_node_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.node = res.data
      })
    },
    fetchStat () {
      this.is_stat_loading = true
      let node_id = this.node_id
      Api('/api/ss/transfer/stat', {query: {node_id}}).then((res) => {
        this.is_stat_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.stat = res.data
      })
    },
    fetchUsers () {
      this.is_users_loading = true
      let node_id = this.node_id
      Api('/api/ss/nodes/users', {query: {node_id}}).then((res) => {
        this.is_users_loading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }

        this.users = res.data
      })
    }
  }
}
</script>

<style scoped>
.detail {
  position: relative;
}
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.navbar .back,
.navbar .edit {
  position: absolute;
  top: 15px;
  color: #fff;
}
.navbar .back {
  left: 15px;
}
.navbar .edit {
  right: 15px;
}
.weui-panel {
  margin-top: 0;
}
</style>
