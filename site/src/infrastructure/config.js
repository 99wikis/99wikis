const env = window.location.host.includes('localhost:') ? 'local' : 'prod';

export default {
  apiUrl: env === 'local' ? 'http://localhost:8080' : 'to-be-defined',
};