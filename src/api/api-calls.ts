import { permissions, users } from "./communications";
import HTTPMethods from "./index";
import Cookies from "js-cookie";

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
      // Replace with your actual endpoint for email verification
      const result = await HTTPMethods.post(`/v1/admin/auth/verify-email?token=${token}`);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

}