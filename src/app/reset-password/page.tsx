import { Suspense } from "react";
import ResetPasswordContainer from "@/containers/reset-password";
import AuthLayout from "../layouts/AuthLayout";

const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContainer />
      </Suspense>
    </AuthLayout>
  );
};

export default ResetPasswordPage;