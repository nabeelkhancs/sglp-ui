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
import { APICalls } from '@/api/api-calls';
// General file download function
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
    // Helper to render file links
    const renderFileLinks = (files: string[] | string) => {
        if (!files) return null;
        const fileList = Array.isArray(files) ? files : [files];
        return fileList.map((file, idx) => (
            <div key={file + idx}>
                <a
                    href="#"
                    onClick={async e => {
                        e.preventDefault();
                        await downloadFile(file);
                    }}
                    style={{ color: '#1677ff', textDecoration: 'underline', cursor: 'pointer' }}
                >
                    {file}
                </a>
            </div>
        ));
    };
    if (!caseData) return null;
    // List of fields to exclude from view
    const excludeFields = [
        'id', 'createdby', 'updatedby', 'isDeleted', 'UpdatedBy', 'DeletedAr', 'CreatedAt', 'UpdatedAt', 'createdAt', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy', 'deletedBy',
        'isUrgent', 'isCallToAttention', 'isCsCalledInPerson', 'isContempt', 'isShowCause'
    ];
    // Helper to get label for dropdown value
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
            case 'subject':
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

    return (
        <Modal open={open} onCancel={onClose} footer={null} title={<b>Case Details</b>} width={700}>
            <div className="row g-3">
                {Object.entries(caseData)
                    .filter(([key]) => !excludeFields.includes(key))
                    .map(([key, value]) => {
                        if (key === 'committeeApprovalFile' || key === 'uploadedFiles') {
                            return (
                                <div className="col-md-6" key={key}>
                                    <div className="mb-2">
                                        <span style={{ fontWeight: 'bold' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                        <span className="ms-2">{renderFileLinks(value as string | string[])}</span>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div className="col-md-6" key={key}>
                                <div className="mb-2">
                                    <span style={{ fontWeight: 'bold' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                    <span className="ms-2">{getLabel(key, value)}</span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </Modal>
    );
};

export default CaseViewModal;
