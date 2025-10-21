import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import React from "react";

interface PasswordScreenProps {
  values: {
    password: string;
    confirmPassword: string;
  };
  errors: {
    password?: string;
    confirmPassword?: string;
  };
  onChange: (field: string, value: string) => void;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ values, errors, onChange }) => {
  return (
    <>
      <div className="form-group">
        <label className="input-label mb-1">Password</label>
        <Input.Password
          style={{ color: "white"}}
          placeholder="Password"
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          value={values.password}
          onChange={e => onChange('password', e.target.value)}
        />
        {errors.password && (
          <div style={{ color: '#ff4d4f', marginTop: 4, background: 'transparent', padding: 0, fontSize: 13 }}>
            {errors.password}
          </div>
        )}
      </div>
      <div className="form-group mb-4">
        <label className="input-label mb-1">Confirm Password</label>
        <Input.Password
          style={{ color: "white"}}
          placeholder="Confirm Password"
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          value={values.confirmPassword}
          onChange={e => onChange('confirmPassword', e.target.value)}
        />
        {errors.confirmPassword && (
          <div style={{ color: '#ff4d4f', marginTop: 4, background: 'transparent', padding: 0, fontSize: 13 }}>
            {errors.confirmPassword}
          </div>
        )}
      </div>
    </>
  );
}

export default PasswordScreen;