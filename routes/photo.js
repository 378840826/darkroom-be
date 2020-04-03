const express = require('express');
const router = express.Router();
const fs = require('fs');

const path = './data/photoList.json';
const options = {
  encoding: 'utf-8'
};

/* 获取相册列表 */
router.get('/', function(req, res, next) {
  fs.readFile(path, options, function (err, data) {
    if (!err) {
      const { list } = JSON.parse(data);
      res.send(list);
    }
  })
});

module.exports = router;
