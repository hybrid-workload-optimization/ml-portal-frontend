<template>
  <sp-card
    class="sp-overview cluster-summary-wrapper"
    :class="{ isMini }"
    elevation="0"
  >
    <div class="overview-header">Cluster 요약</div>

    <div class="overview-content-start">
      <div class="summary-wrapper">
        <div class="summary-item">
          <div class="summary-title">Provider</div>
          <div class="list-value">{{ data.provider }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-title">Region</div>
          <div class="list-value" v-if="data.region">
            {{ data.region }}
          </div>
          <div class="list-value" v-else>-</div>
        </div>
        <div class="summary-item">
          <div class="summary-title">Version</div>
          <div class="list-value">{{ data.vision }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-title">Status</div>
          <div class="list-value">{{ data.status }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-title">Created</div>
          <div class="list-value">{{ data.createAt }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-title">Provisioner</div>
          <div class="list-value">{{ data.createBy }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-title">VPC CIDR</div>
          <div class="list-value" v-if="data.vpcCidr">{{ data.vpcCidr }}</div>
          <div class="list-value" v-else>-</div>
        </div>
        <div class="summary-item">
          <div class="summary-title">Service CIDR</div>
          <div class="list-value" v-if="data.serviceCidr">
            {{ data.serviceCidr }}
          </div>
          <div class="list-value" v-else>-</div>
        </div>
        <div class="summary-item">
          <div class="summary-title">Pod CIDR</div>
          <div class="list-value" v-if="data.podCidr">{{ data.podCidr }}</div>
          <div class="list-value" v-else>-</div>
        </div>
      </div>

      <div class="chart-wrapper">
        <div class="overview-chart-wrapper">
          <apexchart
            type="donut"
            height="210px"
            :series="totalCpuData.series"
            :options="totalCpuData.options"
          />
          <span class="donut-bottom-txt">
            {{ data.cpuUsage / 1000 }}Core /
            {{ data.cpuTotal / 1000 }}Core</span
          >
        </div>

        <div class="overview-chart-wrapper">
          <apexchart
            type="donut"
            height="210"
            :series="totalMem.series"
            :options="totalMem.options"
          />
          <span class="donut-bottom-txt"
            >{{ bytesToGB(data.memoryUsage) }}GB /
            {{ bytesToGB(data.memoryTotal) }}GB</span
          >
        </div>
        <div class="overview-chart-wrapper">
          <apexchart
            type="donut"
            height="210px"
            :series="totalStorage.series"
            :options="totalStorage.options"
          />
          <span class="donut-bottom-txt"
            >{{ bytesToGB(data.storageUsage) }}GB /
            {{ bytesToGB(data.storageTotal) }}GB</span
          >
        </div>
      </div>
      <div class="content-right">
        <div class="list-item">
          <div class="list-value">{{ data.countNode }}</div>
          <div class="list-title">Node</div>
        </div>
        <div class="list-item">
          <div class="list-value">{{ data.countNamespace }}</div>
          <div class="list-title">Namespace</div>
        </div>
        <div class="list-item">
          <div class="list-value">{{ data.countPV }}0</div>
          <div class="list-title">Persisten Volume</div>
        </div>
        <div class="list-item">
          <div class="list-value">{{ data.countWorkload }}</div>
          <div class="list-title">Workload</div>
        </div>
        <div class="list-item">
          <div class="list-value">{{ data.countPod }}</div>
          <div class="list-title">Pod</div>
        </div>
      </div>
    </div>
  </sp-card>
</template>

<script>
const defaultOptions = {
  // 도넛 차트 공통 스타일
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '50',
        labels: {
          show: true,
          total: {
            show: true,
            formatter: w => {
              const dataValue = w.globals.series[0] // 첫 번째 데이터 값
              const seriesTotal = w.globals.seriesTotals.reduce(
                (acc, val) => acc + val,
                0,
              ) // 전체 데이터 합
              const ratio = (dataValue / seriesTotal) * 100
              return `${ratio.toFixed(1)}%`
            },
          },
          name: { show: false, color: '#36A2EB' },
        },
      },
      customScale: 1,
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
      totalCpuData: {
        series: [], // 차트 데이터
        options: {
          labels: ['사용', '미사용'], // 데이터 명칭
          title: {
            text: 'Total CPU 사용률',
            align: 'center',
            style: { fontSize: '18px' },
          },
          colors: ['#EA1606', '#29AA54'],
          ...defaultOptions,
        },
      },
      totalMem: {
        series: [], // 차트 데이터
        options: {
          labels: ['사용', '미사용'], // 데이터 명칭
          chart: { height: '180px' },
          title: {
            text: 'Total Memory 사용률',
            align: 'center',
            style: { fontSize: '18px' },
          },
          colors: ['#29AA54', '#FFCD56'],
          legend: { show: false },
          ...defaultOptions,
        },
      },

      totalStorage: {
        series: [], // 차트 데이터
        options: {
          labels: ['사용', '미사용'], // 데이터 명칭
          chart: { height: '180px' },
          title: {
            text: 'Total Storage 사용률',
            align: 'center',
            style: { fontSize: '18px' },
          },
          colors: ['#29AA54', '#FFCD56'],
          legend: { show: false },
          ...defaultOptions,
        },
      },
      chartCPU: [],
      chartMemory: [],
      chartStorage: [],
      donutColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      donutLabel: 'Total',
      chartOptionProps: {
        responsive: true,
        maintainAspectRatio: false, // 다른 도넛 차트 옵션 설정
      },
    }
  },
  computed: {
    isMini() {
      return this.$store.state.sideNav.isMini
    },
  },
  mounted() {
    console.log(this.data)
    this.setChartData()
  },
  methods: {
    setChartData() {
      const chartCPU = [
        this.data.cpuUsage / 1000,
        this.data.cpuTotal / 1000 - this.data.cpuUsage / 1000,
      ]
      const chartMemory = [
        this.bytesToGB(this.data.memoryUsage),
        this.bytesToGB(this.data.memoryTotal - this.data.memoryUsage),
      ]

      const chartStorage = [
        this.bytesToGB(this.data.storageUsage),
        this.bytesToGB(this.data.storageTotal - this.data.storageUsage),
      ]

      this.totalCpuData.series = chartCPU
      this.totalMem.series = chartMemory
      this.totalStorage.series = chartStorage
    },
    bytesToGB(bytes) {
      const GB = bytes / (1024 * 1024 * 1024)
      return parseFloat(GB.toFixed(1)) // 소수점 이하 두 자리까지 표시
    },
  },
}
</script>

<style lang="scss" scoped>
.overview-content-start {
  display: flex;
  flex-wrap: nowrap;
}

.summary-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2px;
  width: 24%;
  min-width: 320px;

  .summary-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;

    .summary-title {
      width: 130px;
    }
  }
}

.chart-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 56%;
  height: 232px;
  margin-top: -16px;

  .donut-bottom-txt {
    color: $sp-grey-400;
  }
}

.content-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 20%;
  height: 232px;
  margin-top: -16px;
  gap: 8px;

  .list-item {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    gap: 32px;
  }
  .list-title {
    color: $sp-grey-400;
    width: 156px;
  }
  .list-value {
    font-size: 24px;
  }
}

.cluster-summary-wrapper {
  .overview-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 8px !important;
  }

  .list-value {
    white-space: nowrap;
  }
  .overview-chart-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 33%;
  }

  .overview-box-right {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 !important;
    height: 180px;
    & > div {
      display: flex;
      justify-content: flex-start;
      gap: 16px;
      width: 240px;
    }
    .list-title {
      width: 48px;
      font-size: 18px;
      text-align: right;
    }
    .list-value {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
