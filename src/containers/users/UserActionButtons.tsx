import Link from "next/link";
import { CloseCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import Image from "next/image";
import { APICalls } from "@/api/api-calls";
import { useState } from "react";

interface UserActionButtonsProps {
  status: string;
  id: string;
  onStatusUpdate?: () => void; // Optional callback to refresh data
}

export const UserActionButtons = ({ status, id, onStatusUpdate }: UserActionButtonsProps) => {
  const [loading, setLoading] = useState(false);
  
  const handleAccept = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await APICalls.updateUser(Number(id), { status: "Approved" });
      console.log('User approved successfully');
      if (onStatusUpdate) onStatusUpdate(); // Refresh data
    } catch (error) {
      console.error('Failed to approve user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await APICalls.updateUser(Number(id), { status: "Rejected" });
      console.log('User rejected successfully');
      if (onStatusUpdate) onStatusUpdate(); // Refresh data
    } catch (error) {
      console.error('Failed to reject user:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log('Deleted');
  };

  if (status === 'Pending') {
    return (
      <div className="d-flex align-items-center justify-content-center gap-3">
        <Link 
          href="#" 
          className={`table-action d-flex align-items-center gap-2 accept-action ${loading ? 'disabled' : ''}`} 
          onClick={handleAccept}
        >
          <Image src="/icons/accept-icon.svg" width={18} height={18} alt="Accept" />
        </Link>
        <Link 
          href="#" 
          className={`table-action d-flex align-items-center gap-2 reject-action ${loading ? 'disabled' : ''}`} 
          onClick={handleReject}
        >
          <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 28, height: 28, background: 'transparent' }}>
            <CloseCircleOutlined className="reject-anticon" />
          </span>
          
        </Link>
        {/* <Link href="#" className="table-action d-flex align-items-center gap-2 delete-action" onClick={handleDelete}>
          <Image src="/icons/delete-icon.svg" width={18} height={18} alt="Delete" />
        </Link> */}
        <Link href={`/users/${id}/view`} className="table-action d-flex align-items-center gap-2 view-action">
          <Image src="/icons/view-icon.svg" width={18} height={18} alt="View" />
          
        </Link>
      </div>
    );
  }
  if (status === 'Approved' || status === 'Rejected') {
    return (
      <div className="d-flex align-items-center justify-content-center gap-3">
        <Link href={`/users/${id}/view`} className="table-action d-flex align-items-center gap-2 view-action">
          <Image src="/icons/view-icon.svg" width={18} height={18} alt="View" />
        </Link>
      </div>
    );
  }
  return null;
};
