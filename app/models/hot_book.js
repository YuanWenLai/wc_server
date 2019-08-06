const {Sequelize,Model,Op} = require('sequelize')
const {sequelize} = require('@core/db')
const {Favor} = require('./favor')

class Hot_book extends Model{
  static async getAll(){
    //1.先获取所以书籍信息
    const books = await Hot_book.findAll({
      order:[
        'index'
      ]
    })
    //2.获取书籍的id，用于查询每本书的点赞信息
    const ids = []
    books.forEach((book) =>{
      ids.push(book.id)
    })
    //3.用group组查询，统计一本书有多少个人点赞
    const favors = await Favor.findAll({
      where:{
        art_id:{
          [Op.in]:ids,
        },
        type:400
      },
      group:['art_id'],
      attributes:['art_id',[Sequelize.fn('COUNT','*'),'count']]
    })
    //favors的字段类似于[art_id: 7,count: 1]
    //4.遍历对比books和favors，相同id的，favors的count字段加到books的book中
    console.log(favors)
    books.forEach( book =>{
      Hot_book._getEachBookStatus(book,favors)
    })
    return books
  }

  static async _getEachBookStatus(book,favors){
    let count = 0
    favors.forEach(favor=>{
      if(book.id == favor.art_id){
        count = favor.get('count')
      }
    })
    book.setDataValue('count',count)
    return book
  }
}

Hot_book.init({
  index:Sequelize.INTEGER,
  image:Sequelize.STRING,
  author:Sequelize.STRING,
  title:Sequelize.STRING
},{
  sequelize,
  tableName:'hot_book'
})

module.exports ={
  HotBook: Hot_book
}