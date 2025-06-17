"use client";
import AuthLayout from "../layouts/AuthLayout";
import LoginContainer from "@/containers/login";

const Login: React.FC = () => {
    return (
        <AuthLayout>
            <LoginContainer />
        </AuthLayout>
    );
};

export default Login;