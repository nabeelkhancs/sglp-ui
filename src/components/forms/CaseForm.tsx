import { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Input, Select, message, Upload } from "antd";
const { TextArea } = Input;
import { getCourtData, getDepartmentData, getRegionData, getSubjectData, getCaseTypeData, getCaseStatusData } from "@/utils/dropdownData";
import HTTPMethods from "@/api";
import { APICalls } from "@/api/api-calls";
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
  committeeApprovalFile: "",
  registry: ""
};

const CaseForm: React.FC<CaseFormProps> = ({ id }) => {
  const router = useRouter();
  const [form, setForm] = useState<CaseFormValues>(initialForm);
  const [originalForm, setOriginalForm] = useState<CaseFormValues>(initialForm); // Track original values
  const [updatedFields, setUpdatedFields] = useState<Set<keyof CaseFormValues>>(new Set()); // Track updated fields
  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormValues, string>>>({});
  const [loading, setLoading] = useState(false);
  const [docFiles, setDocFiles] = useState<UploadFile[]>([]);
  const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]); // Track deleted file IDs
  const [committeeFile, setCommitteeFile] = useState<UploadFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState<string[]>([]); // Track newly uploaded files

  const userType = Cookies.get("userType");

  const validate = (): boolean => {
    const { valid, errors } = Validations.validateCaseForm(form);
    if (form.subjectOfApplication === "committee" && !committeeFile) {
      errors.committeeApprovalFile = "Committee approval file is required";
    }
    
    if (form.court === "supremeCourtOfPakistan" && !form.registry) {
      errors.registry = "Registry is required for Supreme Court";
    }
    setErrors(errors);
    return valid && (!form.subjectOfApplication || form.subjectOfApplication !== "committee" || !!committeeFile) && (form.court !== "supremeCourtOfPakistan" || !!form.registry);
  };

  const handleChange = (field: keyof CaseFormValues, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    
    
    if (id) {
      setUpdatedFields(prev => new Set(prev).add(field));
    }
  };

  const validateFileType = (file: RcFile): boolean => {
    const audioVideoRegex = /\.(mp3|wav|flac|aac|ogg|wma|m4a|mp4|avi|mkv|mov|wmv|flv|webm|m4v|3gp)$/i;
    if (audioVideoRegex.test(file.name)) {
      toast.error(`${file.name} - Audio and video files are not allowed`);
      return false;
    }
    return true;
  };

  const handleFileChange = async (info: any) => {
    const { fileList, file } = info;
    // Detect removed files (only for files that have a name and no originFileObj, i.e., already uploaded)
    if (info.file.status === 'removed' && file && !file.originFileObj && file.name) {
      setDeletedFileIds(prev => {
        // Only add if not already present
        if (!prev.includes(file.name)) {
          return [...prev, file.name];
        }
        return prev;
      });
    }
    // Files are already validated in beforeUpload, so we can use fileList directly
    const validFileList = fileList;
    setDocFiles(validFileList);
    const newFiles = validFileList.filter((file: UploadFile) => 
      file.originFileObj && 
      file.status !== 'done' && 
      file.status !== 'error' && 
      file.status !== 'uploading' // Prevent re-uploading files that are already uploading
    );
    if (!newFiles.length) return;
    // Mark files as uploading to prevent duplicate uploads
    const uploadingFileList = validFileList.map((file: UploadFile) => {
      if (newFiles.some((newFile: UploadFile) => newFile.uid === file.uid)) {
        return { ...file, status: 'uploading' as const };
      }
      return file;
    });
    setDocFiles(uploadingFileList);
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
        const updatedFileList = fileList.map((file: UploadFile) => {
          if (newFiles.some((newFile: UploadFile) => newFile.uid === file.uid)) {
            return { ...file, status: 'done' };
          }
          return file;
        });
        setDocFiles(updatedFileList);
        const existingFiles = form.uploadedFiles || [];
        setForm((prev) => ({ 
          ...prev, 
          uploadedFiles: [...existingFiles, ...uploadedFilenames] 
        }));
        // Track newly uploaded files (only for edit mode)
        if (id) {
          setNewlyUploadedFiles(prev => [...prev, ...uploadedFilenames]);
          setUpdatedFields(prev => new Set(prev).add('uploadedFiles'));
        }
        toast.success("Files uploaded successfully");
      } else {
        toast.error("No files uploaded");
      }
    } catch (e) {
      toast.error("Document upload failed");
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
    
    // File type already validated in beforeUpload
    
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
        
        if (id) {
          setUpdatedFields(prev => new Set(prev).add('committeeApprovalFile'));
        }
        
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
    let payload: any;
    // If there are deleted files and we're updating, call the delete API first
    if (form.id && deletedFileIds.length > 0) {
      try {
        await APICalls.deleteCaseImages(form.id, deletedFileIds);
        setDeletedFileIds([]); // Clear after successful delete
      } catch (err) {
        toast.error("Failed to delete removed files");
        setLoading(false);
        return;
      }
    }
    if (form.id) {
      payload = { id: form.id } as any;
      updatedFields.forEach(field => {
        if (field === 'dateReceived') {
          payload[field] = form.dateReceived ? form.dateReceived.toISOString() : null;
        } else if (field === 'dateOfHearing') {
          payload[field] = form.dateOfHearing ? form.dateOfHearing.toISOString() : null;
        } else if (field === 'uploadedFiles') {
          // Only send newly uploaded files, not all files
          payload[field] = newlyUploadedFiles;
        } else {
          payload[field] = form[field];
        }
      });
      console.log('Update payload (only changed fields):', payload);
      console.log('Updated fields:', Array.from(updatedFields));
      console.log('Newly uploaded files:', newlyUploadedFiles);
    } else {
      payload = {
        ...form,
        dateReceived: form.dateReceived ? form.dateReceived.toISOString() : null,
        dateOfHearing: form.dateOfHearing ? form.dateOfHearing.toISOString() : null,
      };
      console.log('Create payload (all fields):', payload);
    }
    try {
      if (form.id) {
        await HTTPMethods.put(`${cases}/${form.id}`, payload);
        toast.success("Case updated successfully");
      } else {
        await HTTPMethods.post(cases, payload);
        toast.success("Case added successfully");
      }
      setForm(initialForm);
      setOriginalForm(initialForm);
      setUpdatedFields(new Set());
      setNewlyUploadedFiles([]); // Reset newly uploaded files
      setDocFiles([]);
      setCommitteeFile(null);
      setDeletedFileIds([]);
      // const userType = Cookies.get("userType");
      // if (userType === "OPERATOR") {
        window.location.href = "/cases/submitted";
      // } else if (userType === "REVIEWER") {
      //   window.location.href = "/cases";
      // }
    } catch (error: any) {
      toast.error(error?.message || error || "Submission failed");
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
            const formData = {
              ...initialForm,
              ...data,
              dateReceived: data.dateReceived ? dayjs(data.dateReceived) : null,
              dateOfHearing: data.dateOfHearing ? dayjs(data.dateOfHearing) : null,
            };
            
            setForm(formData);
            setOriginalForm(formData);
            setUpdatedFields(new Set());
            // Reset newly uploaded files when loading existing case
            setNewlyUploadedFiles([]);
            
            if (data.uploadedFiles && data.uploadedFiles.length > 0) {
              const existingFiles = data.uploadedFiles.map((filename: string, index: number) => ({
                uid: `existing-${index}`,
                name: filename,
                status: 'done' as const,
                originFileObj: undefined,
              }));
              setDocFiles(existingFiles);
            }
            
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
                placeholder="Case Number"
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
                onChange={val => {
                  handleChange("court", val);
                  if (val !== "supremeCourtOfPakistan") {
                    handleChange("registry", "");
                  }
                }}
                status={errors.court ? "error" : undefined}
              />
              {errors.court && <div className="text-danger fs-12">{errors.court}</div>}
            </div>
          </div>
          {form.court === "supremeCourtOfPakistan" && (
            <div className="col-md-3">
              <div className="form-group">
                <label className="input-label">Registry</label>
                <Select
                  className="w-100"
                  placeholder="Select Registry"
                  options={[
                    { label: "Main Registry – Islamabad", value: "Main Registry – Islamabad" },
                    { label: "Karachi Registry", value: "Karachi Registry" },
                    { label: "Other Branches Registry", value: "Other Branches Registry" },
                  ]}
                  value={form.registry || undefined}
                  onChange={val => handleChange("registry", val)}
                  status={errors.registry ? "error" : undefined}
                />
                {errors.registry && <div className="text-danger fs-12">{errors.registry}</div>}
              </div>
            </div>
          )}
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
                  beforeUpload={(file) => {
                    // Validate file type - if invalid, prevent adding to file list
                    const isValid = validateFileType(file);
                    return isValid ? false : Upload.LIST_IGNORE; // false = add to list but don't auto-upload, LIST_IGNORE = don't add to list
                  }}
                  onChange={handleCommitteeFileChange}
                  fileList={committeeFile ? [committeeFile] : []}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                  onPreview={(file) => {
                    window.open(`/api/downloads/${file.name}`, '_blank');
                  }}
                  onDownload={(file) => {
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
                id="documents"
                name="file"
                multiple={true}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                }}
                beforeUpload={(file) => {
                  // Validate file type - if invalid, prevent adding to file list
                  const isValid = validateFileType(file);
                  return isValid ? false : Upload.LIST_IGNORE; // false = add to list but don't auto-upload, LIST_IGNORE = don't add to list
                }}
                onChange={handleFileChange}
                fileList={docFiles}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                onPreview={(file) => {
                  window.open(`/api/downloads/${file.name}`, '_blank');
                }}
                onDownload={(file) => {
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