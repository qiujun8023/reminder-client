<template>
  <div>
    <div class="weui-panel weui-panel_access">
      <div class="weui-panel__hd">文件上传</div>
      <div class="weui-panel__bd">
        <div class="weui-loadmore weui-loadmore_line" v-if="!files || !files.length">
          <span class="weui-loadmore__tips">尚未选择文件</span>
        </div>
        <div class="weui-media-box weui-media-box_small-appmsg" v-else>
          <div class="weui-cells">
            <div class="weui-cell weui-cell_access" v-for="file in files" :key="file.name">
              <div class="weui-cell__bd weui-cell_primary">{{file.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="weui-panel__ft">
        <div class="weui-cell weui-cell_access weui-cell_link">
          <div class="weui-cell__bd" @click="chooseFile()">
            {{files && files.length ? '重新选择' : '选择文件'}}
          </div>
          <span class="weui-cell__ft"></span>
        </div>
      </div>
    </div>
    <input ref="input" class="files" type="file" @change="fileChange()" multiple>
    <div class="weui-btn-area">
      <div class="weui-flex">
        <div class="weui-flex__item">
          <div class="weui-btn weui-btn_primary"
            :class="{'weui-btn_disabled': !can_upload, 'weui-btn_loading': is_uploading}"
            @click="uploadFiles()">
            <span v-if="is_uploading">
              <i class="weui-loading"></i> 上传中...
            </span>
            <span v-else>开始上传</span>
          </div>
        </div>
        <div class="weui-flex__item">
          <div class="weui-btn weui-btn_default" :class="{'weui-btn_disabled': is_uploading}" @click="back()">返回</div>
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
      is_uploading: false,
      files: [],
      items: []
    }
  },

  computed: {
    path () {
      return this.$route.query.path
    },
    can_upload () {
      return this.files && this.files.length
    }
  },

  methods: {
    chooseFile () {
      if (this.is_uploading) {
        return false
      }
      this.$refs.input.click()
    },
    fileChange () {
      this.files = this.$refs.input.files
    },
    uploadFiles () {
      if (!this.can_upload || this.is_uploading) {
        return false
      }
      this.is_uploading = true
      let body = new FormData()
      for (let file of this.files) {
        body.append('files', file)
      }
      body.append('path', this.path)
      Api('/api/upyun/files', {body, method: 'PUT'}).then((res) => {
        this.is_uploading = false
        if (!res.ok) {
          return alert(res.data.message || '网络异常，请刷新或稍后再试')
        }
        this.back()
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
input.files {
  display: none;
}
.weui-btn {
  margin: 0 5px;
}
.weui-btn:after {
  border: 0px;
}
.weui-cells::after {
  display: none;
}
</style>
