import { useEffect, useState } from "react";
import { Input, Select, Button, Upload } from "antd";
import { getCourtData } from "@/utils/dropdownData";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";

const { TextArea } = Input;
const { Dragger } = Upload;

const statusOptions = [
  { label: "Report Submitted (Interim)", value: "interim" },
  { label: "Report Submitted (Final)", value: "final" },
  { label: "Awaited", value: "awaited" },
];

interface CommitteeReportFormValues {
  cpNumber: string;
  court: string;
  headedBy: string;
  tors: string;
  reportResponse: string;
  status: string;
}

const initialForm: CommitteeReportFormValues = {
  cpNumber: "",
  court: "",
  headedBy: "",
  tors: "",
  reportResponse: "",
  status: "",
};

const CommitteeReportForm: React.FC = () => {
  const [form, setForm] = useState<CommitteeReportFormValues>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleChange = (field: keyof CommitteeReportFormValues, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange: UploadProps["onChange"] = (info) => {
    const updatedFiles = info.fileList.map((file: any) => ({
      ...file,
      status: "done",
    }));
    setFiles(updatedFiles);
  };

  const handleRemoveFile = (file: UploadFile) => {
    setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    console.log("Form Data:", form);
    console.log("Uploaded Files:", files);
    setSubmitting(false);
  };

  return (
    <div className="row g-2">
      <div className="col-md-4">
        <div className="form-group">
          <label className="input-label">CP Number</label>
          <Select
            className="w-100"
            placeholder="Select CP Number"
            options={[]} // TODO: populate with dynamic CP numbers
            value={form.cpNumber}
            onChange={(val) => handleChange("cpNumber", val)}
          />
        </div>
      </div>

      <div className="col-md-4">
        <div className="form-group">
          <label className="input-label">Court</label>
          <Select
            className="w-100"
            placeholder="Select Court"
            options={getCourtData()}
            value={form.court}
            onChange={(val) => handleChange("court", val)}
          />
        </div>
      </div>

      <div className="col-md-4">
        <div className="form-group">
          <label className="input-label">Composition Headed By</label>
          <Input
            placeholder="Headed by"
            value={form.headedBy}
            onChange={(e) => handleChange("headedBy", e.target.value)}
          />
        </div>
      </div>

      <div className="col-md-12">
        <div className="form-group">
          <label className="input-label">TORs</label>
          <TextArea
            rows={4}
            placeholder="Terms of References"
            value={form.tors}
            onChange={(e) => handleChange("tors", e.target.value)}
            className="fixed-textarea"
        />
        </div>
      </div>

      <div className="col-md-12">
        <div className="form-group">
          <label className="input-label">Report / Response of Committee</label>
          <TextArea
            rows={4}
            placeholder="Committee Response"
            value={form.reportResponse}
            onChange={(e) => handleChange("reportResponse", e.target.value)}
            className="fixed-textarea"
          />
        </div>
      </div>

      <div className="col-md-4">
        <div className="form-group">
          <label className="input-label">Status</label>
          <Select
            className="w-100"
            placeholder="Select Status"
            options={statusOptions}
            value={form.status}
            onChange={(val) => handleChange("status", val)}
          />
        </div>
      </div>

      <div className="col-md-12">
        <div className="form-group">
          <label className="input-label">Upload Documents</label>
          <Dragger
            multiple
            fileList={files}
            beforeUpload={() => false}
            onChange={handleFileChange}
            onRemove={handleRemoveFile}
          >
            <p className="ant-upload-text text-dark d-flex align-items-center justify-content-center gap-2 fs-14 fw-medium">
              <span className="primary-color">Choose file</span> or drop here
            </p>
          </Dragger>
        </div>
      </div>

      <div className="col-md-12 text-end mt-3">
        <Button
          className="primary-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CommitteeReportForm;
