import { AxiosError } from "axios";
import Cookies from "js-cookie";
export const errorHandler = (error: AxiosError | any): string => {
  if(error?.response?.data?.message && error.response.status === 401 && window.location.pathname.includes('login')) {
    return error.response.data.message;
  }
  const userType = Cookies.get('userType') || 'ADMIN';
  if (error?.response) {
    if (error.response.status === 401) {
      setTimeout(() => {
        Cookies.remove('token');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('login') && !window.location.pathname.includes('verification')) {
          if (userType === 'ADMIN') {
            window.location.replace('/admin/login')
          } else {
            window.location.replace('/login')
          }
        }
      }, 1000);
    }
    return error.response.data || 'Unauthorized';
  } else if (error?.request) {
    return error.message || 'No response from server';
  } else {
    return 'Something went wrong';
  }
};