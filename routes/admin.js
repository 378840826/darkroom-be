const express = require('express');
const fs = require('fs');

const router = express.Router();
const path = './data/blogList.json';
const options = {
  encoding: 'utf-8'
};

router.post('/login/account', function (req, res) {
  const { userName, password } = req.body;
  if (userName == 'hello' && password == 'world') {
    res.cookie('authorized', userName);
    res.redirect('/admin');
  }
  else {
    res.render('login', { flag: 1 });
  }
})

/* 获取文章列表 */
router.get('/blog', function (req, res) {  
  const {
    query: {
      current,
      pageSize,
      title,
      author,
      classify,
      status,
      sorter,
    },
  } = req;
  fs.readFile(path, options, (err, blog) => {
    if (!err) {
      const basicList = JSON.parse(blog).list;
      let filtrateList = [];
      if (title || author || classify || status) {
        basicList.forEach(article => {
          if (
            article.title.includes(title || '') &&
            article.author.includes(author || '') &&
            article.classify.includes(classify || '') &&
            (status ? article.status === status : true )
          ) {
            filtrateList.push(article);
          }
        });
      } else {
        filtrateList = basicList;
      }
      if (sorter) {
        const [ sort, order ] = sorter.split('_');
        filtrateList.sort((a, b) => {
          if (order === 'descend') {
            return a[sort] > b[sort] ? 1 : -1
          } else {
            return a[sort] < b[sort] ? 1 : -1
          }
        })
      }
      const endIndex = Number(current) * Number(pageSize);
      const startIndex = endIndex - Number(pageSize);
      const processedList = filtrateList.slice(startIndex, endIndex);
      res.send({
        data: processedList,
        total: basicList.length,
        success: true,
        pageSize: '10',
        current: 1,
      });
    }
  })
});

/* 展示或隐藏文章 */
router.put('/blog/:id/:status', (req, res) => {
  const { id, status } = req.params;
  fs.readFile(path, options, (err, blog) => {
    if (!err) {
      const { list, lastId } = JSON.parse(blog);
      list.forEach(article => {
        if (article.id === String(id)) {
          article.status = status;
        }
      });
      const newBlog = JSON.stringify({ lastId, list }, null, 2);
      fs.writeFile(path, newBlog, err => {
        if (!err) {
          res.send('修改成功！')
        }
      });
    }
  })
});

/* 修改文章信息 */
router.put('/blog/:id', (req, res) => {
  const id = req.params.id;
  const query = req.query;
  fs.readFile(path, options, (err, blog) => {
    if (!err) {
      const { list, lastId } = JSON.parse(blog);
      list.forEach(article => {
        if (article.id === String(id)) {
          article.title = query.title;
          article.author = query.author;
          article.classify = query.classify;
        }
      });
      const newBlog = JSON.stringify({ lastId, list }, null, 2);
      fs.writeFile(path, newBlog, err => {
        if (!err) {
          res.send('修改成功！')
        }
      });
    }
  })
});

/* 创建新文章*/
router.post('/blog', (req, res) => {
  const { title, author, classify, content } = req.body;
  fs.readFile(path, options, (err, blog) => {
    if (!err) {
      let { list, lastId } = JSON.parse(blog);
      lastId = String(Number(lastId) + 1);
      const newArticle = {
        id: lastId,
        title,
        author,
        classify,
        date: (new Date()).getTime(),
        status: 'active',
        content_path: `md/${lastId}_${title}.md`,
      };
      list.push(newArticle);
      const newBlog = JSON.stringify({ lastId, list }, null, 2);
      fs.writeFile(path, newBlog, err => {
        if (!err) {
          fs.writeFile(`./data/${newArticle.content_path}`, content, err => {
            if (!err) {
              res.send('发布成功！');
            }
          });
        }
      });
    }
  })
});


module.exports = router;
