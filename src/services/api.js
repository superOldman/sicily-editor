import {  http_get, http_post } from './index';
// const baseAddress = process.env.NODE_ENV === 'production' ? 'http://47.96.2.170:3000' : 'http://localhost:3000';
const baseAddress =  'http://47.96.2.170:3000';

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
    const result = await http_post({ api: baseAddress + '/users/login', params });
    return result.data;
  }
  async logout() {
    const result = await http_get({ api: baseAddress + '/users/logout' });
    return result.data;
  }
  async islogin() {
    const result = await http_get({ api: baseAddress + '/islogin'});
    return result.data;
  }


  // 编辑
  async saveHtml(params) {
    const result = await http_post({ api: baseAddress + '/editor/saveHtml', params });
    return result.data;
  }
  

  async saveEditorHtml(params) {
    const result = await http_post({ api: baseAddress + '/editor/saveEditorHtml', params });
    return result.data;
  }



  // 列表页

  async get_list(params) {
    const result = await http_get({ api: baseAddress + '/list', params: { params } });
    return result.data;
  }

  async setTop(params) {
    const result = await http_post({ api: baseAddress + '/editor/setTop', params });
    return result.data;
  }

  async destroyById(params) {
    const result = await http_post({ api: baseAddress + '/editor/destroy', params });
    return result.data;
  }






  // 文件夹接口 
  async getFolderList(params) {
    const result = await http_get({ api: baseAddress + '/folder/getFolderList', params: { params } });
    return result.data;
  }



  async deleteFolder(params) {
    const result = await http_post({ api: baseAddress + '/folder/deleteFolder', params });
    return result.data;
  }
  
  async saveFolder(params) {
    const result = await http_post({ api: baseAddress + '/folder/saveFolder', params });
    return result.data;
  }

  async saveEditorFolder(params) {
    const result = await http_post({ api: baseAddress + '/folder/saveEditorFolder', params });
    return result.data;
  }
  
  async pushPaper(params) {
    const result = await http_post({ api: baseAddress + '/folder/pushPaper', params });
    return result.data;
  }

  async get_titleList(params) {
    const result = await http_post({ api: baseAddress + '/search/getTitleList', params });
    return result.data;
  }
  

  
  async searchById(params) {
    const result = await http_get({ api: baseAddress + '/searchById', params: { params } });
    return result.data;
  }



  // 注册
  async register(params) {
    const result = await http_post({ api: baseAddress + '/users/register', params });
    return result.data;
  }



  // 首页
  async resourceStats(params) {
    const result = await http_get({ api: baseAddress + '/statsHome/resourceStats', params: { params } });
    return result.data;
  }

  async visitList(params) {
    const result = await http_get({ api: baseAddress + '/statsHome/visitList', params: { params } });
    return result.data;
  }

  
  async pushPaperCount(params) {
    const result = await http_get({ api: baseAddress + '/statsHome/lastYearPushPaperCount', params: { params } });
    return result.data;
  }

  // 用户详情

  async userUpdate(params) {
    const result = await http_post({ api: baseAddress + '/users/userUpdate', params });
    return result.data;
  }

  async uploadUserMotto(params) {
    const result = await http_post({ api: baseAddress + '/users/uploadUserMotto', params });
    return result.data;
  }

  async writeOff(params) {
    const result = await http_post({ api: baseAddress + '/users/writeOff', params });
    return result.data;
  }

  
  // 图片列表
  async imageList(params) {
    const result = await http_get({ api: baseAddress + '/picture/imageList', params: { params } });
    return result.data;
  }
  async deleteImage(params) {
    const result = await http_post({ api: baseAddress + '/picture/deleteImage', params });
    return result.data;
  }


}





export default new SkmService();