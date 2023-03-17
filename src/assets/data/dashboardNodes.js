const Dashboard = {
  headers: [
    {
      text: 'Host Name',
      align: 'left',
      value: 'name',
    },
    {
      text: 'Service Group',
      align: 'left',
      value: 'projectName',
    },
    {
      text: 'Cluster',
      align: 'left',
      value: 'clusterName',
    },
    {
      text: 'IP',
      align: 'center',
      value: 'ip',
    },
    {
      text: 'Role',
      align: 'left',
      value: 'role',
    },
    {
      text: 'Status',
      align: 'center',
      value: 'status',
    },
    {
      text: 'Pod',
      align: 'center',
      value: 'podStatus',
    },
    {
      text: 'CPU Usage',
      align: 'left',
      value: 'cpu',
    },
    {
      text: 'Memory Usage',
      align: 'left',
      value: 'memory',
    },
  ],
  options: {
    hideFooter: true,
    hideHeader: false,
    dark: false,
    dense: true,
    disableFiltering: false,
    disablePagination: false,
    disableSort: false,
    fixedHeader: false,
    showSelect: false,
    itemKey: 'host',
  },
  customSlotInfo: [
    { name: 'status', slotName: 'status' },
    { name: 'cpu', slotName: 'cpu' },
    { name: 'memory', slotName: 'memory' },
  ],
}

export default Dashboard
