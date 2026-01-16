const commonAdminEP = '/v1/admin/';
const commonEP = '/v1/';

//auth
export const login = `${commonAdminEP}auth/login`;
export const register = `${commonAdminEP}auth/register`;
export const permissions = `${commonAdminEP}auth/permissions`;
export const revieweroperatorLogin = `/v1/auth/login`;
export const logout = `/v1/auth/logout`;

export const forgotPassword = `${commonEP}forgot-password`;
export const images = `${commonAdminEP}cases/images`;
export const committeeImages = `${commonAdminEP}committees/images`;
export const resetPassword = `${commonEP}reset-password`;
export const modules = `${commonAdminEP}modules`;
export const typedata = `${commonAdminEP}general/typedata`;
export const uploads = `${commonEP}uploads`;
export const uploadsPublic = `${commonEP}uploads/public`;
export const download = `${commonEP}download`;
export const verifyEmail = `${commonEP}verify-email`;
export const verification = `${commonEP}verification`;

//user
export const users = `${commonAdminEP}users`;

//cases
export const cases = `${commonAdminEP}cases`;
export const calendar = `${commonAdminEP}cases/calendar`;
export const caseReport = `${commonAdminEP}cases/report`;
export const noticeBoard = `${commonAdminEP}cases/notice-board`;
export const casesSearch = `${commonAdminEP}cases/search`;
export const casesLogs = `${commonAdminEP}cases/logs`;
export const casesCourts = `${commonAdminEP}cases/courts`;
export const committees = `${commonAdminEP}committees`;
export const dashboard = `${commonAdminEP}dashboard`;

//notifications
export const notifications = `${commonAdminEP}notifications`;

//reports
export const reports = `${commonAdminEP}reports/generate`;
export const uploadsDetails = `${uploads}/details`;