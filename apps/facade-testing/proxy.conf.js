const PROXY_CONFIG = [
  {
    context: ['/api/todos'],
    target: 'http://localhost:3000',
    pathRewrite: { '^/api': '' },
    secure: false,
  },
];

module.exports = PROXY_CONFIG;
