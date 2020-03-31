const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  const url = req.originalUrl;
  if (url.includes('admin' || 'user' || 'login')) {
    if (req.cookies.authorized === 'darkroom') {
      next();
    } else {
      res.status(403)
      res.send({
        status: 'error',
      });
    }
  }
});

module.exports = router;
