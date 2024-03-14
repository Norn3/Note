import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// 创建实例配置
const instance: AxiosInstance = axios.create({
    baseURL: 'https://cloud-music-api-note.vercel.app/',
    timeout: 5000
});
// 配置拦截器
// 请求拦截器
instance.interceptors.request.use((config: AxiosRequestConfig) => {
    return config;
}, (error: any) => {
    console.log(error);
    return Promise.reject(error);
    
})
// 响应拦截器
instance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, (error: any) => {
    // 这里用来处理http常见错误，进行全局提示
    let message = "";
    console.log(error);
    switch (error.response.status) {
      case 400:
        message = "请求错误(400)";
        break;
      case 401:
        message = "未授权，请重新登录(401)";
        // 这里可以做清空storage并跳转到登录页的操作
        break;
      case 403:
        message = "拒绝访问(403)";
        break;
      case 404:
        message = "请求出错(404)";
        break;
      case 408:
        message = "请求超时(408)";
        break;
      case 500:
        message = "服务器错误(500)";
        break;
      case 501:
        message = "服务未实现(501)";
        break;
      case 502:
        message = "网络错误(502)";
        break;
      case 503:
        message = "服务不可用(503)";
        break;
      case 504:
        message = "网络超时(504)";
        break;
      case 505:
        message = "HTTP版本不受支持(505)";
        break;
      default:
        message = `连接出错(${error.response.status})!`;
    }
    console.log(message);

    // 这里错误消息可以使用全局弹框展示出来
    // 比如element plus 可以使用 ElMessage
    // ElMessage({
    //   showClose: true,
    //   message: `${message}，请检查网络或联系管理员！`,
    //   type: "error",
    // });
    // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可

    return Promise.reject(error);
})

// 封装 GET 请求
export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get<T>(url, config).then((response: AxiosResponse) => response.data);
}
  // 封装 POST 请求
export function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.post<T>(url, data, config).then((response: AxiosResponse) => response.data);
}

// 发送请求
export default instance;