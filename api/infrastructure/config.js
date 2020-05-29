const getEnvVar = (property, defaultValue) => {
  const value = process.env[property];

  if (value === undefined || value === null) {
    if (defaultValue) return defaultValue;

    throw new Error(`Environment variable ${property} was not provided.`);
  }

  return value;
};

const config = {
  'env': getEnvVar('NODE_ENV', 'dev'),
  'port': getEnvVar('PORT', '8080'),
  'tokenSecret': getEnvVar('TOKEN_SECRET', 'ImAtLocalDevelopmentMode'),
  'updateAwsConfig': getEnvVar('UPDATE_AWS_CONFIG', 'false'),
  'aws': {
    'region': getEnvVar('AWS_DEFAULT_REGION', 'us-east-1'),
    'accessKeyId': getEnvVar('AWS_ACCESS_KEY_ID', ""),
    'secretAccessKey': getEnvVar('AWS_SECRET_ACCESS_KEY', ""),
  },
};

module.exports = { ...config };
