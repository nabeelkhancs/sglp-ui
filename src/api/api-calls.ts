import { cases, permissions, users, verifyEmail, committees, dashboard, casesCourts } from "./communications";
import HTTPMethods from "./index";

export class APICalls {
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

  static async getAllUsers(filter?: string) {
    try {
      const result = await HTTPMethods.get(`${users}?status=${filter || ''}`);
      console.log("API Call Result:", result);
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
      return result?.data;
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
}