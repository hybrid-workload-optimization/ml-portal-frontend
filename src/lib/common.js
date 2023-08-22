export const getProviderIcon = provider => {
  if (typeof provider !== 'string') return 'icon_cloud.svg'
  const lowerPV = provider.toLowerCase()
  if (lowerPV === 'kubernetes') return 'icon_k8s.svg'
  if (lowerPV === 'vmware') return 'icon_vm-ware.svg'
  if (lowerPV === 'azure') return 'icon_azuer.svg'
  if (lowerPV === 'gcp') return 'icon_cloud.svg'
  if (lowerPV === 'aws') return 'icon_eks.svg'
  if (lowerPV === 'naver') return 'icon_naver.png'
  if (lowerPV === 'vmware') return 'icon_vSphere.png'
  return 'icon_cloud.svg'
}

export const getStatusImage = status => {
  if (typeof status !== 'string') {
    console.error('status type error!')
  }
  switch (status) {
    case 'Deploying':
      return 'icon_loading.gif'
    case 'Unhealthy':
      return 'icon_unhealthy.svg'
    case 'Healthy':
      return 'icon_healthy.svg'
    case 'Fail':
      return 'icon_unhealthy.svg'
    case 'Error':
      return 'icon_unhealthy.svg'
    case 'Waiting':
      return 'icon_healthy.svg'
    case 'Deleting':
      return 'icon_loading.gif'
    case 'Scale in':
      return 'icon_loading.gif'
    case 'Scale out':
      return 'icon_loading.gif'
    default:
      return ''
  }
}
