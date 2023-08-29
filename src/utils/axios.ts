import axios from "axios";

// 创建一个 Axios 实例
const instance = axios.create();

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 从 Session Storage 中获取 access_token
    const accessToken = sessionStorage.getItem("access_token");
    console.log(accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据进行一些操作
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // 处理 401 错误，导航到登录页面
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default instance;
