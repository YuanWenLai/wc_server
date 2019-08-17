const {Sequelize,Model,Op} = require('sequelize')
const {sequelize} = require('../../core/db')
const {LikeError,DislikeError} = require('../../core/http-exception')
const {Art} = require('./art')

class Favor extends Model{
  static async like(art_id,type,uid){
    //favor增加一条数据，classic对应的表同时增加
    //favor的是classic的参考表
    //先查询favor表中是否存在该数据，如果存在，则返回你已经点赞
    const favor =await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if(favor){//如果存在数据表，证明已经点赞过
      throw new LikeError()
    }
    //没有则建立新的数据，并同时增加classic，事务处理
    //确保要返回事务，并且事务下的每个操作都是async await
    return  sequelize.transaction(async t=>{
      await Favor.create({
        art_id,
        type,
        uid
      },{transaction:t})//t就是该执行的事务t
      //在再次修改art类结构的fav_nums数据时，不能够将时间字段去除，scope = false
      console.log(art_id)
      console.log(favor)
      const art =await Art.getData(art_id,type)
      console.log(art)
      if(art){
        await art.increment('fav_nums',{
          by:1,
          transaction:t
        })
      }
    })
  }

  static async dislike(art_id,type,uid){
    const favor =await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })

    if(!favor){//如果不存在数据表，证明已经取消点赞过了
      throw new DislikeError()
    }
    //dislike的事务是，先删除这个favor表，再art的fav_nums减一
    return  sequelize.transaction(async t=>{
      //用刚刚查询的favor.destroy来删除这条记录
      //在options中设置事务！！！！
      await favor.destroy({
        force:true,
        transaction:t
      })
      const art =await Art.getData(art_id,type)
      if(art){
        await art.decrement('fav_nums',{
          by:1,
          transaction:t
        })
      }
    })
  }

  //是否用户喜欢的文章
  static async userLikeit(art_id,type,uid){
    const favor =await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if(favor){//如果存在数据表，证明已经点赞过
      return true
    }else {
      return false
    }
  }

  //书籍点赞详情
  static async bookFavor(uid,bookId){
    var favorNums
    const art =await Art.getData(bookId,400)
    if (!art){
        favorNums = await Favor.count({
        where: {
          art_id:bookId,
          type:400
        }
      })
    }else {
      favorNums = art.fav_nums
    }
    const myFavor = await Favor.findOne({
      where:{
        art_id:bookId,
        uid,
        type:400
      }
    })
    return {
      fav_nums:favorNums,
      like_status:myFavor?true:false
    }
  }

  //获取用户收藏的期刊
  static async getMyClassFavor(uid){
    const arts =await Favor.findAll({
      where:{
        uid,
        type:{
          [Op.not]:400
        }
      }
    })
    return await Art.getArtList(arts)
  }
}

Favor.init({
  uid:Sequelize.INTEGER,
  art_id:Sequelize.INTEGER,
  type:Sequelize.INTEGER
},{
  sequelize,
  tableName:'favor'   //初始化的表名为favor
})

module.exports = {
  Favor
}