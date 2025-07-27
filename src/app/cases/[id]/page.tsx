"use client";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import CourtsCards from "@/components/CourtsCard";
import { courtData } from "@/utils/courtData";
import CasesContainer from "@/containers/cases";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { APICalls } from "@/api/api-calls";

const CaseTypePage = () => {

  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const [showTable, setShowTable] = useState(false);
  const [pageName, setPageName] = useState("");

  const handleBack = () => {
    setShowTable(false);
  };


  const [courtCounts, setCourtCounts] = useState<any[]>([]);
  const [outsideParams, setOutsideParams] = useState<any>();

  const getCaseCourts = async () => {
    try {
      const res = await APICalls.getCaseCourts(id == "supremecourt" ? "registry" : id == "districtcourts" ? "districtcourt" : id);
      setCourtCounts(res || []);
    } catch (err) {
      setCourtCounts([]);
    }
  };

  useEffect(() => {
    if (id === "supremecourt" || id === "highcourt" || id === "districtcourts" || id === "othercourts") {
      getCaseCourts();
    } else {
      if(id === "directions") {
        setOutsideParams({ caseStatus: "direction"  });
      }
      if(id === "contemptApplication") {
        setOutsideParams({ subjectOfApplication: "contemptApplication"  });
      }
      if(id == "compliance"){
        setOutsideParams({ subjectOfApplication: "compliance" });
      }
      if(id == "csCalledInPerson"){
        setOutsideParams({ caseStatus: "csCalledInPerson" });
      }
    }
  }, [id]);


  const [mappedCourts, setMappedCourts] = useState<any[]>([]);

  useEffect(() => {
    if (id === 'supremecourt') {

      const countsMap: Record<string, number> = {};
      courtCounts.forEach((item: any) => {
        if (item.registry) {
          const regKey = item.registry;
          countsMap[regKey] = Number(item.count);
        }
      });
      const courts = (courtData[id] || []).map((court: any) => {

        return {
          ...court,
          count: countsMap[court.courtName] || 0
        };
      });
      setMappedCourts(courts);
    } else if (id === 'highcourt') {
      const countsMap: Record<string, number> = {};
      courtCounts.forEach((item: any) => {
        if (item.court) {
          const regKey = item.court;
          countsMap[regKey] = Number(item.count);
        }
      });

      const courts = (courtData[id] || []).map((court: any) => {
        return {
          ...court,
          count: countsMap[court.key] || 0
        };
      });
      setMappedCourts(courts);
    } else if (id === 'districtcourts') {
      const countsMap: Record<string, number> = {};
      courtCounts.forEach((item: any) => {
        if (item.region) {
          const regKey = item.region;
          countsMap[regKey] = Number(item.count);
        }
      });
      const courts = (courtData[id] || []).map((court: any) => {
        return {
          ...court,
          count: countsMap[court.key] || 0
        };
      });
      setMappedCourts(courts);
    } else if (id === 'othercourts') {
      const countsMap: Record<string, number> = {};
      console.log("Court Counts:", courtCounts);
      courtCounts.forEach((item: any) => {
        if (item.court) {
          const regKey = item.court;
          countsMap[regKey] = Number(item.count);
        }
      });
      console.log("Counts Map:", countsMap);
      const courts = (courtData[id] || []).map((court: any) => {
        return {
          ...court,
          count: countsMap[court.key] || 0
        };
      });
      setMappedCourts(courts);
    } else {
      setMappedCourts(courtCounts);
    }
  }, [courtCounts, id]);

  if ((id == 'supremecourt' || id == 'highcourt' || id == 'districtcourts' || id == 'othercourts') && !showTable) {
    const courts = mappedCourts;
    return (
      <DashboardLayout>
        <div className="content ">
          <div className="row ">
            {courts.map((court: any, idx: any) => (
              <div className="col-md-6 mb-3" key={court.courtName + idx} onClick={() => {
                setShowTable(true);
                setPageName(court.courtName);
                if (id === 'supremecourt') {
                  setOutsideParams({ court: 'supremeCourtOfPakistan', registry: court.courtName });
                } else if (id === 'districtcourts') {
                  setOutsideParams({ court: 'districtCourts', region: court.key });
                } else {
                  setOutsideParams({ court: court.key });
                }
              }}>
                <div className="court-card cursor-pointer">
                  <CourtsCards
                    showbadgeCount={false}
                    courtName={court.courtName}
                    courtNumber={court.count}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      {showTable &&
        <div className="mb-3">
          <Button onClick={handleBack} className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1  text-dark fw-medium">
            <span><img src="/icons/chevron-left-black.svg" alt="Back" /></span>Back</Button>
        </div>}
      <CasesContainer caseType={id} pageName={pageName} outsideParams={outsideParams} />
    </DashboardLayout>
  );
}

export default CaseTypePage;