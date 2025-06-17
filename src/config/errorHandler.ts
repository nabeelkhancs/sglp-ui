import { AxiosError } from "axios";
import Cookies from "js-cookie";
export const errorHandler = (error: AxiosError | any): string => {
    if (error?.response) {
        if (error.response.status === 401) {
            setTimeout(() => {
                Cookies.remove('token');
                if (typeof window !== 'undefined' && !window.location.pathname.includes('login')) {
                    window.location.replace('/admin/login')
                }
            }, 1000);
        }
        return error.response.data?.message || 'Unauthorized';
    } else if (error?.request) {
        return error.message || 'No response from server';
    } else {
        return 'Something went wrong';
    }
};