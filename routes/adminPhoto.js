const express = require('express');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();
const path = './data/photoList.json';
const options = {
  encoding: 'utf-8'
};

const imgSavePath = '/home/image';
const minImgSavePath = '/home/image/min';
// const imgSavePath = './data/images';
// const minImgSavePath = './data/images/min';

// multer 配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 区分缩略图
    let savePath = imgSavePath;
    const name = file.originalname;
    if (name.slice(0, 4) === 'min_') {
      savePath = minImgSavePath;
    }
    cb(null, savePath)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

/* 获取图片列表 */
router.get('/', function (req, res) {  
  const {
    query: {
      current,
      pageSize,
      title,
      classify,
      sorter,
    },
  } = req;
  fs.readFile(path, options, (err, photos) => {
    if (!err) {
      const basicList = JSON.parse(photos).list;
      let filtrateList = [];
      if (title || classify) {
        basicList.forEach(photo => {
          if (
            photo.title.includes(title || '') &&
            photo.classify.includes(classify || '')
          ) {
            filtrateList.push(photo);
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

/* 上传图片 */
router.post('/', upload.single('uploadPhoto'), function (req, res) {
  const { classify } = req.body;
  const { filename, size, mimetype } = req.file;
  if (!classify) {
    res.send()
    return
  }
  fs.readFile(path, options, (err, photos) => {
    if (!err) {
      let { list, lastId } = JSON.parse(photos);
      lastId = String(Number(lastId) + 1);
      const newImg = {
        id: lastId,
        title: filename,
        mimetype,
        size: String(size),
        classify,
        date: (new Date()).getTime(),
        url: `//image.darkroom.cc/${filename}`,
        minUrl: `//image.darkroom.cc/min/${filename}`,
      };
      list.push(newImg);
      const newPhotos = JSON.stringify({ lastId, list }, null, 2);
      fs.writeFile(path, newPhotos, err => {
        if (!err) {
          res.send('上传成功！');
        }
      });
    }
  })
});

/* 删除图片 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(path, options, (err, photos) => {
    if (!err) {
      const { list, lastId } = JSON.parse(photos);
      let targetIndex = -1;
      for (let i = 0; i < list.length; i++) {
        const photo = list[i];
        if (photo.id === String(id)) {
          targetIndex = i;
          break;
        }        
      }
      const newList = list.slice(0, targetIndex).concat(list.slice(targetIndex + 1));
      const newPhotos = JSON.stringify({ lastId, list: newList }, null, 2);
      fs.writeFile(path, newPhotos, err => {
        if (!err) {
          res.send('图片删除成功！');
        } else {
          res.send({
            status: 'error',
          });
        }
      });
    } else {
      res.send({
        status: 'error',
      });
    }
  })
});

/* 修改图片信息 */
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const query = req.query;
  fs.readFile(path, options, (err, photos) => {
    if (!err) {
      const { list, lastId } = JSON.parse(photos);
      for (let i = 0; i < list.length; i++) {
        const photo = list[i];
        if (photo.id === String(id)) {
          photo.title = query.title;
          photo.classify = query.classify;
          break;
        }
      }
      const newPhotos = JSON.stringify({ lastId, list }, null, 2);
      fs.writeFile(path, newPhotos, err => {
        if (!err) {
          res.send('修改成功！')
        }
      });
    }
  })
});

module.exports = router;
