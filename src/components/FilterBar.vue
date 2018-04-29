<template>
  <div class="weui-search-bar" :class="{'weui-search-bar_focusing': focusing || !!filter}">
    <form class="weui-search-bar__form" @submit="submit">
      <div class="weui-search-bar__box">
        <i class="weui-icon-search"></i>
        <input
          type="search"
          class="weui-search-bar__input"
          placeholder="搜索"
          ref="input"
          v-model="filter"
          @blur="focusing = false"
          @input="update($event.target.value)">
        <a href="javascript:" class="weui-icon-clear" @click="clear"></a>
      </div>
      <label for="search_input" class="weui-search-bar__label" @click="focus()">
        <i class="weui-icon-search"></i>
        <span>搜索</span>
      </label>
    </form>
    <router-link :to="{name: 'add'}" class="weui-search-bar__cancel-btn">
      <i class="fa fa-plus fa-lg"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filter: '',
      loading: false,
      focusing: false
    }
  },

  methods: {
    clear () {
      this.filter = ''
      this.focus()
    },

    focus () {
      this.focusing = true
      this.$refs.input.focus()
    },

    submit (event) {
      event.preventDefault()
    },

    update (value) {
      this.$emit('input', value.trim())
    }
  }
}
</script>

<style scoped>
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
</style>
