export const dashboardTopData = {
  resourceData: [
    {
      title: 'Node',
      value: '2',
    },
    {
      title: 'Project',
      value: '2',
    },
    {
      title: 'Cluster',
      value: '10',
    },
  ],
  statusData: [
    { title: 'Node 기동 상태', value: 'GOOD' },
    { title: '10분 이내 재시작', value: '0' },
  ],
  nodeData: [
    { name: 'Power on', value: 8 },
    { name: 'Power off', value: 2 },
  ],
  masterData: [
    { name: 'Power on', value: 3 },
    { name: 'Power off', value: 1 },
  ],
  workerData: [
    { name: 'Power on', value: 6 },
    { name: 'Power off', value: 20 },
  ],
  nodeColor: ['#FFCD56', '#1A3350'],
  masterColor: ['#FF6384', '#1A3350'],
  workerColor: ['#FF976D', '#1A3350'],
}

export default dashboardTopData
