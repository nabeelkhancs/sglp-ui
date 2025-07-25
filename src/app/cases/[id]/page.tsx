"use client";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import CourtsCards from "@/components/CourtsCard";
import { courtData } from "@/utils/courtData";
import CasesContainer from "@/containers/cases";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "antd";

const CaseTypePage = () => {

  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const [showTable, setShowTable] = useState(false);
  const [pageName, setPageName] = useState("");

  const handleBack = () => {
    setShowTable(false);
  };

  if ((id == 'supremecourt' || id == 'highcourt' || id == 'districtcourts') && !showTable) {
    return (
      <DashboardLayout>
        <div className="content ">
          <div className="row ">
            {id && courtData[id].map((court: any, idx: any) => (
              <div className="col-md-6 mb-3" key={court.courtName + idx} onClick={() => {
                setShowTable(true);
                setPageName(court.courtName);
              }}>
                <div className="court-card cursor-pointer">
                  <CourtsCards
                    showbadgeCount={false}
                    courtName={court.courtName}
                    courtNumber={0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout>
      {showTable &&
        <div className="mb-3">
          <Button onClick={handleBack} className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1  text-dark fw-medium">
            <span><img src="/icons/chevron-left-black.svg" alt="Back" /></span>Back</Button>
        </div>}
      <CasesContainer caseType={id} pageName={pageName} />
    </DashboardLayout>
  );
}

export default CaseTypePage;