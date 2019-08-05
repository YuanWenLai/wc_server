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
    expiresIN:60*60*30*24
  }
}