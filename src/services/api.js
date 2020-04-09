import {  http_get, http_post } from './index';
const baseAddress = process.env.NODE_ENV === 'production' ? 'http://47.96.2.170:3000' : 'http://127.0.0.1:3000';
// const baseAddress =  'http://47.96.2.170:3000';

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
  async islogin() {
    const result = await http_get({ api: baseAddress + '/islogin'});
    return result.data;
  }

  async saveHtml(params) {
    const result = await http_post({ api: baseAddress + '/editor/saveHtml', params });
    return result.data;
  }
  async saveEditorHtml(params) {
    const result = await http_post({ api: baseAddress + '/editor/saveEditorHtml', params });
    return result.data;
  }

  async get_list(params) {
    const result = await http_get({ api: baseAddress + '/list', params });
    return result.data;
  }
  async destroyById(params) {
    const result = await http_get({ api: baseAddress + '/editor/destroy', params });
    return result.data;
  }

  async searchById(params) {
    const result = await http_get({ api: baseAddress + '/searchById', params });
    return result.data;
  }


  async register(params) {
    const result = await http_post({ api: baseAddress + '/users/register', params });
    return result.data;
  }

}

export default new SkmService();