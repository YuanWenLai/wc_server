const bcrypt = require('bcryptjs')
const {Sequelize,Model} = require('sequelize')
const {sequelize} = require('../../core/db')
const {NotFound,AuthFailed} = require('../../core/http-exception')

//sequelize之前的版本是用define来初始化的
//现在这种init的model方法，更好的添加方法
class User extends Model{
  //校验登陆账号密码是否存在
  static async vertifyEmailPassword(email,plainPassword){
    const user = await User.findOne({
      where:{email}
    })
    if(!user){
      throw new AuthFailed('账号不存在')
    }
    //查询到有，则校对用户密码是否正确
    //因为数据库的密码是加密的，因此还需要调用bcrypt来对比校验
    const correct = bcrypt.compareSync(plainPassword,user.password)
    //如果对比不正确
    if(!correct){
      throw new AuthFailed('密码不正确')
    }
    return user
  }
}

//初始化属性
User.init({
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true   //id自动增长
  },
  nickname:Sequelize.STRING,
  email:{
    type:Sequelize.STRING(128),
    unique:true
  },
  password:{
    type:Sequelize.STRING,
    //是个保存前的属性操作函数，此方法属于 观察者模式
    set(val){
      //用bcyptjs来生产盐，盐的数字是密码生成的成本
      const salt = bcrypt.genSaltSync(10)
      //用生成的盐来加密
      const pwd = bcrypt.hashSync(val,salt)
      //调用此方法保存到数据库，this是指向Model
      this.setDataValue('password',pwd)
    }
  },
  openid:{
    type:Sequelize.STRING(64),
    unique:true
  }
},{
  sequelize,
  tableName:'user'   //初始化的表名为user
}) //可选的options参数对象 ,

module.exports = {
  User
}