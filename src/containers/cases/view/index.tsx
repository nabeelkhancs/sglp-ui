
"use client";
import React, { useState, useEffect } from "react";
import ReminderModal from "@/components/modal/ReminderModal";
import { Button, Divider } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { APICalls } from "@/api/api-calls";

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
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  // Case logs state
  const [caseLogs, setCaseLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!cpNumber) return;
    const fetchLogs = async () => {
      try {
        const logs = await APICalls.getCaseLogs(cpNumber);
        setCaseLogs(logs);
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
            <span className="fw-medium text-dark">Fri, Nov 15, 10:15 AM (5 Days ago)</span>
          </div>

          <div className="actions d-flex gap-2">
            <Button onClick={showModal} className="reject btn-action" icon={<Image src="/icons/reminder-icon.svg" width={18} height={18} alt="Reminder" />}>Reminder</Button>
          </div>
        </div>

        <div className="p-4 justify-content-between bg-white">
          {caseLogs.length === 0 ? (
            <div>No case logs found.</div>
          ) : (
            caseLogs.map((log, index) => (
              <div className="row" key={log.id || index}>
                <div className="case-card col-md-4">
                  <div className="row mb-3">
                    <span className="col-md-5 labels">Action:</span>
                    <span className="col-md-7 value fw-medium">{log.action}</span>
                  </div>
                  <div className="row mb-3">
                    <span className="col-md-5 labels">Name:</span>
                    <span className="col-md-7 value fw-medium">{log.user?.name || log.userName || '-'}</span>
                  </div>
                  <div className="row mb-3">
                    <span className="col-md-5 labels">Govt ID:</span>
                    <span className="col-md-7 value fw-medium">{log.user?.govtID || log.userGovtID || '-'}</span>
                  </div>
                </div>
                <Divider />
              </div>
            ))
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