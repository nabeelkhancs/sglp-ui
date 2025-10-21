"use client";
import { APICalls } from "@/api/api-calls";
import { Button, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

const UserView: FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const { id } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const downloadFile = async (filename: string) => {
    if (!filename) return;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(filename)}`;
      window.open(url, '_blank');
    } catch (err) {
      alert('File could not be loaded.');
    }
  };

  const renderFilePreview = (files: string[] | string) => {
    console.log("renderFilePreview called with:", files);
    console.log("files type:", typeof files);
    console.log("files is array:", Array.isArray(files));
    
    if (!files) {
      console.log("No files found, returning no documents message");
      return <div className="text-muted">No documents uploaded</div>;
    }
    
    const allFiles = Array.isArray(files) ? files : [files];
    console.log("allFiles:", allFiles);
    const getFileUrl = (file: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/download?filename=${encodeURIComponent(file)}`;
    const isImage = (file: string) => /\.(jpg|jpeg|png|gif)$/i.test(file);
    const isPdf = (file: string) => /\.(pdf)$/i.test(file);
    
    return (
      <div className="document-preview-container">
        {allFiles.map((file, idx) => (
          <div key={file + idx} className="mb-3">
            <div
              onClick={async (e) => {
                e.preventDefault();
                await downloadFile(file);
              }}
              className="document-preview-item"
              style={{
                cursor: 'pointer',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                padding: '8px',
                backgroundColor: '#fafafa',
                transition: 'all 0.2s ease'
              }}
              title="Click to open file in new tab"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.borderColor = '#bfbfbf';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.borderColor = '#d9d9d9';
              }}
            >
              {isImage(file) && (
                <img
                  src={getFileUrl(file)}
                  alt={file}
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
              )}
              {isPdf(file) && (
                <div style={{ 
                  width: '100%', 
                  height: '200px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <iframe
                    src={getFileUrl(file) + '#toolbar=0&navpanes=0&scrollbar=0&page=1'}
                    title={file}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    loading="lazy"
                  />
                </div>
              )}
              {!isImage(file) && !isPdf(file) && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <img src="/icons/file-icon.svg" alt="File" width={32} height={32} />
                  <span style={{ fontSize: '12px', color: '#666' }}>{file}</span>
                </div>
              )}
              <div style={{ 
                marginTop: '8px', 
                fontSize: '12px', 
                color: '#666',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                Click to download: {file.split('_').pop() || file}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleApprove = async () => {
    setActionLoading(true);
    
    try {
      await APICalls.updateUser(Number(id), { status: "Approved" });
      console.log('User approved successfully');
      // Refresh user data by calling the API again
      refreshUserData();
    } catch (error) {
      console.error('Failed to approve user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    
    try {
      await APICalls.updateUser(Number(id), { status: "Rejected" });
      console.log('User rejected successfully');
      // Refresh user data by calling the API again
      refreshUserData();
    } catch (error) {
      console.error('Failed to reject user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const updatedData = await APICalls.getUserById(Number(id));
      setUserData(updatedData);
      console.log('User data refreshed:', updatedData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();

    // Format the date and time
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Calculate time difference
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    let timeAgo = '';
    if (diffInDays === 0) {
      timeAgo = 'Today';
    } else if (diffInDays === 1) {
      timeAgo = '1 Day ago';
    } else {
      timeAgo = `${diffInDays} Days ago`;
    }

    return `${formattedDate}, ${formattedTime} (${timeAgo})`;
  };

  useEffect(() => {
    if (id) {
      APICalls.getUserById(Number(id))
        .then(data => {
          console.log("Full user data received:", data);
          console.log("dptIdDoc field:", data?.dptIdDoc);
          console.log("dptIdDoc type:", typeof data?.dptIdDoc);
          setUserData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <Spin tip="Loading user data..." />;

  return (
    <div className="profile-details">
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
        <h1 className="mb-0">{userData?.name}</h1>
      </div>
      <div className="content">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="me-2">{`<${userData?.email}>`}</span>
            <span className="fw-medium text-dark">
              {userData?.createdAt ? formatCreatedAt(userData.createdAt) : 'Date not available'}
            </span>
          </div>
          {userData?.status !== "Approved" && (
            <div className="actions d-flex gap-2">
              <Button 
                className="approve btn-action" 
                icon={<img src="/icons/approve.svg" alt="approve" />}
                onClick={handleApprove}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Approve
              </Button>
              <Button 
                className="reject btn-action" 
                icon={<img src="/icons/reject-icon.svg" alt="reject" />}
                onClick={handleReject}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Reject
              </Button>
            </div>
          )}
        </div>

        <div className="row p-4 justify-content-between">
          <div className="col-md-4">
            {userData && (
              <>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Name:</span>
                  <span className="col-md-7 value fw-medium">{userData.name || 'N/A'}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">CNIC:</span>
                  <span className="col-md-7 value fw-medium">{userData.cnic || 'N/A'}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Government ID:</span>
                  <span className="col-md-7 value fw-medium">{userData.govtID || 'N/A'}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Email:</span>
                  <span className="col-md-7 value fw-medium">{userData.email || 'N/A'}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Designation:</span>
                  <span className="col-md-7 value fw-medium">{userData.designation || 'N/A'}</span>
                </div>
                {/* <div className="row mb-3">
                  <span className="col-md-5 labels">Phone Number:</span>
                  <span className="col-md-7 value fw-medium">{userData.phone || 'N/A'}</span>
                </div> */}
              </>
            )}
          </div>

          <div className="col-md-6">
            <div className="row h-100">
              <div className="col-md-4">
                <span className="labels">Document(s):</span>
              </div>
              <div className="col-md-8">
                <div className="document h-100">
                  {renderFilePreview(userData?.dptIdDoc)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserView;