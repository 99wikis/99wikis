import HttpHandler from './handlers/http.handler';

const baseRoute = '/articles';

const create = async (model) => {
  return HttpHandler.request(`${baseRoute}`, 'POST', model);
}

const get = async (params = {}) => {
  const uriParams = HttpHandler.queryStringBuilder(params);
  const qs = uriParams ? `?${uriParams}` : '';

  return HttpHandler.request(`${baseRoute}${qs}`, 'GET');
}

const getById = async (id) => {
  return HttpHandler.request(`${baseRoute}/${id}`, 'GET');
}

const getTopics = async () => {
  return HttpHandler.request(`${baseRoute}/topics`, 'GET');
}

const update = async (id, model) => {
  return HttpHandler.request(`${baseRoute}/${id}`, 'PATCH', model);
}

const remove = async (id) => {
  return HttpHandler.request(`${baseRoute}/${id}`, 'DELETE');
}

export default {
  create,
  get,
  getById,
  getTopics,
  update,
  remove,
};
