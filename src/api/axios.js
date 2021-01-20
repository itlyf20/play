import axios from 'axios'
import { Message } from 'ElementUI'
const ConfigBaseURL = process.env.VUE_APP_BASEURL //默认路径，这里也可以使用env来判断环境
//使用create方法创建axios实例
export const Service = axios.create({
  baseURL: ConfigBaseURL,
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
// 添加请求拦截器
Service.interceptors.request.use(config => {
  return config
})
// 添加响应拦截器
Service.interceptors.response.use(response => {
  return response.data
}, error => {
  console.log('TCL: error', error)
  const msg = error.Message !== undefined ? error.Message : ''
  Message({
    message: '网络错误' + msg,
    type: 'error',
    duration: 3 * 1000
  })
  return Promise.reject(error)
})