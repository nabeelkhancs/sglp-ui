"use client";
import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import SignupContainer from "@/containers/signup";

const Signup: React.FC = () => {
  return (
    <AuthLayout>
      <SignupContainer />
    </AuthLayout>
  );
};

export default Signup;