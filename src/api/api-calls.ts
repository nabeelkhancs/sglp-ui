import { permissions, users } from "./communications";
import HTTPMethods from "./index";
import Cookies from "js-cookie";

export class APICalls {
  static async getPermissions(tokenParam?: string) {
    try {
      const token = Cookies.get("token") || tokenParam;
      let result = await HTTPMethods.get(permissions, { token });
      result = result?.data?.records[0]?.subItems
      return result
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers(tokenParam?: string) {
    try {
      const token = Cookies.get("token") || tokenParam;
      const result = await HTTPMethods.get(users);
      console.log("API Call Result:", result);
      return result?.data;
    } catch (error) {
      throw error;
    }
  }

}