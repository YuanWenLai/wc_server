class HttpException extends Error{
  constructor(message = '服务端错误',errorCode = 10000,status = 400){
    super()
    this.message = message
    this.status = status
    this.errorCode = errorCode
  }
}

//继承HttpException基类的子类,用于监听参数错误，以此类推，还可以派生多种类型的错误子类
class ParameterException  extends HttpException{
  constructor(message,errorCode){
    super()
    this.message = message || '参数错误'
    this.errorCode = errorCode || 10000
    this.status = 400
  }
}

//成功信息也用Error的派生类来封装，信息是成功就OK
class Success extends HttpException{
  constructor(message,errorCode){
    super()
    this.status = 201
    this.message = message || '操作ok'
    this.errorCode = errorCode || 1
  }
}

//查询数据库未找到
class NotFound extends HttpException{
  constructor(message,errorCode){
    super()
    this.message = message || '资源未找到'
    this.errorCode = errorCode || 10000
    this.status = 404
  }
}

//登陆失败，即授权用户失败
class AuthFailed extends HttpException{
  constructor(message,errorCode){
    super()
    this.message = message || '授权失败'
    this.status = 401
    this.errorCode = errorCode || 10004
  }
}

//JWT令牌不符合，则无法访问这个API
class Forbbiden extends HttpException{
  constructor(message,errorCode){
    super()
    this.message = message || '无权限访问'
    this.status = 403
    this.errorCode = 10006
  }
}

//重复点赞
class LikeError extends HttpException{
  constructor(message,errorCode){
    super()
    this.message = message || '你已经点赞过了！'
    this.status = 400
    this.errorCode = 10006
  }
}

//再次取消点赞错误
class DislikeError extends HttpException{
  constructor(message,errorCode){
    super()
    this.message = message || '你已经取消点赞了！'
    this.status = 400
    this.errorCode = 10006
  }
}

module.exports = {
  HttpException ,
  ParameterException ,
  Success,
  NotFound,
  AuthFailed,
  Forbbiden,
  LikeError,
  DislikeError
}