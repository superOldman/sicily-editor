import axios from 'axios'
import qs from 'qs'

import router from '../router/index'

import ElementUI from 'element-ui'

import store from '../store/index'

import { getToken, removeToken, setToken } from '../utils/cookie'


// 让ajax携带cookie
// axios.defaults.withCredentials = true

// 请求超时
// axios.defaults.timeout = 10000

// 默认请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

console.log(process.env.VUE_APP_BASE_API)

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // process.env.BASE_API, // api的base_url
  timeout: 30000, // 请求超时时间
  withCredentials: true
})

// 用户掉线
let isHoldup = false

// 全局未登录提示唯一
sessionStorage.setItem('isHoldup', 0)

service.interceptors.request.use(
  config => {
    // debugger

    // removeToken()
    if (getToken()) {
      config.headers['K-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }


    if (config.url.endsWith('list')) {

      store.commit('pageStatsModule/changeLoadingStatus')
    }

    return config
  },
  error => {
    return Promise.error(error)
  }
)

service.interceptors.response.use(
  response => {
    if (response.data && response.data.code === 200) {

      if (response.config.url.endsWith('list')) {
        store.commit('pageStatsModule/changeLoadingStatus')
      }
      if (response.config.url.endsWith('islogin')) {
        isHoldup = false
      }


      if (response.config.url.endsWith('/login')) {
        setToken(response.data.data)
      }



      return response.data
    }
    else if (response.data.code === 401) {
      // 退出登录
      const baseAddress = process.env.NODE_ENV === 'production' ? 'http://47.96.2.170:4000' : 'http://localhost:4000'
      window.location.href = baseAddress + '/#/login'
    }
    else if(response.data.code === 403) {
      // 登录过期 || 未登录
      if (sessionStorage.getItem('isHoldup') === '0' && !window.location.href.includes('/login')) {
        sessionStorage.setItem('isHoldup', 1)
        ElementUI.MessageBox.alert('登录过期，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
            console.log('确定之后', action)
            // 清除token
            removeToken()
            // ...todo
            store.commit('userMessageModule/clearUser')
            // 跳转
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            })
            sessionStorage.setItem('isHoldup', 0)
          }
        })
      }
    }
    else {
      return Promise.resolve(response)
    }
  },
  error => {
    // console.log('interceptors.error', error)
    // console.log('interceptors.error', error.response && error.response)
    // console.log('interceptors.error', error.response.status && error.response.status)

    if (error && error.response && error.response.status) {
      switch (error.response.status) {
      // 401 未登录
      case 401:

        console.log(401)
        removeToken()
        router.push({ name: 'login' })
        break
        // 403 登陆过期
      case 403:

        if (!isHoldup) {
          isHoldup = true
          ElementUI.MessageBox.alert('登录过期，请重新登录', '提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              console.log('确定之后', action)
              // 清除token

              // ...todo
              store.commit('userMessageModule/clearUser')
              // 跳转
              router.replace({
                path: '/login',
                query: {
                  redirect: router.currentRoute.fullPath
                }
              })
            }
          })
        }

        break
        // 错误
      case 404:

        break
        // 其他
      default:
      }

      return Promise.reject(error.response)

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
  const _data = config.params
  if (config.format) {
    return new Promise((resolve, reject) => {
      service.post(config.api, qs.stringify(_data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }))
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  } else {
    return new Promise((resolve, reject) => {
      service.post(config.api, _data).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}


export function http_get(config) {
  let _data = null
  if (config.params) {
    _data = config.params
  }
  return new Promise((resolve, reject) => {
    service.get(config.api, _data)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
