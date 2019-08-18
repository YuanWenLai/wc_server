module.exports = {
  //生产环境：prod
  environment:'dev',
  database:{
    dbName:'weapp',
    host:'localhost',
    user:'root',
    password:'8300589',
    database:'weapp',
    port:3306
  },
  security:{
    //用于jwt的token生成
    secretKey:'cavin',
    //在开发阶段，token的有效时间可以长一点，
    expiresIN:60*60*24*3
  },
  wx:{
    appId:'wx7e294a09149760bf',
    appSecret:'6019f59c089caf600274ea77fa15da18',
    //用%s来获取占位符
    loginUrl:'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  //外部图书的url参数
  yushu: {
    detailUrl: "http://t.yushu.im/v2/book/id/%s",
    keywordUrl: "http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s"
  },
}