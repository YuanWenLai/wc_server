const {Sequelize,Model} = require('sequelize')
const {sequelize} = require('@core/db')

const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
}

class Movie extends Model{

}

Movie.init(classicFields,{
  sequelize,
  tableName:'movie'
})

class Sentence extends Model{

}

Sentence.init(classicFields,{
  sequelize,
  tableName:'sentence'
})

class Music extends Model{
  //获取当个专辑歌单的歌曲
  static async getMusicList(type){
    return  await Music.findAll({
      where:{
        type
      }
    })

  }

  //获取单个歌曲的详情
  static async getMusicDetail(id){
   return await Music.findAll({
     where:{
       id
     }
   })
  }
}

const musicFiles = Object.assign({
  url: Sequelize.STRING
},classicFields)

Music.init(musicFiles,{
  sequelize,
  tableName:'music'
})

module.exports = {
  Movie,
  Music,
  Sentence
}