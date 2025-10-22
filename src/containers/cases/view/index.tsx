
"use client";
import React, { useState, useEffect } from "react";
import ReminderModal from "@/components/modal/ReminderModal";
import { Button, Divider } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { APICalls } from "@/api/api-calls";
import { getSubjectData, getCaseStatusData, getDepartmentData, getCourtData, getCaseTypeData, getRegionData } from "@/utils/dropdownData";

const CaseViewContainer = () => {

  const searchParams = useSearchParams();
  const cpNumber = searchParams.get('cpNumber') || '';
  useEffect(() => {
    if (!cpNumber) return;
    const fetchLogs = async () => {
      try {
        const logs = await APICalls.getCaseLogs(cpNumber);
        console.log('Case Logs:', logs);
      } catch (err) {
        console.error('Error fetching case logs:', err);
      }
    };
    fetchLogs();
  }, [cpNumber]);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const [caseLogs, setCaseLogs] = useState<any[]>([]);
  const [createdDate, setCreatedDate] = useState<string>('');

  const downloadFile = async (filename: string) => {
    if (!filename) return;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(filename)}`;
      window.open(url, '_blank');
    } catch (err) {
      alert('File could not be loaded.');
    }
  };

  const renderFileLinks = (files: string[] | string, logIndex: number) => {
    if (!files) return null;
    const allFiles = Array.isArray(files) ? files : [files];
    let fileList = allFiles;
   
    const getFileUrl = (file: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(file)}`;
    const isImage = (file: string) => /\.(jpg|jpeg|png|gif)$/i.test(file);
    const isPdf = (file: string) => /\.(pdf)$/i.test(file);
    
    return (
      <div className="caseview-file-preview-row">
        {fileList.map((file, idx) => (
          <div key={file + idx}>
            <div
              onClick={async e => {
                e.preventDefault();
                await downloadFile(file);
              }}
              className="caseview-file-preview-thumb"
              title="Click to open preview in new tab"
            >
              {isImage(file) && (
                <img
                  src={getFileUrl(file)}
                  alt={file}
                  className="caseview-file-preview-img"
                />
              )}
              {isPdf(file) && (
                <div className="caseview-file-preview-pdf">
                  <iframe
                    src={getFileUrl(file) + '#toolbar=0&navpanes=0&scrollbar=0&page=1'}
                    title={file}
                    className="caseview-file-preview-iframe"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = nowOnly.getTime() - dateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    const formattedDate = date.toLocaleDateString('en-US', options);

    let daysAgoText;
    if (diffDays === 0) {
      daysAgoText = 'Today';
    } else if (diffDays === 1) {
      daysAgoText = 'Yesterday';
    } else {
      daysAgoText = `${diffDays} Days ago`;
    }

    return `${formattedDate} (${daysAgoText})`;
  };

  useEffect(() => {
    if (!cpNumber) return;
    const fetchLogs = async () => {
      try {
        const logs = await APICalls.getCaseLogs(cpNumber);
        setCaseLogs(logs);

        const createLog = logs.find((log: any) => log.action === 'CREATE_CASE');
        if (createLog && createLog.createdAt) {
          setCreatedDate(formatCreatedDate(createLog.createdAt));
        }

        console.log('Case Logs:', logs);
      } catch (err) {
        console.error('Error fetching case logs:', err);
      }
    };
    fetchLogs();
  }, [cpNumber]);



  return (
    <div className="case-details">
      <div className="mb-3">
        <Button onClick={handleBack} className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1 text-dark fw-medium">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
              <path d="M10.5 5.75L6.75 9.5" stroke="#1e1e1e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6.75 9.5L10.5 13.25" stroke="#1e1e1e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>Back</Button>
      </div>
      <div className="page-title ">
        <h1 className="mb-0">Case #{cpNumber}</h1>
      </div>
      <div className="content">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="me-2 fw-medium ">Created on:</span>
            <span className="fw-medium text-dark">{createdDate || 'Loading...'}</span>
          </div>

        </div>

        <div className="p-4 justify-content-between bg-white">
          {caseLogs.length === 0 ? (
            <div>No case logs found.</div>
          ) : (
            caseLogs.map((log, index) => {
              const getActionText = (action: string) => {
                switch (action) {
                  case 'CREATE_CASE':
                    return 'Case Entered';
                  case 'UPDATE_CASE':
                    return 'Case Updated';
                  case 'CREATE_COMMITTEE':
                    return 'Committee is Created';
                  case 'UPDATE_COMMITTEE':
                    return 'Committee Updated';
                  case 'DELETE_CASE_IMAGE':
                    return 'Case Image Deleted';
                  default:
                    return action;
                }
              };

              const getPayloadFields = (payload: string) => {
                try {
                  const data = JSON.parse(payload);

                  const entries = Object.entries(data)
                    .filter(([key, value]) => {
                      if (key.startsWith('is')) return false;
                      if (key === 'id') return false;
                      if (value === '' || value === null || value === undefined) return false;
                      if (Array.isArray(value) && value.length === 0) return false;
                      return true;
                    });
                    
                  if (entries.length === 0) return [];
                  return entries.map(([key, value]) => {
                    let formattedValue = value;
                    
                    if ((key === 'dateReceived' || key === 'dateOfHearing') && value) {
                      try {
                        const date = new Date(value as string);
                        if (!isNaN(date.getTime())) {
                          const day = date.getDate().toString().padStart(2, '0');
                          const month = (date.getMonth() + 1).toString().padStart(2, '0');
                          const year = date.getFullYear();
                          formattedValue = `${day}/${month}/${year}`;
                        }
                      } catch (e) {}
                    }
                    
                    if (key === 'subjectOfApplication' && value) {
                      try {
                        const subjectOptions = getSubjectData();
                        const foundOption = subjectOptions.find(opt => opt.value === value);
                        formattedValue = foundOption ? foundOption.label : value;
                      } catch (e) {}
                    }
                    
                    if (key === 'caseStatus' && value) {
                      try {
                        const statusOptions = getCaseStatusData();
                        if (Array.isArray(value)) {
                          const formattedStatuses = value.map((status: string) => {
                            const foundOption = statusOptions.find(opt => opt.value === status);
                            return foundOption ? foundOption.label : status;
                          });
                          formattedValue = formattedStatuses;
                        } else {
                          const foundOption = statusOptions.find(opt => opt.value === value);
                          formattedValue = foundOption ? foundOption.label : value;
                        }
                      } catch (e) {}
                    }

                    if (key === 'relativeDepartment' && value) {
                      try {
                        const departmentOptions = getDepartmentData();
                        if (Array.isArray(value)) {
                          const formattedDepartments = value.map((dept: string) => {
                            const foundOption = departmentOptions.find(opt => opt.value === dept);
                            return foundOption ? foundOption.label : dept;
                          });
                          formattedValue = formattedDepartments;
                        } else {
                          const foundOption = departmentOptions.find(opt => opt.value === value);
                          formattedValue = foundOption ? foundOption.label : value;
                        }
                      } catch (e) {}
                    }
                    
                    if (key === 'court' && value) {
                      try {
                        const courtOptions = getCourtData();
                        const foundOption = courtOptions.find(opt => opt.value === value);
                        formattedValue = foundOption ? foundOption.label : value;
                      } catch (e) {}
                    }
                    
                    if (key === 'caseType' && value) {
                      try {
                        const caseTypeOptions = getCaseTypeData();
                        const foundOption = caseTypeOptions.find(opt => opt.value === value);
                        formattedValue = foundOption ? foundOption.label : value;
                      } catch (e) {}
                    }
                    
                    if (key === 'region' && value) {
                      try {
                        const regionOptions = getRegionData();
                        const foundOption = regionOptions.find(opt => opt.value === value);
                        formattedValue = foundOption ? foundOption.label : value;
                      } catch (e) {}
                    }
                    return {
                      label: key === 'cpNumber' ? 'Case Number' : 
                             key === 'tors' ? 'TORs' :
                             key.replace(/([A-Z])/g, ' $1') 
                               .replace(/^./, str => str.toUpperCase()), 
                      value: Array.isArray(formattedValue) ? formattedValue.join(', ') : String(formattedValue),
                      isFile: key === 'uploadedFiles' || key === 'committeeApprovalFile' || key === 'imageIds',
                      originalValue: value
                    };
                  });
                } catch (e) {
                  console.error('Error parsing payload:', e);
                  return [];
                }
              };

              const fields = log.payload ? getPayloadFields(log.payload) : [];
              // If payload is only {id: ...}, hide action/time/username and changes
              if (!fields || fields.length === 0) {
                return null;
              }
              return (
                <div className="row" key={log.id || index}>
                  <div className="case-card col-md-4">
                    <div className="row mb-3">
                      <span className="col-md-5 labels">Action:</span>
                      <span className="col-md-7 value fw-medium">{getActionText(log.action)}</span>
                    </div>
                    <div className="row mb-3">
                      <span className="col-md-5 labels">Time:</span>
                      <span className="col-md-7 value fw-medium">
                        {log.createdAt ? formatCreatedDate(log.createdAt) : '-'}
                      </span>
                    </div>
                    <div className="row mb-3">
                      <span className="col-md-5 labels">User Name:</span>
                      <span className="col-md-7 value fw-medium">{log.user?.name || log.userName || '-'}</span>
                    </div>
                    <div className="row mb-3">
                      <span className="col-md-5 labels">User Govt ID:</span>
                      <span className="col-md-7 value fw-medium">{log.user?.govtID || log.userGovtID || '-'}</span>
                    </div>
                    <div className="row mb-3">
                      <span className="col-md-5 labels">Role Type:</span>
                      <span className="col-md-7 value fw-medium">{log.user?.roleType || '-'}</span>
                    </div>
                  </div>
                  <div className="col-md-3"></div>
                  <div className="case-card col-md-5">
                    <>
                      <div className="row mb-2">
                        <div className="col-md-12">
                          <h6 className="fw-bold mb-2">Changes:</h6>
                        </div>
                      </div>
                      {fields.map((field, fieldIndex) => (
                        <div className="row mb-2" key={fieldIndex}>
                          <span className="col-md-5 labels">{field.label}:</span>
                          <div className="col-md-7">
                            {field.isFile ? (
                              renderFileLinks(field.originalValue as string | string[], index)
                            ) : (
                              <span className="value fw-medium text-truncate" title={field.value}>
                                {field.value}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  </div>
                  <Divider />
                </div>
              );
            })
          )}
        </div>
      </div>
      <ReminderModal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default CaseViewContainer;