"use client";

import { Input, message } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { APICalls } from "@/api/api-calls";

const ResetPasswordContainer = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [token, setToken] = useState("");
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      message.error("Invalid reset link");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!password) {
      message.error("Please enter your new password");
      return;
    }

    if (!confirmPassword) {
      message.error("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      message.error("Password must be at least 8 characters long");
      return;
    }

    if (!token) {
      message.error("Invalid reset token");
      return;
    }

    setLoading(true);
    try {
      await APICalls.resetPassword(token, password, confirmPassword);
      setPasswordReset(true);
      message.success("Password reset successfully!");
    } catch (error: any) {
      console.error("Reset password error:", error);
      message.error(error?.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (passwordReset) {
    return (
      <div className="auth-page verify-email">
        <div className="content">
          <Image className="mb-4" src="/icons/forgot-icon.svg" alt="" width={64} height={64} />
          <h2>Password Reset Complete!</h2>
          <p className="fs-6">Your password has been successfully reset</p>
          <p className="fs-6 text-muted">You can now login with your new password</p>
          <Link href="/login" className="btn link-btn primary-bg text-white w-100 fs-14 fw-medium">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page verify-email">
      <div className="content">
        <Image className="mb-4" src="/icons/forgot-icon.svg" alt="" width={64} height={64} />
        <h2>Reset password</h2>
        <p className="fs-6">Enter your new password below</p>
        <div className="form-group mb-3">
          <Input.Password 
            placeholder="New Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <div className="form-group mb-4">
          <Input.Password 
            placeholder="Confirm New Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
        </div>
        <a 
          href="#" 
          onClick={handleSubmit}
          className="btn link-btn primary-bg text-white w-100 fs-14 fw-medium"
          style={{ 
            textDecoration: 'none',
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? 'none' : 'auto'
          }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </a>
      </div>
    </div>
  )
}

export default ResetPasswordContainer;