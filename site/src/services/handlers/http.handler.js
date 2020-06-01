import config from '../../infrastructure/config';

const { apiUrl } = config;

function buildRequestOptions(method, options) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (window.localStorage.getItem('token')) headers.Authentication = window.localStorage.getItem('token');

  const { credentials } = options || {};

  return {
    method: method,
    headers: headers,
    credentials: credentials || 'include',
  };
}

async function request(route, method, data, headers, options) {
  let requestUrl = !options || !options.skipApiUrl ? apiUrl : '';
  requestUrl += route;

  const requestOptions = buildRequestOptions(method, options);

  if (method !== 'GET' && data) requestOptions.body = JSON.stringify(data);

  if (headers) requestOptions.headers = Object.assign(requestOptions.headers, headers);

  return fetch(requestUrl, requestOptions).then(async (response) => {
    if (response.ok) return response.json().catch(() => Promise.resolve({}));

    const respondeBody = await response.json();
    throw respondeBody;
  });
}

function buildUrl(route, withToken) {
  let query = '';

  if (withToken) query = '?token=' + window.localStorage.getItem('token');

  return apiUrl + route + query;
}

function queryStringBuilder(params) {
  const qsParams = [];
  Object.keys(params).forEach((p) => {
    if (Object.prototype.hasOwnProperty.call(params, p)) {
      qsParams.push(`${p}=${params[p]}`);
    }
  });

  return qsParams.join('&');
}

export default { request, buildUrl, queryStringBuilder };
