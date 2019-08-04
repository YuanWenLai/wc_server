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
    this.code = 400
  }
}

module.exports = {HttpException ,ParameterException  }