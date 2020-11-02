const Mock = require('mockjs');

const apiPrefix = '/api';

module.exports = {
  [`POST ${apiPrefix}/user/login`](req, res) {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
      res.json({
        message: 'ok',
        code: 0,
        data: {
          user: { name: 'admin' },
        },
      });
    } else {
      res.json({
        code: 401,
        message: '登录失败',
      });
    }
  },
};
