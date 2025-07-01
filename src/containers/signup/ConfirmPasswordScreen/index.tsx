import React from "react";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface ConfirmPasswordScreenProps {
  value: string;
  error?: string;
  onChange: (data: { confirmPassword: string }) => void;
}

const errorStyle = { color: "red", fontSize: 13, background: "transparent", padding: 0, margin: 0 };

const ConfirmPasswordScreen: React.FC<ConfirmPasswordScreenProps> = ({ value, error, onChange }) => {
  return (
    <>
      <div className="form-group">
        <label className="input-label mb-1">Confirm Password</label>
        <Input.Password
          placeholder="Confirm Password"
          value={value}
          onChange={e => onChange({ confirmPassword: e.target.value })}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          status={error ? "error" : ""}
        />
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    </>
  );
}

export default ConfirmPasswordScreen;
