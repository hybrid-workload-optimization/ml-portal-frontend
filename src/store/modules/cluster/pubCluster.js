export const pubClusterInit = {
  clusterName: null,
  regionId: null,
  regionName: null,
  zoneNames: [],
  kubernetesVersion: null,
  roleArn: 'arn:aws:iam::751498871854:role/eksClusterRole',
  channel: 'REGULAR',
  authKeyName: 'strato-worker-key',
}

export const nodePoolInit = {
  nodePool: {
    nodePoolName: null,
    serverType: null,
    serverTypeName: null,
    nodeCount: 1,
    nodePoolMode: 'System',
    diskType: null,
    diskSize: 10,
    nodeIamRole: 'arn:aws:iam::751498871854:role/strato_eksNodeRole',
    serverImageType: null,
    serverImage: null,
  },
}

export const networkInit = {
  network: {
    dnsPrefix: null,
    lbPrivateSubnetKey: null,
    lbPrivateSubnetName: null,
    networkKey: null,
    networkName: null,
    networkType: null,
    networkTypeName: null,
    subnetNames: [],
    subnetKeys: [],
  },
}

export function makeClusterParameter(state) {
  let povisioningParam = {}
  const form = state.publicNewClusterForm
  if (['AWS'].includes(state.dataForm.provider)) {
    povisioningParam = {
      projectIdx: state.dataForm.projectIdx,
      clusterName: state.dataForm.clusterName,
      clusterDesc: state.dataForm.description,
      cspAccountUuid: state.dataForm.cspAccountUuid,
      kubernetesVersion: form.kubernetesVersion,
      region: form.regionName,
      roleArn: form.roleArn,
      subnetworks: form.network.subnetKeys,
      nodePools: [
        {
          nodePoolName: form.nodePool.nodePoolName,
          nodeCount: Number(form.nodePool.nodeCount),
          nodeRole: form.nodePool.nodeIamRole,
          vmType: form.nodePool.serverTypeName,
          diskSize: Number(form.nodePool.diskSize),
        },
      ],
    }
  } else if (state.dataForm.provider === 'Naver') {
    povisioningParam = {
      projectIdx: state.dataForm.projectIdx,
      clusterName: state.dataForm.clusterName,
      clusterDesc: state.dataForm.description,
      cspAccountUuid: state.dataForm.cspAccountUuid,
      kubernetesVersion: form.kubernetesVersion,
      loginKeyName: form.authKeyName,
      region: form.regionName,
      zone: form.zoneNames.length ? form.zoneNames[0] : null,
      vpcNo: form.network.networkKey,
      subnetworksNo: form.network.subnetKeys,
      lbPrivateSubnetNo: form.network.lbPrivateSubnetKey,
      networkType: form.network.networkType.toLowerCase(),
      nodePools: [
        {
          nodeCount: Number(form.nodePool.nodeCount),
          vmType: form.nodePool.serverTypeName,
        },
      ],
    }
  } else if (state.dataForm.provider === 'Azure') {
    povisioningParam = {
      projectIdx: state.dataForm.projectIdx,
      clusterName: state.dataForm.clusterName,
      clusterDesc: state.dataForm.description,
      cspAccountUuid: state.dataForm.cspAccountUuid,
      kubernetesVersion: form.kubernetesVersion,
      region: form.regionName,
      nodePools: [
        {
          nodePoolName: form.nodePool.nodePoolName,
          vmType: form.nodePool.serverTypeName,
          nodeCount: Number(form.nodePool.nodeCount),
          availabilityZones: form.zoneNames,
        },
      ],
      dnsPrefix: form.network.dnsPrefix,
    }
  } else if (state.dataForm.provider === 'GCP') {
    povisioningParam = {
      projectIdx: state.dataForm.projectIdx,
      clusterName: state.dataForm.clusterName,
      clusterDesc: state.dataForm.description,
      cspAccountUuid: state.dataForm.cspAccountUuid,
      channel: form.channel,
      kubernetesVersion: form.kubernetesVersion,
      region: form.regionName,
      availabilityZones: form.zoneNames,
      nodePools: [
        {
          nodePoolName: form.nodePool.nodePoolName,
          vmType: form.nodePool.serverTypeName,
          nodeCount: Number(form.nodePool.nodeCount),
          nodePoolOsType: form.nodePool.k8sType,
          // diskType: form.nodePool.diskTypeName,
          diskSize: Number(form.nodePool.diskSize),
        },
      ],
      network: form.network.networkName,
      subnetwork: form.network.subnetNames.length
        ? form.network.subnetNames[0]
        : null,
    }
  }
  return povisioningParam
}