<template>
  <div>
    <background></background>
    <div class="transfer">
      <e-charts :options="chart_option"></e-charts>
      <div class="value">
        {{(user.transfer_used_v || '0 B') + ' / ' + (user.transfer_enable_v || '0 B')}}
      </div>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts-liquidfill'
import Background from '../../Background'
import {getTransferPercent} from '../../../libs/utils'

export default {
  props: ['user'],
  components: {
    ECharts,
    Background
  },

  data () {
    return {
      chart_option: {
        series: {
          type: 'liquidFill',
          color: ['#36A2EB'],
          data: [0],
          outline: {
            show: false
          },
          label: {
            normal: {
              textStyle: {
                fontSize: 22,
                fontWeight: 400,
                color: '#36A2EB'
              }
            }
          }
        }
      }
    }
  },

  created () {
    if (this.user.transfer_enable || this.user.transfer_used) {
      this.updateChart()
    }
  },

  methods: {
    updateChart () {
      let transfer_enable = this.user.transfer_enable
      let transfer_used = this.user.transfer_used
      let transferPercent = getTransferPercent(transfer_enable, transfer_used)
      this.chart_option.series.data = [transferPercent]
    }
  },

  watch: {
    user () {
      this.updateChart()
    }
  }
}

</script>

<style scoped>
.transfer {
  width: 100%;
  height: 230px;
  margin-top: -230px;
  text-align: center;
  position: relative;
}
.transfer > .echarts {
  width: 200px;
  height: 200px;
  margin: auto;
}
.transfer > .value {
  margin-top: -18px;
  font-size: 18px;
  font-weight: 300;
  color: #fff;
}
</style>
