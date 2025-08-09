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
              <Button className="approve btn-action" icon={<img src="/icons/approve.svg" alt="approve" />}>Approve</Button>
              <Button className="reject btn-action" icon={<img src="/icons/reject-icon.svg" alt="reject" />}>Reject</Button>
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
                  <span className="col-md-7 value fw-medium">{userData.governmentId || 'N/A'}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Email:</span>
                  <span className="col-md-7 value fw-medium">{userData.email || 'N/A'}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Designation:</span>
                  <span className="col-md-7 value fw-medium">{userData.designation || 'N/A'}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Phone Number:</span>
                  <span className="col-md-7 value fw-medium">{userData.phone || 'N/A'}</span>
                </div>
              </>
            )}
          </div>

          <div className="col-md-6">
            <div className="row h-100">
              <div className="col-md-4">
                <span className="labels">Document:</span>
              </div>
              <div className="col-md-8">
                <div className="document h-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserView;