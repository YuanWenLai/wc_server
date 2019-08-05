const {Movie,Music,Sentence} = require('./classic')

class Art {
  static async getData(art_id,type){
    let art = null
    let finder = {
      where:{
        id:art_id
      }
    }
    switch (type) {
      case 100:
        //movie类型
        art = await Movie.findOne(finder)
        break
      case 200:
        //music类型
        art = await Music.findOne(finder)
        break
      case 300:
        //sentence类型
        art = await Sentence.findOne(finder)
        break
      case 400:
        //book
        break
      default:
        break
    }
    return art
  }
}

module.exports = {
  Art
}