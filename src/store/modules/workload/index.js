import statefulSet from '@/store/modules/workload/statefulSet'
import pod from '@/store/modules/workload/pod'
import replicaSet from '@/store/modules/workload/replicaSet'
import deployment from '@/store/modules/workload/deployment'
import job from '@/store/modules/workload/job'
import cronJob from '@/store/modules/workload/cronJob'
import daemonSet from '@/store/modules/workload/daemonSet'

export default {
  statefulSet,
  pod,
  replicaSet,
  deployment,
  job,
  cronJob,
  daemonSet,
}
