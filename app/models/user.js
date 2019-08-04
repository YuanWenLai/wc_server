const {Sequelize,Model} = require('sequelize')
const {sequelize} = require('../../core/db')

class User extends Model{

}

//初始化属性
User.init({
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true   //id自动增长
  },
  nickname:Sequelize.STRING,
  emial:Sequelize.STRING,
  password:Sequelize.STRING,
  openid:{
    type:Sequelize.STRING(64),
    unique:true
  }
},{
  sequelize,
  tableName:'user'   //初始化的表名为user
}) //可选的options参数对象 ,