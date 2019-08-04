const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  static initCore(app){
  //入口方法
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadConfig()
  }

  static loadConfig(path = ''){
    //用于将config的方法导入到全局中
    const configPath = path || `${process.cwd()}/config/config`
    const config = require(configPath)
    global.config = config
  }

  static initLoadRouters(){
    //该静态方法用于加载所以的路由
    //用requireDirectory自动导入路由模块
    //用动态路径
    const apiPath = `${process.cwd()}/app/api`
    requireDirectory(module,apiPath,{
      //visit是观察回调函数
      visit:whenLoadModle
    })

    function whenLoadModle(obj){
      if(obj instanceof Router){
        InitManager.app.use(obj.routes())
      }
    }
  }
}

module.exports = InitManager