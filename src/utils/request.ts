import axios, { AxiosRequestConfig } from 'axios';

type IOptions = AxiosRequestConfig;

interface IRequestResult {
  success: boolean;
  message: string;
  statusCode: number;
  data?: any;
}

function fetch(options: IOptions) {
  const { method, data, url } = options;

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: data,
      });
    case 'delete':
      return axios.delete(url, { data });
    case 'post':
      return axios.post(url, data);
    case 'put':
      return axios.put(url, data);
    case 'patch':
      return axios.patch(url, data);
    default:
      return axios(options);
  }
}

export default function request(options: IOptions): Promise<IRequestResult> {
  return fetch(options).then(
    response => {
      const { statusText, data } = response;
      const { code } = data;

      if (code === 401) {
        return Promise.reject({
          success: false,
          message: '登录失败，请重新登录',
          statusCode: 401,
        });
      }

      if (code !== 0) {
        return Promise.reject({
          success: false,
          message: data.message || statusText,
          statusCode: code,
        });
      }

      return Promise.resolve({
        success: true,
        message: data.message || statusText,
        statusCode: code,
        data: data.data,
      });
    },
    error => {
      const { response } = error;
      let statusCode;
      let message;

      if (response) {
        const { data, statusText, status } = response;
        statusCode = status;
        message = data.message || statusText;
      }

      return Promise.reject({ success: false, statusCode, message });
    },
  );
}
