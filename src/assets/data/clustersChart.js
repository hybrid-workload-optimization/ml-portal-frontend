import { getUuidV1 } from '@/lib/uuid'

const ClustersChart = [
  {
    id: getUuidV1(),
    title: 'Master',
    value: '1',
  },
  {
    id: getUuidV1(),
    title: 'Worker',
    value: '3',
  },
  {
    id: getUuidV1(),
    title: 'Namespace',
    value: '5',
  },
  {
    id: getUuidV1(),
    title: 'Pod',
    value: '29',
  },
  {
    id: getUuidV1(),
    title: 'PVC',
    value: '4',
  },
]

export default ClustersChart
