const {Sequelize,Model,Op} = require('sequelize')
const {sequelize} = require('@core/db')

class RecommendMusic extends Model{
  static async getRecommendMusic(){
    return await RecommendMusic.findAll({})
  }
}

RecommendMusic.init({
  type:Sequelize.STRING,
  music_id:Sequelize.INTEGER,
  image:Sequelize.STRING,
  title:Sequelize.STRING,
  content:Sequelize.STRING,
},{
  sequelize,
  tableName:'recommend_music'
})

module.exports={
  RecommendMusic
}