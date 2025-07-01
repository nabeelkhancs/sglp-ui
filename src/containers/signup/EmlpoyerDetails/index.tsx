import React from "react";
import { Input, Select, Upload, message } from "antd";
import axios from "axios";
import HTTPMethods from "@/api";

const { Dragger } = Upload;

interface EmployerDetailsProps {
  values: {
    govtID: string;
    designation: string;
    roleType: string;
    deptID: string;
    dptIdDoc: string[];
  };
  errors: {
    govtID?: string;
    roleType?: string;
    designation?: string;
    deptID?: string;
    // dptIdDoc?: string;
  };
  onChange: (data: {
    govtID: string;
    designation: string;
    roleType: string;
    deptID: string;
    dptIdDoc: string[];
  }) => void;
  onFileChange: (files: File[]) => void;
}

const errorStyle = {
  color: "red",
  fontSize: 13,
  background: "transparent",
  padding: 0,
  margin: 0,
};

const EmployerDetails: React.FC<EmployerDetailsProps> = ({
  values,
  errors,
  onChange,
  onFileChange,
}) => {
  
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="input-label mb-1">Government ID</label>
            <Input
              placeholder="Government ID"
              value={values.govtID}
              onChange={(e) => onChange({ ...values, govtID: e.target.value })}
              status={errors.govtID ? "error" : ""}
            />
            {errors.govtID && <div style={errorStyle}>{errors.govtID}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="input-label mb-1">Designation</label>
            <Input
              placeholder="Designation"
              value={values.designation}
              onChange={(e) =>
                onChange({ ...values, designation: e.target.value })
              }
              status={errors.designation ? "error" : ""}
            />
            {errors.designation && (
              <div style={errorStyle}>{errors.designation}</div>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="input-label mb-1">Role Type</label>
            <Select
              className="w-100"
              placeholder="Select"
              value={values.roleType}
              onChange={(val) => onChange({ ...values, roleType: val })}
              options={[
                { value: "OPERATOR", label: "Case Operator" },
                { value: "REVIEWER", label: "Review Manager" },
              ]}
              status={errors.roleType ? "error" : ""}
            />
            {errors.roleType && (
              <div style={errorStyle}>{errors.roleType}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="input-label mb-1">Department ID</label>
            <Input
              placeholder="Department ID"
              value={values.deptID}
              onChange={(e) =>
                onChange({ ...values, deptID: e.target.value })
              }
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
          beforeUpload={() => false}
          onChange={(info) => {
            console.log("File info:", info);
            const files = info.fileList
              .map((f) => f.originFileObj)
              .filter(Boolean) as File[];
            const filenames = files.map((f) => f.name);
            onFileChange(files);
            onChange({ ...values, dptIdDoc: filenames });
          }}
        >
          <p className="ant-upload-text text-white d-flex align-items-center justify-content-center gap-2  fs-14">
            <img src="/icons/upload-icon.svg" alt="Upload" />
            <span className="primary-color">Choose file</span> or drop here
          </p>
        </Dragger>
        {Array.isArray(values.dptIdDoc) && values.dptIdDoc.length > 0 && (
          <ul className="mt-2 text-success">
            {values.dptIdDoc.map((file, index) => (
              <li key={index}>Uploaded: {file}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default EmployerDetails;
