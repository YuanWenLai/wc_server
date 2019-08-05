//存放各种校验器
const  {LinValidator,Rule} = require('../../core/lin-validator-v2')
const {User} = require('../models/user')
const {LoginType} = require('../lib/enum')

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

class TokenValidator extends LinValidator{
  constructor(){
    super()
    //校验登陆的账号信息
    this.account = [
      new Rule('isLength','不符合账号规则',{min:4,max:32})
    ]
    //校验登陆的密码，isOptional的作用是，有密码的情况下校验，没有密码就不校验密码
    this.secret = [
      new Rule('isOptional'),
      new Rule('isLength','至少6个字符',{min:6,max:128})
    ]
  }
  //校验登陆用户的类型
  validateLoginType(vals){
    if(!vals.body.type){
      throw new Error('type是必须的参数')
    }
    if(!LoginType.isThisType(vals.body.type)){
      throw new Error('type参数不合法')
    }
  }
}

class NotEmptyValidator extends LinValidator{
  constructor(){
    super()
    this.token = [
      new Rule('isLength','token不能为空',{min:1})
    ]
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator
}