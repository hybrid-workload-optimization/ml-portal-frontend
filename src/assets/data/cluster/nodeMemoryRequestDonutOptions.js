export const nodeMemoryRequestDonutChartOptions = {
  options: {
    colors: [],
    labels: [],
    legend: {
      show: false,
    },
    stroke: {
      width: 0,
    },
    fill: {
      colors: [],
    },
    chart: {
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 2,
        color: '#000',
        opacity: 0.2,
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        fontFamily: 'Montserrat',
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      y: {
        formatter: value => {
          return value.toLocaleString()
        },
      },
    },
    plotOptions: {
      pie: {
        customScale: 1,
        donut: {
          labels: {
            show: true,
            value: {
              show: true,
              fontFamily: 'Montserrat',
              color: '#1A3350',
              fontWeight: 600,
              fontSize: '30px',
            },
            name: {
              show: true,
            },
            total: {
              label: '',
              show: true,
              showAlways: true,
              fontFamily: 'Montserrat',
              color: '#4E4B66',
              formatter: w => {
                const totalCount = w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0)
                const onValue = w.globals.seriesTotals[0]
                return `${Math.round((onValue / totalCount) * 100)}%`
              },
            },
          },
        },
      },
    },
  },
}

export default nodeMemoryRequestDonutChartOptions
