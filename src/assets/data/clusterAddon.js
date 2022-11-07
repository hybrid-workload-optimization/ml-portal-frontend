const clusterAddon = [
  {
    image: 'icon_cluster.svg',
    title: 'Cluster monitoring',
    description:
      'Provides cluster, node, and pod monitoring function using Grafana. Provides cluster, node, and pod monitoring function using Grafana Provides cluster, node, and pod monitoring function using Grafana',
    isInstalled: true,
    packageItems: [
      {
        id: 1,
        name: 'grafana-2.34.0',
        children: [
          {
            id: 2,
            name: 'Account: admin / grafanaInitialPassword',
          },
          {
            id: 3,
            name: 'http://10.23.44.1:30003/d/cluster-monitoring',
          },
        ],
      },
      {
        id: 4,
        name: 'Prometheus-8.4.3',
        children: [],
      },
    ],
    recommendedSpec: [
      {
        id: 5,
        name: '4Core 8GB 50GB 2Node',
        children: [],
      },
    ],
  },
  {
    image: 'icon_k8s.svg',
    title: 'Kubernetes dashboard',
    description:
      'Provides cluster, node, and pod monitoring function using Grafana.',
    isInstalled: false,
    packageItems: [
      {
        id: 1,
        name: 'grafana-2.34.0',
        children: [
          {
            id: 2,
            name: 'Account: admin / grafanaInitialPassword',
          },
          {
            id: 3,
            name: 'http://10.23.44.1:30003/d/cluster-monitoring',
          },
        ],
      },
      {
        id: 4,
        name: 'Prometheus-8.4.3',
        children: [],
      },
    ],
    recommendedSpec: [
      {
        id: 5,
        name: '4Core 8GB 50GB 2Node',
        children: [],
      },
    ],
  },
  {
    image: 'icon_kafka.png',
    title: 'Kafka cluster',
    description:
      'Provides cluster, node, and pod monitoring function using Grafana.',
    isInstalled: false,
    packageItems: [
      {
        id: 1,
        name: 'grafana-2.34.0',
        children: [
          {
            id: 2,
            name: 'Account: admin / grafanaInitialPassword',
          },
          {
            id: 3,
            name: 'http://10.23.44.1:30003/d/cluster-monitoring',
          },
        ],
      },
      {
        id: 4,
        name: 'Prometheus-8.4.3',
        children: [],
      },
    ],
    recommendedSpec: [
      {
        id: 5,
        name: '4Core 8GB 50GB 2Node',
        children: [],
      },
    ],
  },
]

export default clusterAddon
