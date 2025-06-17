import { Input } from "antd";
import Link from "next/link";
import Image from "next/image";

const ForgotPasswordContainer = () => {
  return (
    <div className="auth-page verify-email">
      <div className="content">
        <Image className="mb-4" src="/icons/forgot-icon.svg" alt="" width={64} height={64} />
        <h2>Forgot password</h2>
        <p className="fs-6">Enter your email address to reset your password</p>
        <div className="form-group  mb-4">
          <Input placeholder="Email Address" />
        </div>
        <Link href="/login" className="btn link-btn primary-bg text-white w-100 fs-14 fw-medium">
          Send
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordContainer;