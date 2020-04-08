const express = require('express');
const request = require('request');
const router = express.Router();

const bdAK = 'ZX6U4dVmF9dFiCduABKUbAAlzaoqhlxj';

// 获取客户端 ip 所在位置
function getLocal(req, res) {
  return new Promise((resolve, reject) => {
    const ipv4 = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    const bdLocalApi = `https://api.map.baidu.com/location/ip?&coor=bd09ll&ak=${bdAK}&ip=${ipv4}`;
    request.get(bdLocalApi, (err, _, body) => {
      if (!err) {
        const content = JSON.parse(body).content;
        if (content) {
          const { city } = content.address_detail; 
          resolve(city);
        } else {
          reject('获取位置失败');
        }
      } else {
        reject('获取位置失败');
      }
    })
  })
}

// 获取天气
async function getWeather(req, res) {
  const cityIdDict = require('../data/cityIdDict.js');
  const err = {
    status: 'error',
    msg: '获取天气数据失败',
  };
  try {
    const cityName = await getLocal(req, res)
    const cityCode = cityIdDict[cityName];
    const bdWeatherApi = `http://api.map.baidu.com/weather/v1/?data_type=all&district_id=${cityCode}&ak=${bdAK}`;
    request.get(bdWeatherApi, (err, response, body) => {
      if (!err) {
        const result = JSON.parse(body).result;
        if (result) {
          const {
            location: { city },
            now: { temp, text, rh, wind_dir, wind_class },
          } = result;
          res.send({ city, temp, text, rh, wind_dir, wind_class });
        } else {
          res.send(err)
        }
      } else {
        res.send(err)
      }
    })
  } catch (error) {
    res.send(err)
  }
}

/* 获取天气数据*/
router.get('/', getWeather)

module.exports = router;
