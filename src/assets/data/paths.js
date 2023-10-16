const COMMON_PREFIX = 'Admin_'

const UserPath = {
  Main: {
    title: 'Main',
    subTitle: [],
  },
  Dashboard: {
    title: 'Dashboard',
    subTitle: ['Home', 'Dashboard'],
  },
  ClusterDetail: {
    title: 'Cluster Detail',
    subTitle: ['Home', 'Cluster', 'Cluster Detail'],
  },
  Login: {
    title: '로그인',
    subTitle: [],
  },
  ServiceManagement: {
    title: '서비스 그룹 관리',
    subTitle: ['Home', '서비스 관리', '서비스 그룹 관리'],
  },
  ServiceRequestManagement: {
    title: '서비스 요청 관리',
    subTitle: ['Home', '서비스 관리', '서비스 요청 관리'],
  },
  Platform: {
    title: '마이데이터 분석 플랫폼',
    subTitle: ['Home', '서비스 관리', '서비스 그룹 관리'],
  },
  CostManagement: {
    title: '비용 현황',
    subTitle: ['Home', '비용 관리', '비용 현황'],
  },
  BillManagement: {
    title: '청구서 관리',
    subTitle: ['Home', '비용 관리', '청구서 관리'],
  },
  BillReleasedLog: {
    title: '계산서 발행내역',
    subTitle: ['Home', '비용 관리', '계산서 발행내역'],
  },
  ContractManagement: {
    title: '약정 관리',
    subTitle: ['Home', '비용 관리', '약정 관리'],
  },
  ServiceRequestManagementDetail: {
    title: '서비스요청 관리',
    subTitle: ['Home', '서비스 관리', '서비스요청 관리'],
  },
  ResourceApply: {
    title: '신규 자원 신청',
    subTitle: ['Home', '서비스 관리', '자원 신청'],
  },
}

const AdminPath = {
  [`${COMMON_PREFIX}Home`]: {
    title: 'DashBoard',
    subTitle: ['Home', 'Dashboard'],
  },
  [`${COMMON_PREFIX}Dashboard`]: {
    title: 'CoMP DashBoard',
    subTitle: ['Home', 'Dashboard'],
  },
  [`${COMMON_PREFIX}ResourceUsage`]: {
    title: 'CoMP DashBoard Usage Total Viewer',
    subTitle: [],
  },
  [`${COMMON_PREFIX}_Test2`]: {
    title: '서비스 그룹 관리',
    subTitle: ['서비스 그룹 관리1', '서비스 그룹 관리2', '서비스 그룹 관리3'],
  },
  [`${COMMON_PREFIX}_Test3`]: {
    title: '서비스 그룹 관리',
    subTitle: ['서비스 그룹 관리1', '서비스 그룹 관리2', '서비스 그룹 관리3'],
  },
  [`${COMMON_PREFIX}_Test4`]: {
    title: '자원 신청 관리',
    subTitle: ['자원 신청 관리1', '자원 신청 관리2', '자원 신청 관리3'],
  },
  [`${COMMON_PREFIX}_Test5`]: {
    title: '자원 신청 관리',
    subTitle: ['자원 신청 관리1', '자원 신청 관리2', '자원 신청 관리3'],
  },
  [`${COMMON_PREFIX}_Test6`]: {
    title: '자원 신청 관리',
    subTitle: ['자원 신청 관리1', '자원 신청 관리2', '자원 신청 관리3'],
  },
  [`${COMMON_PREFIX}_Test7`]: {
    title: '자원 변경 신청 관리',
    subTitle: [
      '자원 변경 신청 관리1',
      '자원 변경 신청 관리2',
      '자원 변경 신청 관리3',
    ],
  },
  [`${COMMON_PREFIX}_Test8`]: {
    title: '자원 변경 신청 관리',
    subTitle: [
      '자원 변경 신청 관리1',
      '자원 변경 신청 관리2',
      '자원 변경 신청 관리3',
    ],
  },
  [`${COMMON_PREFIX}_Test9`]: {
    title: '자원 변경 신청 관리',
    subTitle: [
      '자원 변경 신청 관리1',
      '자원 변경 신청 관리2',
      '자원 변경 신청 관리3',
    ],
  },
}
const PaaSPath = {
  Main: {
    title: 'Main',
    subTitle: ['Home'],
  },
  SampleLayout: {
    title: 'SampleLayout',
    subTitle: ['Home', 'Sample layout'],
  },
  Authority: {
    title: 'Authority',
    subTitle: ['Home', 'Setting', 'Authority'],
  },
  Components: {
    title: 'Components',
    subTitle: ['Home', 'Sample layout', 'Components'],
  },
  Dashboard: {
    title: 'Dashboard',
    subTitle: ['Home', 'Dashboard'],
  },
  projectCard: {
    title: 'Service Group',
    subTitle: ['Home', 'Service Group'],
  },
  projectDetail: {
    title: 'Service Group',
    subTitle: ['Home', 'Service Group'],
  },
  Overview: {
    title: 'Overview',
    subTitle: ['Home', 'Service Group', 'Overview'],
  },
  OverviewCluster: {
    title: 'Cluster',
    subTitle: ['Home', 'Overview', 'Cluster'],
  },
  OverviewMember: {
    title: 'Member',
    subTitle: ['Home', 'Overview', 'Member'],
  },
  Cluster: {
    title: 'Cluster',
    subTitle: ['Home', 'Cluster'],
  },
  projectClusterNew: {
    title: 'Cluster New',
    subTitle: ['Home', 'Cluster', 'New'],
  },
  ProjectClusteEdit: {
    title: 'Cluster Edit',
    subTitle: ['Home', 'Cluster', 'Edit'],
  },
  ClusterOverview: {
    title: 'Overview',
    subTitle: ['Home', 'Cluster', 'Overview'],
  },
  ClusterAddon: {
    title: 'Add-on(Catalog)',
    subTitle: ['Home', 'Cluster', 'Add-on'],
  },
  ClusterNode: {
    title: 'Node',
    subTitle: ['Home', 'Cluster', 'Node'],
  },
  ClusterNamespace: {
    title: 'Namespace',
    subTitle: ['Home', 'Cluster', 'Namespace'],
  },
  ClusterPersistentVolume: {
    title: 'Persistent Volume',
    subTitle: ['Home', 'Cluster', 'Persistent Volume'],
  },
  ClusterStorageClass: {
    title: 'Storage Class',
    subTitle: ['Home', 'Cluster', 'Storage Class'],
  },
  Workload: {
    title: 'Workload',
    subTitle: ['Home', 'Workload'],
  },
  WorkloadDeployment: {
    title: 'Deployment',
    subTitle: ['Home', 'Workload', 'Deployment'],
  },
  WorkloadStatefulSet: {
    title: 'Stateful Set',
    subTitle: ['Home', 'Workload', 'Stateful Set'],
  },
  WorkloadPod: {
    title: 'Pod',
    subTitle: ['Home', 'Workload', 'Pod'],
  },
  WorkloadCronJob: {
    title: 'Cron Job',
    subTitle: ['Home', 'Workload', 'Cron Job'],
  },
  WorkloadJob: {
    title: 'Job',
    subTitle: ['Home', 'Workload', 'Job'],
  },
  WorkloadReplicaSet: {
    title: 'Replica Set',
    subTitle: ['Home', 'Workload', 'Replica Set'],
  },
  WorkloadDaemonSet: {
    title: 'Daemon Set',
    subTitle: ['Home', 'Workload', 'Daemon Set'],
  },
  Network: {
    title: 'Network',
    subTitle: ['Home', 'Network'],
  },
  NetworkService: {
    title: 'Service',
    subTitle: ['Home', 'Network', 'Service'],
  },
  NetworkIngress: {
    title: 'Ingress',
    subTitle: ['Home', 'Network', 'Ingress'],
  },
  NetworkIngressController: {
    title: 'Ingress Controller',
    subTitle: ['Home', 'Network', 'Ingress Controller'],
  },
  Config: {
    title: 'Config',
    subTitle: ['Home', 'Config'],
  },
  ConfigPersistentVolumeClaim: {
    title: 'Persistent Volume Claim',
    subTitle: ['Home', 'Config', 'Persistent Volume Claim'],
  },
  ConfigConfigMap: {
    title: 'Config Map',
    subTitle: ['Home', 'Config', 'Config Map'],
  },
  ConfigSecret: {
    title: 'Secret',
    subTitle: ['Home', 'Config', 'Secret'],
  },
  Setting: {
    title: 'Setting',
    subTitle: ['Home', 'Setting'],
  },
  SettingGeneral: {
    title: 'General',
    subTitle: ['Home', 'Setting', 'General'],
  },
  SettingUser: {
    title: 'User',
    subTitle: ['Home', 'Setting', 'User'],
  },
  SettingCodeMgmt: {
    title: 'CodeManagement',
    subTitle: ['Home', 'Setting', 'Code Management'],
  },
  SettingAuthority: {
    title: 'Authority',
    subTitle: ['Home', 'Setting', 'Authority'],
  },
  SettingTool: {
    title: 'Tool',
    subTitle: ['Home', 'Setting', 'Tool'],
  },
  MLlist: {
    title: 'Machine Learning',
    subTitle: ['Home', 'Machine Learning'],
  },
  MLnew: {
    title: 'Machine Learning',
    subTitle: ['Home', 'Machine Learning'],
  },
  MLdetail: {
    title: 'Machine Learning',
    subTitle: ['Home', 'Machine Learning'],
  },
  AutoMLlist: {
    title: 'Suggestion',
    subTitle: ['Home', 'Hyperparameter Tuning', 'Suggestion'],
  },
  AutoMLdetail: {
    title: 'Deploy Experiments',
    subTitle: ['Home', 'Hyperparameter Tuning', 'Deploy Experiments'],
  },
  AutoMLnew: {
    title: 'Experiments',
    subTitle: ['Home', 'Hyperparameter Tuning', 'Experiments'],
  },
}

const Paths = {
  ...UserPath,
  ...AdminPath,
  ...PaaSPath,
}

export default Paths
