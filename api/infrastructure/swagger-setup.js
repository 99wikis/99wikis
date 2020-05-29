const expressSwaggerGenerator = require('express-swagger-generator');

const swaggerSetup = (app) => {
  const expressSwagger = expressSwaggerGenerator(app);
  const options = {
    swaggerDefinition: {
      info: {
        title: '99wikis API',
        description: 'Main gateway to in-out data of the 99wikis app',
        version: 'v1',
      },
      produces: ['application/json'],
      consumes: ['application/json'],
      schemes: ['https', 'http'],
      securityDefinitions: {
        JWT: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: "",
        }
      }
    },
    route: {
      url: '/api-docs',
      docs: '/api-docs.json',
    },
    basedir: __dirname,
    files: ['../routes/**/*.js'],
  };
  expressSwagger(options);
};

module.exports = swaggerSetup;
