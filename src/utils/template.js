import json2yaml from 'json2yaml'
// import yaml from 'yaml'

// import fs from 'fs'
import configMap from '@/assets/data/yaml-template/configMap.yaml'
import cronJob from '@/assets/data/yaml-template/cronJob.yaml'
import daemonSet from '@/assets/data/yaml-template/daemonSet.yaml'
import deploymentYaml from '@/assets/data/yaml-template/deployment.yaml'
import ingress from '@/assets/data/yaml-template/ingress.yaml'
import job from '@/assets/data/yaml-template/job.yaml'
import namespace from '@/assets/data/yaml-template/namespace.yaml'
import persistentVolume from '@/assets/data/yaml-template/persistentVolume.yaml'
import persistentVolumeClaim from '@/assets/data/yaml-template/persistentVolumeClaim.yaml'
import replicaSet from '@/assets/data/yaml-template/replicaSet.yaml'
import secret from '@/assets/data/yaml-template/secret.yaml'
import service from '@/assets/data/yaml-template/service.yaml'
import statefulSet from '@/assets/data/yaml-template/statefulSet.yaml'
import storageClass from '@/assets/data/yaml-template/storageClass.yaml'
import pod from '@/assets/data/yaml-template/pod.yaml'

export const templateItems = [
  { text: 'Namespace', value: 'namespace' },
  { text: 'Persistent Volume', value: 'persistentVolume' },
  { text: 'Storage Class', value: 'storageClass' },
  { text: 'Deployment', value: 'deployment' },
  { text: 'StatefulSet', value: 'statefulSet' },
  { text: 'ReplicaSet', value: 'replicaSet' },
  { text: 'DaemonSet', value: 'daemonSet' },
  { text: 'Job', value: 'job' },
  { text: 'Pod', value: 'pod' },
  { text: 'Service', value: 'service' },
  { text: 'Ingress', value: 'ingress' },
  { text: 'Persistent Volume Claim', value: 'persistentVolumeClaim' },
  { text: 'Config Map', value: 'configMap' },
  { text: 'Secret', value: 'secret' },
]

export const template = {
  getK8sResourceTemplate: resourceType => {
    let content = ''
    switch (resourceType) {
      case 'configMap':
        content = json2yaml.stringify(configMap)
        break
      case 'cronJob':
        content = json2yaml.stringify(cronJob)
        break
      case 'daemonSet':
        content = json2yaml.stringify(daemonSet)
        break
      case 'deployment':
        content = json2yaml.stringify(deploymentYaml)
        break
      case 'ingress':
        content = json2yaml.stringify(ingress)
        break
      case 'job':
        content = json2yaml.stringify(job)
        break
      case 'namespace':
        content = json2yaml.stringify(namespace)
        break
      case 'persistentVolume':
        content = json2yaml.stringify(persistentVolume)
        break
      case 'persistentVolumeClaim':
        content = json2yaml.stringify(persistentVolumeClaim)
        break
      case 'replicaSet':
        content = json2yaml.stringify(replicaSet)
        break
      case 'secret':
        content = json2yaml.stringify(secret)
        break
      case 'service':
        content = json2yaml.stringify(service)
        break
      case 'statefulSet':
        content = json2yaml.stringify(statefulSet)
        break
      case 'storageClass':
        content = json2yaml.stringify(storageClass)
        break
      case 'pod':
        content = json2yaml.stringify(pod)
        break
      default:
        break
    }
    return content
  },
}
