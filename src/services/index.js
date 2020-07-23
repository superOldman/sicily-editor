import axios from 'axios';
import qs from 'qs';

import router from '../router/index';

import ElementUI from 'element-ui';

import store from '../store/index';


// 让ajax携带cookie
axios.defaults.withCredentials = true;

// 请求超时
axios.defaults.timeout = 10000;

// 默认请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// console.log('axios',axios)
// console.log('axios.defaults',axios.defaults)


// 请求拦截
// 先导入vuex,因为我们要使用到里面的状态对象
// vuex的路径根据自己的路径去写
// import store from '@/store/index';

// // 请求拦截器
// axios.interceptors.request.use(    
//     config => {        
//         // 每次发送请求之前判断vuex中是否存在token        
//         // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
//         // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
//         const token = store.state.token;        
//         token && (config.headers.Authorization = token);        
//         return config;    
//     },    
//     error => {        
//         return Promise.error(error);    
// })
// 用户掉线
let isHoldup = false;

axios.interceptors.request.use(
  config => {

    if (config.url.endsWith('list')) {

      store.commit('pageStatsModule/changeLoadingStatus')
    }

    return config
  },
  error => {
    return Promise.error(error)
  }
)

axios.interceptors.response.use(
  response => {
    // 如果状态码是 200， 说明请求成功了， 可以拿到数据
    // 否则抛出错误

    // console.log('interceptors.response',response)
    if (response.status === 200) {
      // loading 状态
      if (response.config.url.endsWith('list')) {
        store.commit('pageStatsModule/changeLoadingStatus')
      }
      // 403 状态
      if (response.config.url.endsWith('islogin')) {
        isHoldup = false;
      }

      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    // console.log('interceptors.error', error)
    // console.log('interceptors.error', error.response && error.response)
    // console.log('interceptors.error', error.response.status && error.response.status)

    if ( error && error.response && error.response.status) {
      switch (error.response.status) {
        // 401 未登录
        case 401:
          console.log('401', '拦截了')
          console.log('401', '拦截了', router)
          router.push({ name: 'login' })

          console.log('401', '拦截了', '导向login')
          break;
        // 403 登陆过期
        case 403:
          // console.log(ElementUI)
          // if (!window.location.href.includes('login')) {
          //   isHoldup = false;
          // }
          if (!isHoldup) {
            isHoldup = true;

            ElementUI.MessageBox.alert('登录过期，请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
                console.log('确定之后', action)
                // 清除token
                // ...todo
                
                // 跳转
                router.replace({
                  path: '/login',
                  query: {
                    redirect: router.currentRoute.fullPath
                  }
                })
              }
            });
          }

          break;
        // 错误
        case 404:

          break;
        // 其他
        default:
      }

      return Promise.reject(error.response);

    }
  }
)

// 响应拦截器
// axios.interceptors.response.use(    
//   response => {   
//       // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
//       // 否则的话抛出错误
//       if (response.status === 200) {            
//           return Promise.resolve(response);        
//       } else {            
//           return Promise.reject(response);        
//       }    
//   },    
//   // 服务器状态码不是2开头的的情况
//   // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
//   // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
//   // 下面列举几个常见的操作，其他需求可自行扩展
//   error => {            
//       if (error.response.status) {            
//           switch (error.response.status) {                
//               // 401: 未登录
//               // 未登录则跳转登录页面，并携带当前页面的路径
//               // 在登录成功后返回当前页面，这一步需要在登录页操作。                
//               case 401:                    
//                   router.replace({                        
//                       path: '/login',                        
//                       query: { 
//                           redirect: router.currentRoute.fullPath 
//                       }
//                   });
//                   break;

//               // 403 token过期
//               // 登录过期对用户进行提示
//               // 清除本地token和清空vuex中token对象
//               // 跳转登录页面                
//               case 403:
//                    Toast({
//                       message: '登录过期，请重新登录',
//                       duration: 1000,
//                       forbidClick: true
//                   });
//                   // 清除token
//                   localStorage.removeItem('token');
//                   store.commit('loginSuccess', null);
//                   // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
//                   setTimeout(() => {                        
//                       router.replace({                            
//                           path: '/login',                            
//                           query: { 
//                               redirect: router.currentRoute.fullPath 
//                           }                        
//                       });                    
//                   }, 1000);                    
//                   break; 

//               // 404请求不存在
//               case 404:
//                   Toast({
//                       message: '网络请求不存在',
//                       duration: 1500,
//                       forbidClick: true
//                   });
//                   break;
//               // 其他错误，直接抛出错误提示
//               default:
//                   Toast({
//                       message: error.response.data.message,
//                       duration: 1500,
//                       forbidClick: true
//                   });
//           }
//           return Promise.reject(error.response);
//       }
//   }    
// );


export function http_post(config) {
  // console.log('参数：')
  // console.log(config.params)
  const _data = config.params;
  if (config.format) {
    return new Promise((resolve, reject) => {
      axios.post(config.api, qs.stringify(_data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }))
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err)
        })
    });
  } else {
    return new Promise((resolve, reject) => {
      axios.post(config.api, _data).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err)
      });
    });
  }
}


export function http_get(config) {
  let _data = null;
  if (config.params) {
    _data = config.params;
  }
  return new Promise((resolve, reject) => {
    axios.get(config.api, _data)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
  // console.log(config)
  // return new Promise((resolve) => {
  //   axios.get(config.api, _data)
  //   .catch((err) => {
  //     if (err) {
  //       return err;
  //     }
  //   })
  //   .then((res) => {
  //     resolve(res);
  //   });
  // });
}
