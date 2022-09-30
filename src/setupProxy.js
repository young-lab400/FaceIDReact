const { createProxyMiddleware } = require('http-proxy-middleware');

const API_SERVICE_URL = "http://localhost:8080";
module.exports = function(app) {
  app.use(
    '/webapi',
    createProxyMiddleware({
      target: API_SERVICE_URL,
      changeOrigin: true,
      secure:false,
      pathRewrite: {
        [`^/webapi`]: '',
    },
    })
  );
};