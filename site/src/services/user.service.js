import HttpHandler from './handlers/http.handler';

const baseRoute = '/users';

const get = async (params = {}) => {
  const uriParams = HttpHandler.queryStringBuilder(params);
  const qs = uriParams ? `?${uriParams}` : '';

  return HttpHandler.request(`${baseRoute}${qs}`, 'GET');
}

const update = async (id, model) => {
  return HttpHandler.request(`${baseRoute}/${id}`, 'PATCH', model);
}

export default {
  get,
  update,
};
