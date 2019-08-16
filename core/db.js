const {Sequelize,Model} = require('sequelize')
const {unset,clone,isArray} = require('lodash')

const {dbName,host,port,user,password} = require('../config/config').database

const sequelize = new Sequelize(dbName,user,password,{
  dialect:'mysql',
  host,
  port,
  logging:true,//是否打印操作
  timezone:'+08:00',//设置时区,
  define:{
    // 个性化配置
    timestamps: true, //createdAt, updatedAt
    paranoid:true, //软删除
    createdAt:'created_at',
    updatedAt:'updated_at',
    deletedAt:'deleted_at',
    // 不使用驼峰式命令规则，这样会在使用下划线分隔
    // 这样 updatedAt 的字段名会是 updated_at
    underscored: true,
    //作用域，在属性项中去除时间字段
    /*scopes:{
      bh:{
        attributes: {
          exclude: ["updated_at", "deleted_at", "created_at"]
        }
      }
    }*/
  }
})

//使用了force:true参数，这个参数表示首先删除表再重新创建表
sequelize.sync({
  //开发阶段调试成false，避免每一次刷新一次删除一次数据库
  force:false
})

//全局处理序列化
Model.prototype.toJSON = function(){
  //1.在全局中去除不要的数据
  let data = clone(this.dataValues)
  unset(data,'updated_at')
  unset(data,'created_at')
  unset(data,'deleted_at')
  //2.在API返回结果前，局部去除不要的字段，如art.excludde['id']，去除id字段
  if(isArray(this.exclude)){
    this.exclude.forEach( val =>{
      unset(data,val)
    })
  }
  return data

}

module.exports = {
  sequelize
}