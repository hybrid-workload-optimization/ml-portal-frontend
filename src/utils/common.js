import YAML from 'yamljs'

// 데이터를 가져오는 재귀함수
const getDataRecursively = async (reqFunc, param) => {
  const response = await reqFunc(param)
  if (response.data.result) {
    const isLast = response.data.result.last
    const { content } = response.data.result

    if (!isLast) {
      param.page += 1
      const returnRes = await getDataRecursively(reqFunc, param)
      returnRes.data.result.content.forEach(e => {
        content.push(e)
      })
    }
  }
  return response
}

export const api = (() => {
  const request = {}
  // 순차적으로 전체 데이터를 조회하는 함수
  // 백엔드 쪽에 request파라미터로 PageRequest 객체 필요, response로 Page 객체가 리턴되어야 한다.
  // reqFunc: 조회 요청 함수(rquest.js)
  // param: 조회할 때 파라미터 정보(paging 정보가 없으면 디폴트로 아래와 같이 세팅된다.)
  request.getAllData = async (reqFunc, param) => {
    const defPage = 1
    const defSize = 100
    if (!param.page || !param.size) {
      param.page = defPage
      param.size = defSize
    }

    let result = {}
    try {
      const response = await getDataRecursively(reqFunc, param)
      result = response
    } catch (error) {
      console.log(error)
    }

    return result
  }

  return request
})(getDataRecursively)

export const date = {
  getDiffFromToday: dateParam => {
    const nowDate = Date.now()
    const paramDate = new Date(dateParam)
    const diffTime = nowDate - paramDate.getTime()

    const min = 1000 * 60
    const hour = min * 60
    const day = hour * 24
    const month = day * 30
    const year = day * 365

    if (diffTime < hour) {
      return `${(diffTime / min).toFixed(1)} min ago`
    }
    if (diffTime < day) {
      return `${(diffTime / hour).toFixed(1)} hour ago`
    }
    if (diffTime < month) {
      return `${(diffTime / day).toFixed(1)} day ago`
    }
    if (diffTime < year) {
      return `${(diffTime / month).toFixed(1)} month ago`
    }
    return ''
  },
}

export const diff = {
  /**
   * yaml 내부의 변경되면 안되는 값의 비교.
   * list는 비교하지 않음.
   * @param {keys: ['kind', 'metadata.name', 'metadata.namespace']} 바뀌면 안되는 data의 key 값.
   * @param {Object} newData
   * @param {Object} orgData
   * @returns Boolean (true: 변경된 값이 있음. false: 변경된 값이 없거나 비교할 값이 없음.)
   */
  yamlDiffData: (keys, newData, orgData) => {
    if (keys && keys.length) {
      return keys.some(key => {
        const keyList = key.split('.')
        let item = newData
        let orgItem = orgData

        if (typeof item === 'string') {
          item = YAML.parse(item)
        }
        if (typeof orgItem === 'string') {
          orgItem = YAML.parse(orgItem)
        }
        for (const childKey of keyList) {
          if (typeof item === 'object' && typeof orgItem === 'object') {
            item = diff.findKeysOfObject(item, childKey)
            orgItem = diff.findKeysOfObject(orgItem, childKey)
          }
        }
        return item !== orgItem
      })
    }
    return false
  },
  findKeysOfObject: (item, key) => {
    return item[key]
  },
}
