"use client";
import ReminderModal from "@/components/modal/ReminderModal";
import { Button, Divider } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const CaseViewContainer = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);


  // SAMPLE
  const changeHistory = [
    {
      changedBy: "Maryum Mehmood",
      governmentId: "37405-775557-8",
      date: "13 May, 2025",
      changedDetails: {
        value: "Marked as urgent",
        className: "tag tag-red"
      }
    },
    {
      changedBy: "Fareeha Akram",
      governmentId: "37405-889991-9",
      date: "12 May, 2025",
      changedDetails: {
        value: "Uploaded the file",
        className: "tag tag-blue"
      }
    }
  ];



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
        <h1 className="mb-0">Case #01</h1>
      </div>
      <div className="content">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="me-2 fw-medium ">Created on:</span>
            <span className="fw-medium text-dark">Fri, Nov 15, 10:15 AM (5 Days ago)</span>
          </div>

          <div className="actions d-flex gap-2">
            <Button onClick={showModal} className="reject btn-action" icon={<Image src="/icons/reminder-icon.svg" width={18} height={18} alt="Reminder" />}>Reminder</Button>
          </div>
        </div>

        <div className=" p-4 justify-content-between bg-white">

          {changeHistory.map((item, index) => (
            <div className="row" key={index}>
              <div className="case-card col-md-4">
                <div className="row mb-3">
                  <span className="col-md-5 labels">Changed By:</span>
                  <span className="col-md-7 value fw-medium">{item.changedBy}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Government ID:</span>
                  <span className="col-md-7 value fw-medium">{item.governmentId}</span>
                </div>
                <div className="row mb-3">
                  <span className="col-md-5 labels">Date:</span>
                  <span className="col-md-7 value fw-medium">{item.date}</span>
                </div>
                <div className="row mb-3 align-items-centerz">
                  <span className="col-md-5 labels">Changed Details:</span>
                  <span className={`col-md-7 value fw-medium ${item.changedDetails.className}`}>{item.changedDetails.value}</span>
                </div>
              </div>
              <Divider />
            </div>
          ))}
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