const { createProxyMiddleware } = require('http-proxy-middleware');

const API_SERVICE_URL = "https://api.k0000.net:442";
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