const commonAdminEP = '/v1/admin/';
const commonEP = '/v1/';

//auth
export const login = `${commonAdminEP}auth/login`;
export const register = `${commonAdminEP}auth/register`;
export const permissions = `${commonAdminEP}auth/permissions`;
export const revieweroperatorLogin = `/v1/auth/login`;
export const logout = `/v1/auth/logout`;

export const forgotPassword = `${commonAdminEP}forgotPassword`;
export const modules = `${commonAdminEP}modules`;
export const typedata = `${commonAdminEP}general/typedata`;
export const uploads = `${commonEP}uploads`;
export const verifyEmail = `${commonEP}verify-email`;
export const verification = `${commonEP}verification`;

//user
export const users = `${commonAdminEP}users`;

//cases
export const cases = `${commonAdminEP}cases`;
export const committees = `${commonAdminEP}committees`;