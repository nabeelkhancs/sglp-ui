import { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Link from "next/link";
import HTTPMethods from "@/api";
import { Helpers } from "@/utils/helpers";
import { revieweroperatorLogin } from "@/api/communications";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Validations } from "@/utils/validations";

const LoginContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userType = Cookies.get("userType");
    const firstPageVisited = Cookies.get("firstPageVisited");
    if (token && userType && firstPageVisited) {
      router.replace(firstPageVisited);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Login form submitted");
    e.preventDefault();
    const { emailError, passwordError, valid } = Validations.validateLogin(email, password);
    setEmailError(emailError);
    setPasswordError(passwordError);
    if (!valid) return;
    setLoading(true);
    try {
      const res = await HTTPMethods.post(revieweroperatorLogin, { email, password });
      if (res?.data?.token) {
        console.log("Setting cookies after login",res?.data?.["Role.type"]);
        Cookies.set("token", res?.data?.token);
        Cookies.set("userType", res?.data?.roleType == null ? res?.data?.["Role.type"] || "" : res?.data?.roleType);
        Cookies.set("userName", res?.data?.name);
        Cookies.set("firstPageVisited", res?.data?.firstPageVisited);
        console.log("Login successful response:", res);
        toast.success("Login successful!");
        router.push(res?.data?.firstPageVisited);
      } else {
        console.log("Login failed response:", res);
        toast.error(res?.message || res || "Login failed");
        return
      }
    } catch (err: any) {
      message.error(err?.toString() || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page ">
      <div className="title">
        <h2>Welcome Back!</h2>
        <p className="mb-4 fs-6">Enter Following Details to continue</p>
        <div className="form-area">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label mb-1">Email Address</label>
              <Input
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                status={emailError ? "error" : ""}
              />
              {emailError && (
                <div style={{ color: "#ff4d4f", fontSize: "13px", marginTop: "4px", background: "transparent", padding: 0 }}>{emailError}</div>
              )}
            </div>
            <div className="form-group">
              <label className="input-label mb-1">Password</label>
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                status={passwordError ? "error" : ""}
                style={{ color: "#fff"}}
              />
              {passwordError && (
                <div style={{ color: "#ff4d4f", fontSize: "13px", marginTop: "4px", background: "transparent", padding: 0 }}>{passwordError}</div>
              )}
            </div>
            <div className="forget-pass text-end pt-1 mb-3">
              <Link href="/forgot-password" className="text-white fw-medium">
                Forgot Password?
              </Link>
            </div>
            <div className="action mb-4">
              <Button className="primary-bg" htmlType="submit" loading={loading}>Login</Button>
            </div>
            <p className="fs-6 fw-medium">Don’t have an account?
              <Link href="/signup" className="ms-1 primary-color">
                Let's Create
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginContainer;