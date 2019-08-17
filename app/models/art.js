const {flatten} = require('lodash')
const { Op } = require('sequelize')
const {Movie,Music,Sentence} = require('./classic')
class Art {
  static async getArtList(artInfoList){
    const artsList = []
    const artIndoObj = {
      100:[],
      200:[],
      300:[]
    }
    //遍历，将对应type的art_id写入数组中,查询文章需要art_id和type
    for (let artInfo of artInfoList){
      artIndoObj[artInfo.type].push(artInfo.art_id)
    }
    //再次遍历artIndoObj，用数组uids来查询数据库
    for (let key in artIndoObj){
      const ids = artIndoObj[key]
      //如果uids的数组为空，不做操作
      if (ids.length === 0){
        continue
      }
      key = parseInt(key)
      artsList.push(await Art._geiListByType(ids,key))
    }
    //二维数组扁平化
    return flatten(artsList)
  }

  static async _geiListByType(ids,type){
    let arts = []
    let finder = {
      where:{
        id:{
          [Op.in]:ids
        }
      }
    }
    //对于数组类的查询是findAll
    switch (type) {
      case 100:
        //movie类型
        arts = await Movie.findAll(finder)
        break
      case 200:
        //music类型
        arts = await Music.findAll(finder)
        break
      case 300:
        //sentence类型
        arts = await Sentence.findAll(finder)
        break
      default:
        break
    }
    return arts
  }


  //调用getData，第三个参数的作用是，是否调用scope作用域，默认为true
  static async getData(art_id,type){
    const {HotBook} = require('@models/hot_book')
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
        art = await HotBook.findOne(finder)
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