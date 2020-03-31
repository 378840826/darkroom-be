const express = require('express');
const router = express.Router();
const fs = require('fs');

const path = './data/blogList.json';
const options = {
  encoding: 'utf-8'
};

const sendArticle = (id, res) => {
  fs.readFile(path, options, (err, data) => {
    if (!err) {
      let article = '';
      const list = JSON.parse(data).list;
      const length = list.length;
      for (let i = 0; i < length; i++) {
        if (list[i].id === id) {
          article = list[i]
          break
        }
      }
      const articlePath = './data/' + article.content_path;
      fs.readFile(articlePath, options, (err, articleMd) => {
        if (!err) {
          res.send({
            title: article.title,
            date: article.date,
            classify: article.classify,
            author: article.author,
            content: articleMd,
          });
        }
      })
    }
  })
};

/* 获取文章列表 */
router.get('/', function(req, res, next) {
  fs.readFile(path, options, function (err, data) {
    if (!err) {
      const { list } = JSON.parse(data);
      const showList = [];
      list.forEach(article => {
        if (article.status === 'active') {
          showList.push(article)
        }
      });
      
      res.send(showList);
    }
  })
});

/* 获取文章 */
router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  sendArticle(id, res)
});

module.exports = router;
