//存放各种校验器
const  {LinValidator,Rule} = require('../../core/lin-validator-v2')
const {User} = require('../models/user')

class PositiveIntegerValidator extends LinValidator{
  constructor(){
    super()
    this.id = [
      new Rule('isInt','需要是正整数',{min:1})
    ]
  }
}

class RegisterValidator extends LinValidator{
  constructor(){
    super()
    this.email = [
      new Rule('isEmail','不符合Email')
    ]
    this.password1 = [
      new Rule('isLength','密码长度至少6个',{min:6,max:20}),
      new Rule('matches','密码必须包含特殊字符', '^.*(?=.*[!@#$%^&*?\(\)]).*$')
    ]
    this.password2 = this.password1
    this.nickname = [
      new Rule('isLength','昵称至少4个，最多16个',{min:4,max:16})
    ]
  }

  //自定义validator方法，必须以validate开头命名
  validatePassword(vals){
    //vals是所有参数集
    const pwd1 = vals.body.password1;
    const pwd2 = vals.body.password2;
    if (pwd1 !== pwd2) {
      throw new Error('两个密码必须相同');
    }
  }
  async validateEmail(vals){
    const email = vals.body.email
    const result = await User.findOne({where:{email:email}})
    if(result){
      throw new Error('该邮箱已被使用')
    }
  }
}

module.exports = {PositiveIntegerValidator,RegisterValidator}