import React from "react";
import { Input, Select, Upload } from "antd";
import type { UploadProps } from "antd";

const { Dragger } = Upload;

interface EmployerDetailsProps {
  values: {
    govtID: string;
    designation: string;
    deptID: string;
    dptIdDoc: string;
  };
  errors: {
    govtID?: string;
    designation?: string;
    deptID?: string;
    // dptIdDoc?: string; // No validation for upload document
  };
  onChange: (data: { govtID: string; designation: string; deptID: string; dptIdDoc: string }) => void;
}

const errorStyle = { color: "red", fontSize: 13, background: "transparent", padding: 0, margin: 0 };

const EmployerDetails: React.FC<EmployerDetailsProps> = ({ values, errors, onChange }) => {
  return (
    <>
      <div className="form-group">
        <label className="input-label mb-1">Government ID</label>
        <Input
          placeholder="Government ID"
          value={values.govtID}
          onChange={e => onChange({ ...values, govtID: e.target.value })}
          status={errors.govtID ? "error" : ""}
        />
        {errors.govtID && <div style={errorStyle}>{errors.govtID}</div>}
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="input-label mb-1">Designation</label>
            <Select
              className="w-100"
              placeholder="Select"
              value={values.designation}
              onChange={val => onChange({ ...values, designation: val })}
              options={[
                { value: "OPERATOR", label: "Case Operator" },
                { value: "REVIEWER", label: "Review Manager" }
              ]}
              status={errors.designation ? "error" : ""}
            />
            {errors.designation && <div style={errorStyle}>{errors.designation}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="input-label mb-1">Department ID</label>
            <Input
              placeholder="Department ID"
              value={values.deptID}
              onChange={e => onChange({ ...values, deptID: e.target.value })}
              status={errors.deptID ? "error" : ""}
            />
            {errors.deptID && <div style={errorStyle}>{errors.deptID}</div>}
          </div>
        </div>
      </div>
      <div className="form-group mb-4">
        <label className="input-label mb-1">Documents</label>
        <Dragger
          name="file"
          multiple={false}
          showUploadList={false}
          beforeUpload={() => false} // Prevent auto upload
          onChange={info => {
            // Only update the value, no validation
            const file = info.file;
            onChange({ ...values, dptIdDoc: file.name });
          }}
        >
          <p className="ant-upload-text text-white d-flex align-items-center justify-content-center gap-2  fs-14">
            <img src="/icons/upload-icon.svg" alt="Upload" />
            <span className="primary-color">Choose file</span> or drop here
          </p>
        </Dragger>
        {/* No validation for upload document */}
      </div>
    </>
  );
};

export default EmployerDetails;