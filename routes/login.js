/* 
  有且只有一个管理员帐号
*/
const express = require('express');
const router = express.Router();

const adminName = 'darkroom';

// 登录
router.post('/account', function (req, res) {
  const { userName, password, type } = req.body;
  if (userName === adminName && password === 'xjt') {
    res.cookie('authorized', userName, { maxAge: 86400000, httpOnly: true });
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'admin',
    });
  }
  else {
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  }
});

// 退出
router.get('/logout', (req, res) => {
  res.cookie('authorized', null);
  res.send({
    status: 'ok',
  })
});

module.exports = router;
