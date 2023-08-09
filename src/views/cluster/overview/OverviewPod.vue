<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview-header">Pod</div>

    <div class="overview-content">
      <div class="total-wrapper">
        <div class="total-title">Total</div>
        <div class="total-num">{{ data.countTotal }}</div>
      </div>
      <div class="chart-wrapper">
        <apexchart
          type="donut"
          height="200px"
          :series="podData.series"
          :options="podData.options"
        />
        <apexchart
          type="donut"
          height="200px"
          :series="nodeData.series"
          :options="nodeData.options"
        />
      </div>

      <div class="list-wrapper">
        <div class="list-title">
          30분 이내 재시작 ({{ data.podRestartList.length }})
          <!-- <v-icon
            class="expand-list-item-icon material-icons-outlined mb-1"
            size="medium"
            >mdi-triangle-down</v-icon
          > -->
        </div>
        <div v-if="data.podRestartList.length > 0" class="list-content">
          <div
            class="list-item"
            v-for="item in data.podRestartList"
            :key="item.id"
          >
            <div class="list-item-title">{{ item.name }}</div>
            <div class="list-item-date">{{ item.createAt }}</div>
          </div>
        </div>
        <div v-else class="no-list-content">
          <span class="no-data-msg">재시작 내역이 존재하지 않습니다.</span>
        </div>
      </div>
    </div>
  </sp-card>
</template>

<script>
const defaultOptions = {
  // 도넛 차트 공통 스타일
  legend: { show: true, position: 'right', width: 150 },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: { size: '50%' },
    },
  },
}

export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      podData: {
        series: [], // 차트 데이터
        options: {
          title: {
            text: 'Pod 가동률',
            align: 'center',
            style: { fontSize: '16px' },
          },
          labels: [],
          colors: [
            '#29AA54',
            '#06ABEA',
            '#FFCD56',
            '#A4A9B2',
            '#FF8000',
            '#0078FF',
          ],
          ...defaultOptions,
        },
      },
      nodeData: {
        series: [], // 차트 데이터
        options: {
          title: {
            text: 'Node 별 배포 현황',
            align: 'center',
            style: { fontSize: '16px' },
          },
          labels: [],
          colors: [
            '#29AA54',
            '#06ABEA',
            '#FFCD56',
            '#A4A9B2',
            '#FF8000',
            '#0078FF',
          ],
          ...defaultOptions,
        },
      },
      // operatingChartData: [],
      // deployChartData: [],
    }
  },
  computed: {
    isMini() {
      return this.$store.state.sideNav.isMini
    },
  },
  created() {
    console.log(this.data)
    this.getOperatingChartData()
    this.getDeployChartData()
  },
  mounted() {},
  methods: {
    getOperatingChartData() {
      const valuesArray = Object.values(this.data.podOperatingRate)
      const lengthsArray = valuesArray.map(value => value.length)

      const keysArray = Object.keys(this.data.podOperatingRate)

      this.podData.series = lengthsArray
      this.podData.options.labels = keysArray
    },
    getDeployChartData() {
      const valuesArray = Object.values(this.data.podDeployedByNode)
      const lengthsArray = valuesArray.map(value => value.length)
      const keysArray = Object.keys(this.data.podDeployedByNode)
      console.log(keysArray)
      this.nodeData.series = lengthsArray
      this.nodeData.options.labels = keysArray
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .overview-content {
    height: 200px;
  }
}
.total-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 8px;
  width: 120px;
  height: 200px;
  margin-right: -80px;
  padding-left: 16px;
  .total-title {
    font-size: 14px;
  }
  .total-num {
    font-size: 40px;
  }
}
.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - (120px + 400px));
  height: 200px;

  & > div {
    min-width: 280px;
    width: 100%;
    max-width: 360px;
    height: 200px;
  }

  ::v-deep {
    .apexcharts-legend-series {
      white-space: nowrap;
    }
    .apexcharts-legend-text {
      display: inline-block;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .apexcharts-legend {
      /* & .apexcharts-legend-text {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 120px;
      } */
    }
  }
}
</style>
