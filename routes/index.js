const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.cookies.authorized === 'darkroom') {
    next();
  } else {
    if (req.originalUrl.includes('login')) {
      next()
    } else {
      res.status(403)
      res.send({
        status: 'error',
      });
    }
  }
});

module.exports = router;
