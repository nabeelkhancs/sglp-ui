import { cases, permissions, users, verifyEmail, committees, dashboard, casesCourts, notifications, reports, uploadsDetails, casesSearch, casesLogs, calendar, forgotPassword, resetPassword } from "./communications";
import HTTPMethods from "./index";

export class APICalls {
  
  static async getNotifications() {
    try {
      const result = await HTTPMethods.get(`${notifications}`);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async getNotificationsPaginated(page: number = 1, limit: number = 10) {
    try {
      const result = await HTTPMethods.get(`${notifications}?page=${page}&limit=${limit}`);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async getDashboardNotifications() {
    try {
      const result = await HTTPMethods.get(`${notifications}/dashboard`);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async markNotificationAsRead(notificationId: number) {
    try {
      const result = await HTTPMethods.patch(`${notifications}/${notificationId}/read`);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async markAllNotificationsAsRead() {
    try {
      const result = await HTTPMethods.patch(`${notifications}/all/read`);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async markMultipleNotificationsAsRead(notificationIds: number[]) {
    try {
      const result = await HTTPMethods.patch(`${notifications}/multiple/read`, { notificationIds });
      return result?.data;
    } catch (error) {
      throw error;
    }
  }
  static async downloadFile(filename: string) {
    try {
      const url = `/v1/download?filename=${encodeURIComponent(filename)}`;
      const response = await HTTPMethods.get(url, { responseType: 'blob' });
      
      let blob, contentType;
      if (response?.data instanceof Blob) {
        blob = response.data;
        contentType = response.headers?.['content-type'] || blob.type;
      } else {
        blob = new Blob([response?.data]);
        contentType = blob.type;
      }
      return { data: blob, contentType };
    } catch (error) {
      throw error;
    }
  }
  static async getPermissions(tokenParam?: string) {
    try {
      let result = await HTTPMethods.get(permissions);
      result = result?.data?.records[0]?.subItems
      return result
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers(filter?: string, pageNumber?: number, pageSize?: number) {
    try {
      const params = new URLSearchParams();
      if (filter) params.append('status', filter);
      if (pageNumber) params.append('pageNumber', pageNumber.toString());
      if (pageSize) params.append('pageSize', pageSize.toString());
      
      const result = await HTTPMethods.get(`${users}?${params.toString()}`);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId: any) {
    try {
      const result = await HTTPMethods.get(`${users}/${userId}`);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId: number, userData: any) {
    try {
      const result = await HTTPMethods.put(users, { id: userId, data: userData });
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(token: string) {
    try {
      const result = await HTTPMethods.post(`${verifyEmail}?token=${token}`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async forgotPassword(email: string) {
    try {
      const result = await HTTPMethods.post(forgotPassword, { email });
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(token: string, password: string, confirmPassword: string) {
    try {
      const result = await HTTPMethods.post(resetPassword, { token, password, confirmPassword });
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async verification() {
    try {
      const result = await HTTPMethods.get(`/v1/verification`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getCommmitteeCases() {
    try {
      const result = await HTTPMethods.get(`${cases}?subjectOfApplication=committee`);
      return result?.data?.result?.rows?.map((item: any) => ({
        value: item.cpNumber,
        label: item.cpNumber
      })) || [];
    } catch (error) {
      throw error;
    }
  }

  static async createCommitteeReport(data: any) {
    try {
      const result = await HTTPMethods.post(committees, data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateCommitteeReport(id: number, data: any) {
    try {
      const result = await HTTPMethods.put(`${committees}/${id}`, data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getCommitteeReport(id: number) {
    try {
      const result = await HTTPMethods.get(`${committees}/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAllCommitteeReports() {
    try {
      const result = await HTTPMethods.get(committees);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCommitteeReport(id: number) {
    try {
      const result = await HTTPMethods.deleted(`${committees}/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getDashboardData() {
    try {
      const result = await HTTPMethods.get(dashboard);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async getCaseCourts(courtType?: string) {
    try {
      const result = await HTTPMethods.get(`${casesCourts}?court=${courtType}`);
      return result?.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async generateReport(reportData: any) {
    try {
      const result = await HTTPMethods.post(reports, reportData);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

  static async getUploadsDetails(ids: string[]) {
    try {
      const result = await HTTPMethods.post(uploadsDetails, { ids });
      return result?.data?.uploads || [];
    } catch (error) {
      throw error;
    }
  }

  static async searchCases(queryParams: any) {
    try {
      console.log('API Call - searchCases with params:', queryParams);
      const result = await HTTPMethods.get(`${casesSearch}?query=${queryParams}`);
      return result?.data?.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getCaseLogs(cpNumber: string) {
    try {
      const result = await HTTPMethods.get(`${casesLogs}?cpNumber=${encodeURIComponent(cpNumber)}`);
      return result?.data?.rows || [];
    } catch (error) {
      throw error;
    }
  }

  static async getCalendarCases(startDate: string, endDate: string) {
    try {
      const result = await HTTPMethods.get(`${calendar}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
      return result?.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async getNoticeBoardEntries() {
    try {
      const result = await HTTPMethods.get(`${cases}/notice-board`);
      return result?.data || [];
    } catch (error) {
      throw error;
    }  
  }
}