import { Modal } from 'antd';
import React from 'react';
import {
    getDepartmentData,
    getCourtData,
    getRegionData,
    getCaseTypeData,
    getCaseStatusData,
    getSubjectData
} from '@/utils/dropdownData';
import dayjs from 'dayjs';

import UploadedFilesTable from '../tables/UploadedFilesTable';

export const downloadFile = async (filename: string) => {
    if (!filename) return;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(filename)}`;
        window.open(url, '_blank');
    } catch (err) {
        alert('File could not be loaded.');
    }
};


interface CaseViewModalProps {
    open: boolean;
    onClose: () => void;
    caseData: any;
}

const CaseViewModal: React.FC<CaseViewModalProps> = ({ open, onClose, caseData }) => {

    const [showAllFiles, setShowAllFiles] = React.useState(false);
    const [showFullRemarks, setShowFullRemarks] = React.useState(false);

    const renderFileLinks = (files: string[] | string) => {
        if (!files) return null;
        const allFiles = Array.isArray(files) ? files : [files];
        let fileList = allFiles;
        if (allFiles.length > 2) {
            fileList = allFiles.slice(-2);
        }
        const getFileUrl = (file: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(file)}`;
        const isImage = (file: string) => /\.(jpg|jpeg|png|gif)$/i.test(file);
        const isPdf = (file: string) => /\.(pdf)$/i.test(file);
        return (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {fileList.map((file, idx) => (
                    <div key={file + idx}>
                        <div
                            onClick={async e => {
                                e.preventDefault();
                                await downloadFile(file);
                            }}
                            style={{ display: 'inline-block', cursor: 'pointer' }}
                            title="Click to open preview in new tab"
                        >
                            {isImage(file) && (
                                <img
                                    src={getFileUrl(file)}
                                    alt={file}
                                    style={{ maxWidth: 60, maxHeight: 60, borderRadius: 4, border: '1px solid #eee', objectFit: 'cover' }}
                                />
                            )}
                            {isPdf(file) && (
                                <div style={{ width: 60, height: 60, border: '1px solid #eee', borderRadius: 4, background: '#fafafa', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <iframe
                                        src={getFileUrl(file) + '#toolbar=0&navpanes=0&scrollbar=0&page=1'}
                                        title={file}
                                        style={{ width: 60, height: 60, border: 'none', background: '#fafafa', pointerEvents: 'none' }}
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {/* {allFiles.length > 2 && !showAllFiles && ( */}
                    <button
                        type="button"
                        style={{ marginLeft: 12, background: 'none', border: '1px solid #1677ff', color: '#1677ff', borderRadius: 4, padding: '2px 10px', cursor: 'pointer', fontSize: 13 }}
                        onClick={() => setShowAllFiles(true)}
                    >
                        View All
                    </button>
                {/* )} */}
            </div>
        );
    };
    if (!caseData) return null;
    const excludeFields = [
        'id', 'createdby', 'updatedby', 'isDeleted', 'UpdatedBy', 'DeletedAr', 'CreatedAt', 'UpdatedAt', 'createdAt', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy', 'deletedBy',
        'isUrgent', 'isCallToAttention', 'isCsCalledInPerson', 'isContempt', 'isShowCause', "registry", "caseNumber"
    ];
    const getLabel = (key: string, value: any) => {
        // Format date fields
        if (key.toLowerCase().includes('date') && value) {
            const d = dayjs(value);
            if (d.isValid()) {
                return d.format('DD-MMM-YYYY');
            }
        }
        let options;
        switch (key) {
            case 'relativeDepartment':
                options = getDepartmentData();
                break;
            case 'court':
                options = getCourtData();
                break;
            case 'region':
                options = getRegionData();
                break;
            case 'caseType':
                options = getCaseTypeData();
                break;
            case 'caseStatus':
                options = getCaseStatusData();
                break;
            case 'subjectOfApplication':
                options = getSubjectData();
                break;
            default:
                return Array.isArray(value) ? value.join(', ') : String(value);
        }
        if (Array.isArray(value)) {
            return value.map((v: string) => {
                const found = options.find(opt => opt.value === v);
                return found ? found.label : v;
            }).join(', ');
        } else {
            const found = options.find(opt => opt.value === value);
            return found ? found.label : value;
        }
    };

    if (!caseData) return null;
    // Prepare fields for rendering
    const fieldOrder = ['cpNumber', 'caseType'];
    const allEntries = Object.entries(caseData).filter(([key]) => !excludeFields.includes(key));
    const orderedFields = fieldOrder
        .filter(fieldKey => caseData.hasOwnProperty(fieldKey))
        .map(fieldKey => [fieldKey, caseData[fieldKey]]);
    const remainingFields = allEntries.filter(([key]) => !fieldOrder.includes(key));
    const finalFieldOrder = [...orderedFields, ...remainingFields];

    // Only show the uploaded files table if showAllFiles is true
    return (
        <Modal open={open} onCancel={onClose} footer={null} title={<b>Case Details</b>} width={700}>
            <hr />
            {showAllFiles ? (
                <>
                    <button
                        type="button"
                        style={{ marginBottom: 16, background: 'none', border: '1px solid #1677ff', color: '#1677ff', borderRadius: 4, padding: '4px 14px', cursor: 'pointer', fontSize: 14 }}
                        onClick={() => setShowAllFiles(false)}
                    >
                        Back to details
                    </button>
                    <UploadedFilesTable files={Array.isArray(caseData.uploadedFiles) ? caseData.uploadedFiles : (caseData.uploadedFiles ? [caseData.uploadedFiles] : [])} />
                </>
            ) : (
                <div className="row g-3">
                    {finalFieldOrder.map(([key, value]) => {
                        let displayKey = key;
                        if (key === 'cpNumber') {
                            displayKey = 'Case Number';
                        } else if (key == "uploadedFiles") {
                            displayKey = 'Recent Uploaded Files';
                        } else {
                            displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
                        }

                        if (key === 'committeeApprovalFile' || key === 'uploadedFiles') {
                            return (
                                <div className="col-md-6" key={key}>
                                    <div className="mb-2">
                                        <span style={{ fontWeight: 'bold' }}>{displayKey}:</span>
                                        <span className="ms-2">{renderFileLinks(value as string | string[])}</span>
                                    </div>
                                </div>
                            );
                        }

                        // Special handling for caseRemarks field
                        if (key === 'caseRemarks' && typeof value === 'string' && value.length > 100) {
                            return (
                                <div className="col-md-6" key={key}>
                                    <div className="mb-2">
                                        <span style={{ fontWeight: 'bold' }}>{displayKey}:</span>
                                        <span className="ms-2">
                                            {showFullRemarks ? value : value.slice(0, 100) + '..'}
                                            <button
                                                type="button"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#1677ff',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    marginLeft: 8,
                                                    fontSize: 13
                                                }}
                                                onClick={() => setShowFullRemarks(v => !v)}
                                            >
                                                {showFullRemarks ? 'Show less' : 'Show more'}
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className="col-md-6" key={key}>
                                <div className="mb-2">
                                    <span style={{ fontWeight: 'bold' }}>{displayKey}:</span>
                                    <span className="ms-2">{getLabel(key, value)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Modal>
    );
};

export default CaseViewModal;
