import React from "react";
import { Input } from "antd";

interface PersonalDetailsProps {
  values: {
    name: string;
    cnic: string;
    email: string;
  };
  errors: {
    name?: string;
    cnic?: string;
    email?: string;
  };
  onChange: (data: { name: string; cnic: string; email: string }) => void;
}

const errorStyle = { color: "red", fontSize: 13, background: "transparent", padding: 0, margin: 0 };

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ values, errors, onChange }) => {
  return (
    <>
      <div className="form-group">
        <label className="input-label mb-1">Name</label>
        <Input
          placeholder="Name"
          value={values.name}
          onChange={e => onChange({ ...values, name: e.target.value })}
          status={errors.name ? "error" : ""}
        />
        {errors.name && <div style={errorStyle}>{errors.name}</div>}
      </div>
      <div className="form-group">
        <label className="input-label mb-1">CNIC</label>
        <Input
          placeholder="CNIC"
          value={values.cnic}
          onChange={e => onChange({ ...values, cnic: e.target.value })}
          status={errors.cnic ? "error" : ""}
        />
        {errors.cnic && <div style={errorStyle}>{errors.cnic}</div>}
      </div>
      <div className="form-group">
        <label className="input-label mb-1">Email</label>
        <Input
          placeholder="Email"
          value={values.email}
          onChange={e => onChange({ ...values, email: e.target.value })}
          status={errors.email ? "error" : ""}
        />
        {errors.email && <div style={errorStyle}>{errors.email}</div>}
      </div>
    </>
  );
};

export default PersonalDetails;