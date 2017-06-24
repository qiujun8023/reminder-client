<template>
  <div>
    <div class="weui-panel">
      <div class="weui-panel__hd">Path {{path}}</div>
      <div class="weui-panel__bd">
        <div class="weui-loadmore" v-if="is_loading">
          <i class="weui-loading"></i>
          <span class="weui-loadmore__tips">正在加载</span>
        </div>
        <div class="weui-media-box weui-media-box_small-appmsg" v-else>
          <div class="weui-cells">
            <template v-for="item in files">
              <router-link :to="item.url" class="weui-cell weui-cell_access" v-if="item.type !== 'N'">
                <div class="weui-cell__hd">
                  <i class="fa fa-reply" v-if="item.name === '..'"></i>
                  <i class="fa fa-folder-o" v-else></i>
                </div>
                <div class="weui-cell__bd weui-cell_primary">{{item.name}}</div>
                <span class="weui-cell__ft"></span>
              </router-link>
              <a class="weui-cell weui-cell_access" :href="item.url" v-else download>
                <div class="weui-cell__hd">
                  <i class="fa fa-file-o"></i>
                </div>
                <div class="weui-cell__bd weui-cell_primary">{{item.name}}</div>
                <span class="weui-cell__ft"> {{item.size_v}}</span>
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="weui-skin_android" v-show="actionsheet">
      <div class="weui-mask" @click="actionsheet = false"></div>
      <div class="weui-actionsheet">
        <div class="weui-actionsheet__menu">
          <div class="weui-actionsheet__cell" @click="upload()">上传文件</div>
          <div class="weui-actionsheet__cell" @click="spider()">离线下载</div>
          <div class="weui-actionsheet__cell" @click="mkDir()">新建文件夹</div>
        </div>
      </div>
    </div>
    <div class="upload" v-show="!actionsheet" @click="actionsheet = true">
      <i class="fa fa-upload"></i>
    </div>
  </div>
</template>

<script>
import path from 'path'
import Api from '../../common/api'

export default {
  data () {
    return {
      is_loading: false,
      actionsheet: false,
      files: []
    }
  },

  computed: {
    path () {
      return path.join('/', this.$route.query.path || '')
    }
  },

  created () {
    this.fetchFiles()
  },

  methods: {
    fetchFiles () {
      this.is_loading = true
      let upyun_path = this.path
      Api('/api/upyun/directories', {
        query: {
          path: upyun_path
        }
      }).then((res) => {
        this.is_loading = false
        if (!res.ok) {
          alert(res.data.message)
          this.files = []
          return
        }

        res.data.unshift({name: '..'})
        for (let item of res.data) {
          if (item.type !== 'N') {
            let uri = path.join(this.path, item.name)
            item.url = {query: {path: uri}}
          }
        }

        this.files = res.data
      })
    },

    mkDir () {
      this.actionsheet = false
      let str = prompt('请输入文件夹名称', '')
      if (!str) {
        this.actionsheet = true
        return
      }

      let dir_path = path.join(this.path, str)
      this.is_loading = true
      Api('/api/upyun/directories', {
        body: {
          path: dir_path
        },
        method: 'PUT'
      }).then((res) => {
        if (!res.ok) {
          this.is_loading = false
          alert(res.data.message)
          return
        }
        this.$router.push({query: {path: dir_path}})
      })
    },

    upload () {
      let path = this.path
      this.$router.push({name: 'upyun-upload', query: {path}})
    },

    spider () {
      this.$router.push({name: 'upyun-spider'})
    }
  },

  watch: {
    $route (route) {
      this.fetchFiles()
    }
  }
}
</script>

<style scoped>
.weui-cell {
  padding: 15px;
}
.weui-cell__hd {
  margin: 0 10px;
}
.weui-panel__hd .weui-btn {
  float: right;
}
.weui-cell__bd {
  display:block;
  word-break:keep-all;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.weui-panel:after {
  display: none;
}
.upload {
  position: fixed;
  right: 35px;
  bottom: 35px;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 50%;
  color: #fff;
  background-color: #46be46;
}
</style>
