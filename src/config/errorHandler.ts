import { AxiosError } from "axios";
import Cookies from "js-cookie";
export const errorHandler = (error: AxiosError | any): string => {
  const userType = Cookies.get('userType') || 'ADMIN';
  
  if (error?.response) {
    console.log('Error Status:', error.response.status);
    console.log('Full Error Response:', error.response.data);
    
    const { status, data } = error.response;
    
    // Handle 400 Bad Request
    if (status === 400) {
      // Try multiple possible error message locations
      const errorMessage = 
        data?.data?.errors?.[0]?.message || 
        data?.errors?.[0]?.message || 
        data?.message || 
        (Array.isArray(data?.errors) ? data.errors.join(', ') : '') ||
        'Bad Request';
      
      console.log('400 Error Message:', errorMessage);
      return errorMessage;
    }
    
    // Handle 401 Unauthorized
    if (status === 401) {
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
      
      return data?.message || 'Unauthorized';
    }
    
    // Handle 403 Forbidden
    if (status === 403) {
      return data?.message || 'Access denied';
    }
    
    // Handle 404 Not Found
    if (status === 404) {
      return data?.message || 'Resource not found';
    }
    
    // Handle 422 Validation Error
    if (status === 422) {
      const errorMessage = 
        data?.data?.errors?.[0]?.message || 
        data?.errors?.[0]?.message || 
        data?.message || 
        'Validation failed';
      
      return errorMessage;
    }
    
    // Handle 500 Server Error
    if (status === 500) {
      return data?.message || 'Internal server error';
    }
    
    // Generic handler for other status codes
    return data?.message || `Error ${status}`;
    
  } else if (error?.request) {
    console.log('Network Error:', error.message);
    return error.message || 'No response from server';
  } else {
    console.log('Unknown Error:', error.message);
    return error.message || 'Something went wrong';
  }
};