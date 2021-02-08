import {  http_get, http_post } from './index'

class SkmService {
  // 登陆接口
  async signin(params) {
    return await http_post({ api: '/users/login', params })

  }
  async logout() {
    return await http_get({ api: '/users/logout' })

  }
  async islogin() {
    return await http_get({ api: '/users/islogin' })

  }


  // 编辑
  async saveHtml(params) {
    return await http_post({ api: '/editor/saveHtml', params })

  }


  async saveEditorHtml(params) {
    return await http_post({ api: '/editor/saveEditorHtml', params })

  }



  // 列表页

  async get_list(params) {
    return await http_get({ api: '/list', params: { params } })

  }

  async setTop(params) {
    return await http_post({ api: '/editor/setTop', params })

  }

  async destroyById(params) {
    return await http_post({ api: '/editor/destroy', params })

  }






  // 文件夹接口
  async getFolderList(params) {
    return await http_get({ api: '/folder/getFolderList', params: { params } })

  }



  async deleteFolder(params) {
    return await http_post({ api: '/folder/deleteFolder', params })

  }

  async saveFolder(params) {
    return await http_post({ api: '/folder/saveFolder', params })

  }

  async saveEditorFolder(params) {
    return await http_post({ api: '/folder/saveEditorFolder', params })

  }

  async pushPaper(params) {
    return await http_post({ api: '/folder/pushPaper', params })

  }

  async get_titleList(params) {
    return await http_post({ api: '/search/getTitleList', params })

  }



  async searchById(params) {
    return await http_get({ api: '/searchById', params: { params } })

  }



  // 注册
  async register(params) {
    return await http_post({ api: '/users/register', params })

  }



  // 首页
  async resourceStats(params) {
    return await http_get({ api: '/statsHome/resourceStats', params: { params } })

  }

  async visitList(params) {
    return await http_get({ api: '/statsHome/visitList', params: { params } })

  }


  async pushPaperCount(params) {
    return await http_get({ api: '/statsHome/lastYearPushPaperCount', params: { params } })

  }

  // 用户详情

  async userUpdate(params) {
    return await http_post({ api: '/users/userUpdate', params })

  }

  async uploadUserMotto(params) {
    return await http_post({ api: '/users/uploadUserMotto', params })

  }

  async writeOff(params) {
    return await http_post({ api: '/users/writeOff', params })

  }


  // 图片列表
  async imageList(params) {
    return await http_get({ api: '/picture/imageList', params: { params } })

  }
  async deleteImage(params) {
    return await http_post({ api: '/picture/deleteImage', params })

  }


}





export default new SkmService()