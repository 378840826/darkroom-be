/* 
  有且只有一个管理员帐号
*/
const express = require('express');
const router = express.Router();

const adminName = 'darkroom';

// 获取
router.get('/currentUser', function (req, res) {
  const { cookies } = req;
  if (cookies.authorized === adminName) {
    res.send({
      name: '管理员',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: '3@q.com',
    });
  }
});

module.exports = router;
