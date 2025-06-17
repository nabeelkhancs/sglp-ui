import Axios from "../config/axios";
import { errorHandler } from "../config/errorHandler";

class HTTPMethods {
    static async get(endPoint: string, param?: Record<string, any>) {
        try {
            const result = await Axios.get(endPoint, { params: param });
            if (result?.status === 200) return result?.data;
            else throw result;
        } catch (e) {
            return errorHandler(e);
        }
    }

    static async post(endPoint: string, data?: any) {
        try {
            const result = await Axios.post(endPoint, data);
            if (result?.status === 200) return result?.data;
            else throw result;
        } catch (e) {
            return errorHandler(e);
        }
    }

    static async patch(endPoint: string, data?: any) {
        try {
            const result = await Axios.patch(endPoint, data);
            if (result?.status === 200) return result?.data;
            else throw result;
        } catch (e) {
            throw errorHandler(e);
        }
    }

    static async put(endPoint: string, data?: any) {
        try {
            const result = await Axios.put(endPoint, data);
            if (result?.status === 200) return result?.data;
            else throw result;
        } catch (e) {
            throw errorHandler(e);
        }
    }

    static async deleted(endPoint: string) {
        try {
            const result = await Axios.delete(endPoint);
            if (result?.status === 200) return result?.data;
            else throw result;
        } catch (e) {
            throw errorHandler(e);
        }
    }
}

export default HTTPMethods;