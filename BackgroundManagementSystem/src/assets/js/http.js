import axios from 'axios';

const httpHelper = {};
// 配置Vue插件
httpHelper.install = function fn(Vue) {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
  // axios 拦截器
  // 当不是登录的时候添加Authorization
  axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (config.url !== '/login') {
      config.headers.Authorization = localStorage.getItem('token');
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  Vue.prototype.$http = axios;
};

export default httpHelper;
