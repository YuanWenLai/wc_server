#小程序服务端

###环境配置
1.在根目录app.js文件中初始化

2.core文件用来配置公共方法
+ init.js中建立初始化管理器函数InitManager
+ 用requireDirectory来自动加载所有路由API

3./app/api/v1目录下放不同主题的API

4.用process.cwd()获取得到当前根目录的路径，不必用相对路径写死

# 8-1
### 用中间键统一处理、全局捕获错误
### 封装Error的继承的子类，方便获取错误，面向对象的模式
### HttpException基类可以派生多种错误类型的子类，导入即用
### Error是一个内置的对象，可以动态的添加字段信息
### 未知对象直接返回一个自己定义的错误类型

#8-2
### 配置环境校验器Lin-validator
### 依赖的包lodash，jsonwebtoken，validator，
### 可以配置不同的类型的校验器，校验每个参数是个数组，数组内可以有多种方法，多种方法是且关系
### validator校验参数需依赖core的http-exception的ParameterException
### 在config中配置环境，在开发环境下，需要将error打印到控制台中，让开发者更容易发现错误

``
validator可以帮你转换参数的类型，例如，id得到是字符串,可以解析为整形,不解析的话，在后面加上parse=false
  console.log(typeof v.get('path.id',parse=false))
``
### sequelize@5.12.2用封装MYSQL的包来自动生成库，类似于MongoDB的mongoose,依赖于mysql2的包

# 8-4
### 自定义的validator在RegisterValidator中，有相同密码校验，有Email重复校验
### 重点！！！在用validator校验时，异步的错误很难阻止后面代码的运行，在lin-validator-v2中可以截取异步错误
### 截取异步错误一定要用 async await 因为await会暂停当前的线程
### 用lin-validator-v2版本之后，后面的异步操作一定要用async await，不然会返回一个promise?会报错，除非那个API不用validator校验

# 8-5
+ 增加了登陆的校验信息
+ 用jsonwebtoken来生成token返回给前端
+ 在User的Model中定义了校验函数vertifyEmailPassword检验用户的存在
+ 再password的Model属性中增加set（）函数，用于密码的加密

### API分权限，有公开API，非公开API需要携带token才能访问，token失效和非法无法访问
+ basic-auth用于解码HTTPBasicAuth的再次加密
+ token只能检验用户是否非法，还需加权限来分类用户
+ 权限分级，普通用户的scope是8，管理员的scope是16
+ 给每个API赋值一个数字，用户访问时，与API的数字比较，看是否可以访问



