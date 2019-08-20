const {Sequelize,Model,Op} = require('sequelize')
const {sequelize} = require('@core/db')

class HotMusicList extends Model{
  static async getHotMusicList(){
    return  await HotMusicList.findAll({})
  }
}

HotMusicList.init({
  type:Sequelize.STRING,
  image:Sequelize.STRING,
  fav_nums:Sequelize.INTEGER,
  title:Sequelize.STRING,
  content:Sequelize.STRING
},{
  sequelize,
  tableName:'hot_music_list'
})

module.exports={
  HotMusicList
}