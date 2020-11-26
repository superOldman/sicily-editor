import {  http_get, http_post } from './index';
// const baseAddress = process.env.NODE_ENV === 'production' ? 'http://47.96.2.170:3000' : 'http://localhost:3000';
// const baseAddress =  'http://47.96.2.170:3000';
const baseAddress =  '/api';

// 环境的切换 例子
// if (process.env.NODE_ENV == 'development') {
//   axios.defaults.baseURL = 'https://www.baidu.com';}
// else if (process.env.NODE_ENV == 'debug') {
//   axios.defaults.baseURL = 'https://www.ceshi.com';
// }
// else if (process.env.NODE_ENV == 'production') {
//   axios.defaults.baseURL = 'https://www.production.com';
// }

class SkmService {
  // 登陆接口
  async signin(params) {
    return await http_post({ api: baseAddress + '/users/login', params });
    
  }
  async logout() {
    return await http_get({ api: baseAddress + '/users/logout' });
    
  }
  async islogin() {
    return await http_get({ api: baseAddress + '/users/islogin' });
    
  }


  // 编辑
  async saveHtml(params) {
    return await http_post({ api: baseAddress + '/editor/saveHtml', params });
    
  }


  async saveEditorHtml(params) {   
    return await http_post({ api: baseAddress + '/editor/saveEditorHtml', params });
    
  }



  // 列表页

  async get_list(params) {
    return await http_get({ api: baseAddress + '/list', params: { params } });
    
  }

  async setTop(params) {
    return await http_post({ api: baseAddress + '/editor/setTop', params });
    
  }

  async destroyById(params) {
    return await http_post({ api: baseAddress + '/editor/destroy', params });
    
  }






  // 文件夹接口
  async getFolderList(params) {
    return await http_get({ api: baseAddress + '/folder/getFolderList', params: { params } });
    
  }



  async deleteFolder(params) {
    return await http_post({ api: baseAddress + '/folder/deleteFolder', params });
    
  }

  async saveFolder(params) {
    return await http_post({ api: baseAddress + '/folder/saveFolder', params });
    
  }

  async saveEditorFolder(params) {
    return await http_post({ api: baseAddress + '/folder/saveEditorFolder', params });
    
  }

  async pushPaper(params) {
    return await http_post({ api: baseAddress + '/folder/pushPaper', params });
    
  }

  async get_titleList(params) {
    return await http_post({ api: baseAddress + '/search/getTitleList', params });
    
  }



  async searchById(params) {
    return await http_get({ api: baseAddress + '/searchById', params: { params } });
    
  }



  // 注册
  async register(params) {
    return await http_post({ api: baseAddress + '/users/register', params });
    
  }



  // 首页
  async resourceStats(params) {
    return await http_get({ api: baseAddress + '/statsHome/resourceStats', params: { params } });
    
  }

  async visitList(params) {
    return await http_get({ api: baseAddress + '/statsHome/visitList', params: { params } });
    
  }


  async pushPaperCount(params) {
    return await http_get({ api: baseAddress + '/statsHome/lastYearPushPaperCount', params: { params } });
    
  }

  // 用户详情

  async userUpdate(params) {
    return await http_post({ api: baseAddress + '/users/userUpdate', params });
    
  }

  async uploadUserMotto(params) {
    return await http_post({ api: baseAddress + '/users/uploadUserMotto', params });
    
  }

  async writeOff(params) {
    return await http_post({ api: baseAddress + '/users/writeOff', params });
    
  }


  // 图片列表
  async imageList(params) {
    return await http_get({ api: baseAddress + '/picture/imageList', params: { params } });
    
  }
  async deleteImage(params) {
    return await http_post({ api: baseAddress + '/picture/deleteImage', params });
    
  }


}





export default new SkmService();