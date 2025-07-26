import { useEffect, useState } from "react";
import { Button, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import HTTPMethods from "@/api";
import { Validations } from "@/utils/validations";
import { login } from "@/api/communications";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AdminLoginContainer = () => {
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
    e.preventDefault();

    const { emailError, passwordError, valid } = Validations.validateLogin(email, password);
    setEmailError(emailError);
    setPasswordError(passwordError);

    if (!valid) return;
    setLoading(true);
    try {
      const res = await HTTPMethods.post(login, { email, password });
      if (res?.data?.token) {
        Cookies.set("token", res?.data?.token);
        Cookies.set("userType", res?.data?.type || "ADMIN");
        Cookies.set("userName", res?.data?.name || "Admin");
        toast.success("Login successful!");
        router.push(res?.data?.firstPageVisited);
      } else {
        message.error(res?.message || "Login failed");
      }
    } catch (err: any) {
      message.error(err?.toString() || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin ">
      <div className="title text-center mb-4">
        <img src="/logo-green.png" className="mb-4" />
        <h2><span className="primary-color">Welcome To SGA&CD</span> Legal Wing</h2>
        <p className="fw-medium fs-6">Welcome back to Administration Login</p>
      </div>
      <div className="form-area">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              status={emailError ? "error" : ""}
            />
            {emailError && (
              <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>{emailError}</div>
            )}
          </div>
          <div className="form-group">
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              status={passwordError ? "error" : ""}
            />
            {passwordError && (
              <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>{passwordError}</div>
            )}
          </div>
          <div className="action ">
            <Button
              className="primary-bg"
              htmlType="submit"
              loading={loading}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginContainer;