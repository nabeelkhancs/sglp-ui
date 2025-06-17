import dayjs from "dayjs";

export class Helpers {
    static formatDateTime(dateString: string): string {
      if (!dateString) return "";
      return dayjs(dateString).format("DD/MM/YYYY  h:mmA");
    }
}