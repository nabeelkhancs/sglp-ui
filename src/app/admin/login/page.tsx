"use client";
import AuthLayout from "@/app/layouts/AuthLayout";
import AdminLoginContainer from "@/containers/login/admin-login";

const AdminLogin = () => {
    return (
        <AuthLayout isAdmin={true}>
            <AdminLoginContainer />
        </AuthLayout>
    );
};

export default AdminLogin;