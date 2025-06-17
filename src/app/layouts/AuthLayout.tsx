"use client";
import React from "react";
import { ToastContainer } from "react-toastify";

interface AuthLayoutProps {
  isAdmin?: boolean;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ isAdmin, children }) => {
  return (
    <div className="auth-layout">
      <ToastContainer position="top-right" autoClose={1000} />

      <div className={`auth-bg${isAdmin ? " admin-login" : ""}`}>
        {isAdmin ? (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-5">
                <div className="auth-content">{children}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="auth-content">{children}</div>
              </div>
            </div>
            <div className="auth-logo position-relative">
              <div className="content position-absolute text-end">
                <img src="/images/sindh-logo.png" alt="Logo" />
                <h2 className="pe-3">
                  Welcome To <br />
                  <span className="primary-color fw-semibold">S&GAD</span> LAW Section
                </h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;