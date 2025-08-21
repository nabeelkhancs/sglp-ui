import { useEffect, useState } from "react";
import { Input, Select, Button, Upload, message } from "antd";
import { getCourtData } from "@/utils/dropdownData";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import { APICalls } from "@/api/api-calls";
import { Validations } from "@/utils/validations";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import HTTPMethods from "@/api";
import { uploads } from "@/api/communications";

const { TextArea } = Input;
const { Dragger } = Upload;

const statusOptions = [
  { label: "Report Submitted (Interim)", value: "interim" },
  { label: "Report Submitted (Final)", value: "final" },
  { label: "Awaited", value: "awaited" },
];

interface CommitteeReportFormValues {
  id?: number;
  cpNumber: string;
  court: string;
  compositionHeadedBy: string;
  tors: string;
  report: string;
  status: string;
  uploadedFiles: string[];
}

interface CommitteeReportFormProps {
  committeeId?: string | number;
  onSuccess?: () => void;
}

const initialForm: CommitteeReportFormValues = {
  id: undefined,
  cpNumber: "",
  court: "",
  compositionHeadedBy: "",
  tors: "",
  report: "",
  status: "",
  uploadedFiles: [],
};

const CommitteeReportForm: React.FC<CommitteeReportFormProps> = ({ 
  committeeId, 
  onSuccess 
}) => {
  const router = useRouter();
  const [form, setForm] = useState<CommitteeReportFormValues>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CommitteeReportFormValues, string>>>({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [committeeCases, setCommitteeCases] = useState([]);
  const [uploading, setUploading] = useState(false);

  const validate = (): boolean => {
    const { valid, errors } = Validations.validateCommitteeForm(form);
    setErrors(errors);
    return valid;
  };

  const handleChange = (field: keyof CommitteeReportFormValues, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange: UploadProps["onChange"] = async (info) => {
    const { fileList } = info;
    setFiles(fileList);
    
    // Find new files that need to be uploaded
    const newFiles = fileList.filter((file: UploadFile) => 
      file.originFileObj && file.status !== 'done' && file.status !== 'error'
    );
    
    if (!newFiles.length) return;
    
    setUploading(true);
    const formData = new FormData();
    
    for (const file of newFiles) {
      if (file.originFileObj) {
        formData.append("file", file.originFileObj);
      }
    }
    
    try {
      const uploadRes = await HTTPMethods.post(uploads, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const uploadedFilenames = uploadRes?.files?.map((f: any) => f.filename) || [];
      if (uploadedFilenames.length) {
        // Update file status to done
        const updatedFileList: any = fileList.map((file: UploadFile) => {
          if (newFiles.some((newFile: UploadFile) => newFile.uid === file.uid)) {
            return { ...file, status: 'done' };
          }
          return file;
        });
        setFiles(updatedFileList);
        
        // Update form with uploaded filenames
        const existingFiles = form.uploadedFiles || [];
        setForm((prev) => ({ 
          ...prev, 
          uploadedFiles: [...existingFiles, ...uploadedFilenames] 
        }));
        toast.success("Files uploaded successfully");
      } else {
        toast.error("No files uploaded");
      }
    } catch (e) {
      toast.error("Document upload failed");
      // Update file status to error
      const updatedFileList: any = fileList.map((file: UploadFile) => {
        if (newFiles.some((newFile: UploadFile) => newFile.uid === file.uid)) {
          return { ...file, status: 'error' };
        }
        return file;
      });
      setFiles(updatedFileList);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (file: UploadFile) => {
    setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const payload = {
        ...form,
        uploadedFiles: form.uploadedFiles,
      };
      
      if (form.id) {
        // Update existing committee report
        await APICalls.updateCommitteeReport(form.id, payload);
        toast.success("Committee report updated successfully");
      } else {
        // Create new committee report
        await APICalls.createCommitteeReport(payload);
        toast.success("Committee report created successfully");
      }
      
      setForm(initialForm);
      setFiles([]);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/committee");
      }
    } catch (error: any) {
      toast.error(error?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const getComCases = async () => {
    try {
      let res = await APICalls.getCommmitteeCases();
      setCommitteeCases(res || []);
    } catch (error) {
      console.error("Error fetching committee cases:", error);
    }
  }

  useEffect(() => {
    getComCases();
  }, []);

  // Fetch committee data when editing (if committeeId is provided)
  useEffect(() => {
    const fetchCommitteeData = async () => {
      if (!committeeId) return;
      
      try {
        setDataLoading(true);
        const response = await APICalls.getCommitteeReport(Number(committeeId));
        if (response?.data) {
          const committeeData = response.data;
          setForm({
            id: committeeData.id,
            cpNumber: committeeData.cpNumber || "",
            court: committeeData.court || "",
            compositionHeadedBy: committeeData.compositionHeadedBy || "",
            tors: committeeData.tors || "",
            report: committeeData.report || "",
            status: committeeData.status || "",
            uploadedFiles: committeeData.uploadedFiles || [],
          });
          
          // Set existing files for display
          if (committeeData.uploadedFiles?.length) {
            const existingFiles = committeeData.uploadedFiles.map((filename: string, index: number) => ({
              uid: `existing-${index}`,
              name: filename,
              status: 'done' as const,
              url: `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(filename)}`,
            }));
            setFiles(existingFiles);
          }
        }
      } catch (error) {
        console.error("Error fetching committee data:", error);
        toast.error("Failed to load committee data");
      } finally {
        setDataLoading(false);
      }
    };

    fetchCommitteeData();
  }, [committeeId]);

  return (
    <div className="row g-2">
      {dataLoading && (
        <div className="col-12 text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading committee data...</span>
          </div>
          <p className="mt-2 text-muted">Loading committee data...</p>
        </div>
      )}
      
      <div className="col-md-4">
        <div className="form-group">
          <label className="input-label">Case Number</label>
          <Select
            className="w-100"
            placeholder="Select Case Number"
            options={committeeCases || []}
            value={form.cpNumber}
            onChange={(val) => handleChange("cpNumber", val)}
            status={errors.cpNumber ? "error" : undefined}
            disabled={dataLoading}
          />
          {errors.cpNumber && <div className="text-danger fs-12">{errors.cpNumber}</div>}
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
            status={errors.court ? "error" : undefined}
          />
          {errors.court && <div className="text-danger fs-12">{errors.court}</div>}
        </div>
      </div>

      <div className="col-md-4">
        <div className="form-group">
          <label className="input-label">Composition Headed By</label>
          <Input
            placeholder="Headed by"
            value={form.compositionHeadedBy}
            onChange={(e) => handleChange("compositionHeadedBy", e.target.value)}
            status={errors.compositionHeadedBy ? "error" : undefined}
          />
          {errors.compositionHeadedBy && <div className="text-danger fs-12">{errors.compositionHeadedBy}</div>}
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
            status={errors.tors ? "error" : undefined}
            style={{ 
              minHeight: '120px',
              resize: 'vertical',
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          />
          {errors.tors && <div className="text-danger fs-12">{errors.tors}</div>}
        </div>
      </div>

      <div className="col-md-12">
        <div className="form-group">
          <label className="input-label">Report / Response of Committee</label>
          <TextArea
            rows={4}
            placeholder="Committee Response"
            value={form.report}
            onChange={(e) => handleChange("report", e.target.value)}
            status={errors.report ? "error" : undefined}
            style={{ 
              minHeight: '120px',
              resize: 'vertical',
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          />
          {errors.report && <div className="text-danger fs-12">{errors.report}</div>}
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
            status={errors.status ? "error" : undefined}
          />
          {errors.status && <div className="text-danger fs-12">{errors.status}</div>}
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
            disabled={uploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
              showDownloadIcon: true,
            }}
            onPreview={(file) => {
              // This will be replaced with your download API
              window.open(`/api/downloads/${file.name}`, '_blank');
            }}
            onDownload={(file) => {
              // This will be replaced with your download API
              window.open(`/api/downloads/${file.name}`, '_blank');
            }}
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
          disabled={loading}
          loading={loading}
          style={{ height: '40px', width: '170px' }}
        >
          {form.id ? 'Update' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default CommitteeReportForm;
