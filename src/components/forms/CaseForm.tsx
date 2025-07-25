import { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Input, Select, message } from "antd";
const { TextArea } = Input;
import { getCourtData, getDepartmentData, getRegionData, getSubjectData, getCaseTypeData, getCaseStatusData } from "@/utils/dropdownData";
import HTTPMethods from "@/api";
import { cases, uploads } from "@/api/communications";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Dragger from "antd/es/upload/Dragger";
import dayjs from "dayjs";
import { Validations } from "@/utils/validations";
import { toast } from "react-toastify";
import { CaseFormProps, CaseFormValues } from "@/utils/interfaces";
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const initialForm: CaseFormValues = {
  id: undefined,
  cpNumber: "",
  caseNumber: "",
  caseTitle: "",
  caseType: "",
  court: "",
  region: "",
  relativeDepartment: [],
  subjectOfApplication: "",
  dateReceived: null,
  dateOfHearing: null,
  caseStatus: [],
  caseRemarks: "",
  uploadedFiles: [],
  isUrgent: false,
  isCallToAttention: false,
  isCsCalledInPerson: false,
  isContempt: false,
  isShowCause: false,
  committeeApprovalFile: ""
};

const CaseForm: React.FC<CaseFormProps> = ({ id }) => {
  const router = useRouter();
  const [form, setForm] = useState<CaseFormValues>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormValues, string>>>({});
  const [loading, setLoading] = useState(false);
  const [docFiles, setDocFiles] = useState<UploadFile[]>([]);
  const [committeeFile, setCommitteeFile] = useState<UploadFile | null>(null);
  const [uploading, setUploading] = useState(false);

  const userType = Cookies.get("userType");

  const validate = (): boolean => {
    const { valid, errors } = Validations.validateCaseForm(form);
    if (form.subjectOfApplication === "committee" && !committeeFile) {
      errors.committeeApprovalFile = "Committee approval file is required";
    }
    setErrors(errors);
    return valid && (!form.subjectOfApplication || form.subjectOfApplication !== "committee" || !!committeeFile);
  };

  const handleChange = (field: keyof CaseFormValues, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = async (info: any) => {
    const { fileList } = info;
    setDocFiles(fileList);
    
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
        const updatedFileList = fileList.map((file: UploadFile) => {
          if (newFiles.some((newFile: UploadFile) => newFile.uid === file.uid)) {
            return { ...file, status: 'done' };
          }
          return file;
        });
        setDocFiles(updatedFileList);
        
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
      const updatedFileList = fileList.map((file: UploadFile) => {
        if (newFiles.some((newFile: UploadFile) => newFile.uid === file.uid)) {
          return { ...file, status: 'error' };
        }
        return file;
      });
      setDocFiles(updatedFileList);
    } finally {
      setUploading(false);
    }
  };

  const handleCommitteeFileChange = async (info: any) => {
    const { fileList } = info;
    const file = fileList[0];
    
    if (!file || !file.originFileObj) {
      setCommitteeFile(null);
      return;
    }
    
    setCommitteeFile(file);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    
    try {
      const uploadRes = await HTTPMethods.post(uploads, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const uploadedFilename = uploadRes?.files?.[0]?.filename;
      if (uploadedFilename) {
        setCommitteeFile({ ...file, status: 'done' });
        setForm((prev) => ({ ...prev, committeeApprovalFile: uploadedFilename }));
        toast.success("Committee approval file uploaded successfully");
      } else {
        toast.error("Committee file upload failed");
        setCommitteeFile({ ...file, status: 'error' });
      }
    } catch (e) {
      toast.error("Committee file upload error");
      setCommitteeFile({ ...file, status: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    const payload = {
      ...form,
      dateReceived: form.dateReceived ? form.dateReceived.toISOString() : null,
      dateOfHearing: form.dateOfHearing ? form.dateOfHearing.toISOString() : null,
    };
    
    try {
      if (form.id) {
        // Update existing case
        await HTTPMethods.put(`${cases}/${form.id}`, payload);
        toast.success("Case updated successfully");
      } else {
        // Create new case
        await HTTPMethods.post(cases, payload);
        toast.success("Case added successfully");
      }
      
      setForm(initialForm);
      setDocFiles([]);
      setCommitteeFile(null);
      
      const userType = Cookies.get("userType");
      if (userType === "OPERATOR") {
        router.push("/cases/submitted");
      } else if (userType === "REVIEWER") {
        router.push("/cases");
      }
    } catch (error: any) {
      toast.error(error?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      HTTPMethods.get(`${cases}/${Number(id)}`)
        .then((res) => {
          if (res && res.data) {
            const data = res.data;
            setForm({
              ...initialForm,
              ...data,
              dateReceived: data.dateReceived ? dayjs(data.dateReceived) : null,
              dateOfHearing: data.dateOfHearing ? dayjs(data.dateOfHearing) : null,
            });
            
            // Set existing uploaded files
            if (data.uploadedFiles && data.uploadedFiles.length > 0) {
              const existingFiles = data.uploadedFiles.map((filename: string, index: number) => ({
                uid: `existing-${index}`,
                name: filename,
                status: 'done' as const,
                originFileObj: undefined,
              }));
              setDocFiles(existingFiles);
            }
            
            // Set existing committee file
            if (data.committeeApprovalFile) {
              setCommitteeFile({
                uid: 'committee-file',
                name: data.committeeApprovalFile,
                status: 'done' as const,
                originFileObj: undefined,
              });
            }
          }
        })
        .catch(() => {
          toast.error("Failed to fetch case data");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <>
      <div>
        <div className="row g-2">
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Case Number</label>
              <Input
                placeholder="CP Number"
                value={form.cpNumber}
                onChange={e => handleChange("cpNumber", e.target.value)}
                status={errors.cpNumber ? "error" : undefined}
                disabled={userType === "REVIEWER"}
              />
              {errors.cpNumber && <div className="text-danger fs-12">{errors.cpNumber}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Case Title</label>
              <Input
                placeholder="Case Title"
                value={form.caseTitle}
                onChange={e => handleChange("caseTitle", e.target.value)}
                status={errors.caseTitle ? "error" : undefined}
                disabled={userType === "REVIEWER"}
              />
              {errors.caseTitle && <div className="text-danger fs-12">{errors.caseTitle}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Case Type</label>
              <Select
                className="w-100"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                placeholder="Select"
                options={getCaseTypeData()}
                value={form.caseType}
                onChange={val => handleChange("caseType", val)}
                status={errors.caseType ? "error" : undefined}
              />
              {errors.caseType && <div className="text-danger fs-12">{errors.caseType}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Court</label>
              <Select
                className="w-100"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                placeholder="Select"
                options={getCourtData()}
                value={form.court || undefined}
                onChange={val => handleChange("court", val)}
                status={errors.court ? "error" : undefined}
              />
              {errors.court && <div className="text-danger fs-12">{errors.court}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Region / Districts</label>
              <Select
                className="w-100"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                placeholder="Select"
                options={getRegionData()}
                value={form.region || undefined}
                onChange={val => handleChange("region", val)}
                status={errors.region ? "error" : undefined}
              />
              {errors.region && <div className="text-danger fs-12">{errors.region}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Types of Action</label>
              <Select
                className="w-100"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                placeholder="Select"
                options={getSubjectData()}
                value={form.subjectOfApplication || undefined}
                onChange={val => handleChange("subjectOfApplication", val)}
                status={errors.subjectOfApplication ? "error" : undefined}
              />
              {errors.subjectOfApplication && <div className="text-danger fs-12">{errors.subjectOfApplication}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Relevant Department</label>
              <Select
                mode="multiple"
                className="w-100"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                placeholder="Select"
                options={getDepartmentData()}
                value={form.relativeDepartment}
                onChange={val => handleChange("relativeDepartment", val)}
                status={errors.relativeDepartment ? "error" : undefined}
                maxTagCount={1}
                maxTagPlaceholder={omittedValues => `+${omittedValues.length} more`}
                style={{ 
                  minWidth: 0,
                  minHeight: '48px',
                  height: 'auto'
                }}
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  return (
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#f0f0f0',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        margin: '2px',
                        fontSize: '12px',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {label}
                      </span>
                      {closable && (
                        <span 
                          style={{ 
                            marginLeft: '4px', 
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          onClick={onClose}
                        >
                          ×
                        </span>
                      )}
                    </span>
                  );
                }}
              />
              {errors.relativeDepartment && <div className="text-danger fs-12">{errors.relativeDepartment}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Date of Order</label>
              <DatePicker
                className="w-100"
                value={form.dateReceived}
                onChange={val => handleChange("dateReceived", val)}
                status={errors.dateReceived ? "error" : undefined}
                disabled={userType === "REVIEWER"}
              />
              {errors.dateReceived && <div className="text-danger fs-12">{errors.dateReceived}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Date of Hearing</label>
              <DatePicker
                className="w-100"
                value={form.dateOfHearing}
                onChange={val => handleChange("dateOfHearing", val)}
                status={errors.dateOfHearing ? "error" : undefined}
                disabled={userType === "REVIEWER"}
              />
              {errors.dateOfHearing && <div className="text-danger fs-12">{errors.dateOfHearing}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Status</label>
              <Select
                mode="multiple"
                className="w-100"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                placeholder="Select"
                options={getCaseStatusData()}
                value={form.caseStatus}
                onChange={val => handleChange("caseStatus", val)}
                status={errors.caseStatus ? "error" : undefined}
                maxTagCount={1}
                maxTagPlaceholder={omittedValues => `+${omittedValues.length} more`}
                style={{ 
                  minWidth: 0,
                  minHeight: '48px',
                  height: 'auto'
                }}
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  return (
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#f0f0f0',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        margin: '2px',
                        fontSize: '12px',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {label}
                      </span>
                      {closable && (
                        <span 
                          style={{ 
                            marginLeft: '4px', 
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          onClick={onClose}
                        >
                          ×
                        </span>
                      )}
                    </span>
                  );
                }}
              />
              {errors.caseStatus && <div className="text-danger fs-12">{errors.caseStatus}</div>}
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label className="input-label">Remarks / Actions</label>
              <TextArea
                value={form.caseRemarks}
                onChange={e => handleChange("caseRemarks", e.target.value)}
                status={errors.caseRemarks ? "error" : undefined}
                disabled={userType === "REVIEWER"}
                rows={4}
                style={{ 
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
                placeholder="Enter case remarks and actions..."
              />
              {errors.caseRemarks && <div className="text-danger fs-12">{errors.caseRemarks}</div>}
            </div>
          </div>
          {form.subjectOfApplication === "committee" && (
            <div className="col-md-3">
              <div className="form-group">
                <label className="input-label">Committee Approval File</label>
                <Dragger
                  name="file"
                  multiple={false}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    // showDownloadIcon: true,
                  }}
                  beforeUpload={() => false}
                  onChange={handleCommitteeFileChange}
                  fileList={committeeFile ? [committeeFile] : []}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onPreview={(file) => {
                    // This will be replaced with your download API
                    window.open(`/api/downloads/${file.name}`, '_blank');
                  }}
                  onDownload={(file) => {
                    // This will be replaced with your download API
                    window.open(`/api/downloads/${file.name}`, '_blank');
                  }}
                >
                  <p className="ant-upload-text text-dark d-flex align-items-center justify-content-center gap-2  fs-14 fw-medium">
                    <span className="primary-color">Choose file</span> or drop here
                  </p>
                </Dragger>
                {errors.committeeApprovalFile && <div className="text-danger fs-12">{errors.committeeApprovalFile}</div>}
              </div>
            </div>
          )}
          <div className="col-md-12">
            <div className="form-group" style={{ minHeight: '160px' }}>
              <label className="input-label">Documents</label>
              <Dragger
                name="file"
                multiple={true}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                  showDownloadIcon: true,
                }}
                beforeUpload={() => false}
                onChange={handleFileChange}
                fileList={docFiles}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onPreview={(file) => {
                  // This will be replaced with your download API
                  window.open(`/api/downloads/${file.name}`, '_blank');
                }}
                onDownload={(file) => {
                  // This will be replaced with your download API
                  window.open(`/api/downloads/${file.name}`, '_blank');
                }}
              >
                <p className="ant-upload-text text-dark d-flex align-items-center justify-content-center gap-2  fs-14 fw-medium">
                  <span className="primary-color">Choose file</span> or drop here
                </p>
              </Dragger>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center " style={{ justifyContent: 'flex-end' }}>
          <Button
            onClick={handleSubmit}
            className="primary-btn"
            style={{ height: '40px', width: '170px' }}
            loading={loading}
          >
            {form.id ? 'Update' : 'Submit'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default CaseForm;