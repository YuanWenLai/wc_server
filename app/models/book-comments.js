const {Sequelize,Model,Op} = require('sequelize')
const {sequelize} = require('../../core/db')

class Comment extends Model{
  static async addComment(bookId,content){
    //1.先查找是否有相同的评论
    const comment = await Comment.findOne({
      where:{
        book_id:bookId,
        content
      }
    })
    //2.如果不存在，新增一条评论
    if(!comment){
      return await Comment.create({
        book_id:bookId,
        content,
        nums:1
      })
    }else { //3.如果存在，评论的nums+1
      return await comment.increment('nums',{
        by:1
      })
    }
  }

  static async getComments(bookId){
    const comments = await Comment.findAll({
      where:{
        book_id:bookId
      }
    })
    return comments
  }

  //局部在Model的实例中，序列化，去除不要的字段
  toJSON() {
    return{
      content:this.content,
      nums:this.nums
    }
  }
}

Comment.init({
  content:Sequelize.STRING(16),
  nums:{
    type:Sequelize.INTEGER,
    defaultValue:0
  },
  book_id:Sequelize.INTEGER
},{
  sequelize,
  tableName:'comment'
})

module.exports = {
  Comment
}