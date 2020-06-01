import HttpHandler from './handlers/http.handler';

const baseRoute = '/applies';

const getSession = async () => {
  return HttpHandler.request(`${baseRoute}`, 'GET');
}

const getLocalSession = () => {
  if (!localStorage.user) return null;

  return JSON.parse(localStorage.user);
}

const login = async(email, password) => {
  return HttpHandler.request(`${baseRoute}/login`, 'POST', { email, password });
}

const register = async (name, email, password) => {
  return HttpHandler.request(`${baseRoute}/register`, 'POST', { name, email, password });
}

export default {
  getSession,
  getLocalSession,
  login,
  register,
};
