import axios from '@/common/mlRequest'
/**
 * Api Documentation
 * @class request
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
const request = (() => {
  // eslint-disable-next-line no-shadow
  const request = {}

  function serializeQueryParams(parameters) {
    const str = []
    for (const p in parameters) {
      if (parameters.hasOwnProperty(p)) {
        str.push(
          `${encodeURIComponent(p)}=${encodeURIComponent(parameters[p])}`,
        )
      }
    }
    return str.join('&')
  }

  function mergeQueryParams(parameters, queryParameters) {
    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(parameterName => {
        const parameter = parameters.$queryParameters[parameterName]
        queryParameters[parameterName] = parameter
      })
    }
    return queryParameters
  }

  /**
   * HTTP Request
   * @method
   * @name request#request
   * @param {string} method - http method
   * @param {string} url - url to do request
   * @param {object} body - body parameters / object
   * @param {object} headers - header parameters
   * @param {object} queryParameters - querystring parameters
   * @param {object} form - form data object
   */
  request.request = (method, url, body, headers, queryParameters, form) => {
    const queryParams =
      queryParameters && Object.keys(queryParameters).length
        ? serializeQueryParams(queryParameters)
        : null
    const urlWithParams = url + (queryParams ? `?${queryParams}` : '')

    return axios(urlWithParams, {
      method,
      headers,
      body: body || form,
    })
  }

  /**
   * Experiment Deploy 생성
   * @method
   * @name request#createExperimentDeployPut
   * @param {object} parameters - method options and parameters
   * @param {} parameters.namespace - Api Documentation
   * @param {} parameters.name - Api Documentation
   * @param {} parameters.example - Api Documentation
   * @param {} parameters.algorithm - Api Documentation
   * @param {} parameters.repeat - Api Documentation
   */
  request.createExperimentDeployPut = parameters => {
    if (parameters === undefined) {
      parameters = {}
    }
    const path = `${process.env.VUE_APP_AUTOML_API}/v1/experiment/deploy`
    const body = {}
    let queryParameters = {}
    const headers = {}
    const form = {}

    if (parameters.namespace === undefined) {
      throw new Error('Missing required  parameter: namespace')
    }
    if (parameters.name === undefined) {
      throw new Error('Missing required  parameter: name')
    }
    if (parameters.example === undefined) {
      throw new Error('Missing required  parameter: example')
    }
    if (parameters.algorithm === undefined) {
      throw new Error('Missing required  parameter: algorithm')
    }
    if (parameters.repeat === undefined) {
      throw new Error('Missing required  parameter: repeat')
    }

    if (parameters.namespace !== undefined) {
      queryParameters.namespace = parameters.namespace
    }
    if (parameters.name !== undefined) {
      queryParameters.name = parameters.name
    }
    if (parameters.example !== undefined) {
      queryParameters.example = parameters.example
    }
    if (parameters.algorithm !== undefined) {
      queryParameters.algorithm = parameters.algorithm
    }
    if (parameters.repeat !== undefined) {
      queryParameters.repeat = parameters.repeat
    }
    queryParameters = mergeQueryParams(parameters, queryParameters)

    return axios({
      url: path,
      method: 'PUT',
      data: parameters,
      body,
      headers,
      params: queryParameters,
      form,
    })
  }

  /**
   * Suggestion List 가져오기
   * @method
   * @name request#doSuggestionListGET
   * @param {object} parameters - method options and parameters
   * @param {} parameters.namespace - namespace
   */
  request.doSuggestionListGET = parameters => {
    if (parameters === undefined) {
      parameters = {}
    }
    const path = `${process.env.VUE_APP_AUTOML_API}/v1/experiment/suggestion`
    const body = {}
    let queryParameters = {}
    const headers = {}
    const form = {}

    if (parameters.namespace === undefined) {
      throw new Error('Missing required  parameter: namespace')
    }
    if (parameters.namespace !== undefined) {
      queryParameters.namespace = parameters.namespace
    }
    queryParameters = mergeQueryParams(parameters, queryParameters)

    return axios({
      url: path,
      method: 'GET',
      data: parameters,
      body,
      headers,
      params: queryParameters,
      form,
    })
  }

  /**
   * Suggestion Detail List 가져오기
   * @method
   * @name request#doSuggestionDetailGET
   * @param {object} parameters - method options and parameters
   * @param {} parameters.namespace - namespace
   * @param {} parameters.name - name
   */
  request.doSuggestionDetailGET = parameters => {
    if (parameters === undefined) {
      parameters = {}
    }
    const path = `${process.env.VUE_APP_AUTOML_API}/v1/experiment/suggestion/detail`
    const body = {}
    let queryParameters = {}
    const headers = {}
    const form = {}

    if (parameters.namespace === undefined) {
      throw new Error('Missing required  parameter: namespace')
    }
    if (parameters.name === undefined) {
      throw new Error('Missing required  parameter: name')
    }
    if (parameters.namespace !== undefined) {
      queryParameters.namespace = parameters.namespace
    }
    if (parameters.name !== undefined) {
      queryParameters.name = parameters.name
    }
    queryParameters = mergeQueryParams(parameters, queryParameters)

    return axios({
      url: path,
      method: 'GET',
      data: parameters,
      body,
      headers,
      params: queryParameters,
      form,
    })
  }
  /**
   * Namespace List 가져오기
   * @method
   * @param {object} parameters - method options and parameters
   * @name request#doNamespaceListGET
   */
  request.doNamespaceListGET = parameters => {
    if (parameters === undefined) {
      parameters = {}
    }
    const path = `${process.env.VUE_APP_AUTOML_API}/v1/namespaces`
    const body = {}
    const queryParameters = {}
    const headers = {}
    const form = {}

    return axios({
      url: path,
      method: 'GET',
      data: parameters,
      body,
      headers,
      params: queryParameters,
      form,
    })
  }
  /**
   * exampleVersion List 가져오기
   * @method
   * @param {object} parameters - method options and parameters
   * @name request#doExampleVersionListGET
   */
  request.doExampleVersionListGET = parameters => {
    if (parameters === undefined) {
      parameters = {}
    }
    const path = `${process.env.VUE_APP_AUTOML_API}/v1/example/version`
    const body = {}
    const queryParameters = {}
    const headers = {}
    const form = {}

    return axios({
      url: path,
      method: 'GET',
      data: parameters,
      body,
      headers,
      params: queryParameters,
      form,
    })
  }
  /**
   * Algorithm List 가져오기
   * @method
   * @param {object} parameters - method options and parameters
   * @name request#doAlgorithmListGET
   */
  request.doAlgorithmListGET = parameters => {
    if (parameters === undefined) {
      parameters = {}
    }
    const path = `${process.env.VUE_APP_AUTOML_API}/v1/experiment/algorithm`
    const body = {}
    const queryParameters = {}
    const headers = {}
    const form = {}

    return axios({
      url: path,
      method: 'GET',
      data: parameters,
      body,
      headers,
      params: queryParameters,
      form,
    })
  }
  return request
})()

export default request
