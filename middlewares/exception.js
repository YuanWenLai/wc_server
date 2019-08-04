const {HttpException} = require('../core/http-exception')
const catchError = async (ctx,next) => {
  try{
    await next()
  }catch (error) {
    //判断是生产环境还是开发环境，用于调试信息展示在console中

    //加强判断
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment === 'dev'

    //如果是开发环境，且不是http错误，执行，例如一些代码错误
    if(isDev && !isHttpException){
      throw error
    }
    //先判断是否是HttpException的实例
    if(isHttpException){
      ctx.body = {
        message:error.message,
        error_code:error.errorCode,
        request_url:`${ctx.method} ${ctx.path}`
      }
      ctx.status = error.status
    }else{
      //处理未知异常
      ctx.body = {
        message: 'we make a mistake',
        error_code: 999,
        request_url:`${ctx.method} ${ctx.path}`
      }
      ctx.status =500
    }
  }
}

module.exports = catchError