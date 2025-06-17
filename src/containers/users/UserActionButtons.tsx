import Link from "next/link";
import { CloseCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import Image from "next/image";

interface UserActionButtonsProps {
  status: string;
  id: string;
}

export const UserActionButtons = ({ status, id }: UserActionButtonsProps) => {
  
  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log('Accepted');
  };
  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log('Rejected');
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log('Deleted');
  };

  if (status === 'Pending') {
    return (
      <div className="d-flex align-items-center justify-content-center gap-3">
        <Link href="#" className="table-action d-flex align-items-center gap-2 accept-action" onClick={handleAccept}>
          <Image src="/icons/accept-icon.svg" width={18} height={18} alt="Accept" />Accept
        </Link>
        <Link href="#" className="table-action d-flex align-items-center gap-2 reject-action" onClick={handleReject}>
          <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 28, height: 28, background: 'transparent' }}>
            <CloseCircleOutlined className="reject-anticon" />
          </span>
          Reject
        </Link>
        <Link href="#" className="table-action d-flex align-items-center gap-2 delete-action" onClick={handleDelete}>
          <Image src="/icons/delete-icon.svg" width={18} height={18} alt="Delete" />Delete
        </Link>
      </div>
    );
  }
  if (status === 'Approved' || status === 'Rejected') {
    return (
      <div className="d-flex align-items-center justify-content-center gap-3">
        <Link href={`/users/${id}/view`} className="table-action d-flex align-items-center gap-2 view-action">
          <Image src="/icons/view-icon.svg" width={18} height={18} alt="View" />View
        </Link>
      </div>
    );
  }
  return null;
};
