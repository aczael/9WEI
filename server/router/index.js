const express = require(`express`)
const mysql= require('mysql2')
const router = express.Router()
var bodyParser = require("body-parser");
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
//数据库连接


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'hertz@159753',
    database: 'test'
  });


router.use((req, res, next) => {
  
  //路由拦截 
  console.log(res.header);
    console.log(`路由执行成功啦~~~`, Date.now());
  next()
})

//post请求解析中间件
//json解析中间件
router.use(bodyParser.json({ type: 'application/*+json' }));

//xml格式拦截
router.use(bodyParser.raw({ type: 'text/xml' }));

// router.use(bodyParser.urlencoded({
//     extended: true
// }));

// jwt中间件认证
router.use(expressJwt({
    secret: "secret",//加密密钥，可换
    algorithms:["HS256"]
   // credentialsRequired:"true"//false 不校验 
}).unless({
    path: ["/api/login","login","/upload","/api/upload"]//添加不需要token的接口
}));

// 未携带token请求接口会出错，触发这个
router.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).send(err);
    }
});


router.get(`/`, (req, res, next) => {
  res.json({
    status: 200,
    data: `请求成功`
  })
})


router.get(`/data`, (req, res, next) => {
  res.json({
    status: 200,
    data: [1, 2, 3, 4, 5, 6, 7]
  })
  next
})

//登录相关
router.post('/login',(req,res,next)=>{
    //解释数据库
    var username = req.body.username;
    var password = req.body.password;

    if (!username||!password) {
        return res.status(400).send("输入username及password");
    }
    //数据库判断用户
    if(username=='admin' && password=='hertz'){
        // 加密，获取token
        var authToken = jwt.sign({
            username: username,
            password:password
        }, "secret",{
            expiresIn : 60*60*24// 授权时效24小时
        });
        // 发送给前端，存在浏览器里
        res.status(200).json({
            token: authToken
        });

    }else{
        return res.status(400).send("用户名密码错误"); 
    }
    next()
})

router.post("/upload",(req,res,next)=>{
  console.log(req.body)
  res.json({
    status: 200,
    data:"upload IN"
  })
  next
})

module.exports = router