/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();

const fs = require('fs'); // File System modülü, dosya işlemleri için kullanılır

// eslint dis
let routes = fs.readdirSync(__dirname); // Geçerli dizindeki tüm dosyaları okur ve isimlerini alır
// __dirname, bu dosyanın bulunduğu dizinin yolunu verir

for(let route of routes)
{
  if(route.endsWith(".js") && route !== "index.js") // Eğer dosya bir JavaScript dosyası ise ve index.js değilse
  {
    router.use("/"+route.replace(".js","") , require('./' + route)); // Dinamik olarak bu dosyayı router'a ekler
  }
}

module.exports = router;
