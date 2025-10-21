"use client";

import { Button, Input, message } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { APICalls } from "@/api/api-calls";

const ForgotPasswordContainer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleBack = () => {
    window.history.back();
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email) {
      message.error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      message.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await APICalls.forgotPassword(email);
      setEmailSent(true);
      message.success("Password reset email sent successfully!");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      message.error(error?.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-page verify-email">
        <div className="content">
          <Image className="mb-4" src="/icons/forgot-icon.svg" alt="" width={64} height={64} />
          <h2>Email sent!</h2>
          <p className="fs-6">We've sent a password reset link to {email}</p>
          <p className="fs-6 text-muted">Check your inbox and spam folder</p>
          <Link href="/login" className="btn link-btn primary-bg text-white w-100 fs-14 fw-medium">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="auth-page verify-email">
      <div>
        <Button
          onClick={handleBack}
          className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1 text-white"
        >
          <span>
            <img src="/icons/chevron-left.svg" alt="Back" />
          </span>
          Back
        </Button>
      </div>
      <div className="content">
        <Image className="mb-4" src="/icons/forgot-icon.svg" alt="" width={64} height={64} />
        <h2>Forgot password</h2>
        <p className="fs-6">Enter your email address to reset your password</p>
        <div className="form-group  mb-4">
          <Input 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // onPressEnter={handleSubmit}
            type="email"
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
          {loading ? 'Sending...' : 'Send'}
        </a>
      </div>
    </div>
  );
};

export default ForgotPasswordContainer;