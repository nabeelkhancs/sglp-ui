"use client";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import CourtsCards from "@/components/CourtsCard";
import { courtData } from "@/utils/courtData";
import CasesContainer from "@/containers/cases";
import { useParams } from "next/navigation";
import { useState } from "react";

const CaseTypePage = () => {
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const [showTable, setShowTable] = useState(false);
  if ((id == 'supremecourt' || id == 'highcourt' || id == 'districtcourts') && !showTable) {
    return (
      <DashboardLayout>
        <div className="content ">
          <div className="row ">
            {id && courtData[id].map((court: any, idx: any) => (
              <div className="col-md-6 mb-3" key={court.courtName + idx} onClick={() => setShowTable(true)}>
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
      <CasesContainer caseType={id} />
    </DashboardLayout>
  );
}

export default CaseTypePage;