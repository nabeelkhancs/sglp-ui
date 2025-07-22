import { Modal } from 'antd';
import React from 'react';

interface CaseViewModalProps {
  open: boolean;
  onClose: () => void;
  caseData: any;
}

const CaseViewModal: React.FC<CaseViewModalProps> = ({ open, onClose, caseData }) => {
  if (!caseData) return null;
  return (
    <Modal open={open} onCancel={onClose} footer={null} title={<b>Case Details</b>} width={700}>
      <div className="row g-3">
        {Object.entries(caseData).map(([key, value]) => (
          <div className="col-md-6" key={key}>
            <div className="mb-2">
              <span style={{ fontWeight: 'bold' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
              <span className="ms-2">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default CaseViewModal;
