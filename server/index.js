//  app.js 首页
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const mysql = require('mysql');
const router = require('./router/index')  //  引入路由

// //  开启数据库
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'hertz',
//     database: 'test',
//     multipleStatements: true, //  允许执行多条语句
// })

// connection.connect(() =>{
//     console.log('链接成功')
// });


app.use(bodyParser.urlencoded({
    extends: true
}));

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//  使用路由 /index 是路由指向名称
app.use(`/api`,router)


//配置服务端口 
var server = app.listen(3000, () => {
    const hostname = 'localhost';
    const port = 3000;
    console.log(`Server running at http://${hostname}:${port}/`);
})