const {Sequelize,Model,Op} = require('sequelize')
const {sequelize} = require('@core/db')
const util = require('util')
const axios =require('axios')
const {Favor} = require('./favor')
const yushuUrl = require('@config').yushu

class Book extends Model{
  //get 声明的是class的属性，不是函数，不可以带参数
    async detail(id){
    const url = util.format(yushuUrl.detailUrl,id)
    const detail =await axios.get(url)
    return detail.data
  }

  //书籍的数量
  static async getMyFavorCount(uid){
    const count = await Favor.count({
      where:{
        type:400,
        uid
      }
    })
    return count
  }

  //summary = 返回概要信息给用户
  static async searchFromYuShu(q,start,count=10,summary = 1){
      //encodeURI将可能是中文的字符串转义
    const url = util.format(yushuUrl.keywordUrl,encodeURI(q),count,start,summary)
    const detail = await axios(url)
    console.log(detail)
    return detail.data
  }
}

Book.init({
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true
  },
  fav_nums:{
    type:Sequelize.INTEGER,
    defaultValue:0
  }
},{
  sequelize,
  tableName:'book'
})

module.exports = {
  Book
}