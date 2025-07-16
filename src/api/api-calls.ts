import { cases, permissions, users, verifyEmail } from "./communications";
import HTTPMethods from "./index";

export class APICalls {
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
        value: item.id,
        label: item.cpNumber
      })) || [];
    } catch (error) {
      throw error;
    }
  }

}