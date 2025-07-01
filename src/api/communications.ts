const commonEP = '/v1/admin/';

//auth
export const login = `${commonEP}auth/login`;
export const register = `${commonEP}auth/register`;
export const permissions = `${commonEP}auth/permissions`;
export const revieweroperatorLogin = `/v1/auth/login`;
export const logout = `/v1/auth/logout`;

export const forgotPassword = `${commonEP}forgotPassword`;
export const modules = `${commonEP}modules`;
export const typedata = `${commonEP}general/typedata`;
export const uploads = `/v1/uploads`;

//user
export const users = `${commonEP}users`;

//cases
export const cases = `${commonEP}cases`;