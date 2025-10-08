"use client";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import SubmittedCaseContainer from "@/containers/submitted-case/indesx";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { courtData } from "@/utils/courtData";
import { APICalls } from "@/api/api-calls";
import CourtsCards from "@/components/CourtsCard";

function SubmittedCaseInner() {
  const [outsideParams, setOutsideParams] = useState<any>();
  const [courtCounts, setCourtCounts] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [mappedCourts, setMappedCourts] = useState<any[]>([]);
  const [pageName, setPageName] = useState("");

  const searchParams = useSearchParams();
  const court = searchParams.get("court");
  const caseStatus = searchParams.get("caseStatus");
  const subjectOfApplication = searchParams.get("subjectOfApplication");
  const cpNumber = searchParams.get("cpNumber");


  const getCaseCourts = async () => {
    try {
      const res = await APICalls.getCaseCourts(
        court === null
          ? undefined
          : court === "supremecourt"
            ? "registry"
            : court === "districtcourts"
              ? "districtcourt"
              : court
      );
      setCourtCounts(res || []);
    } catch (err) {
      setCourtCounts([]);
    }
  };

  useEffect(() => {
    if (court === "supremecourt" || court === "highcourt" || court === "districtcourts" || court === "othercourts") {
      getCaseCourts();
    }

    if (cpNumber) {
      setOutsideParams({ cpNumber });
    }
    
    if (caseStatus === "directions") {
      setOutsideParams({ caseStatus: "direction" });
    }
    if (subjectOfApplication === "contemptApplication") {
      setOutsideParams({ subjectOfApplication: "contemptApplication" });
    }
    if (subjectOfApplication == "compliance") {
      setOutsideParams({ subjectOfApplication: "compliance" });
    }
    if (caseStatus == "csCalledInPerson") {
      setOutsideParams({ caseStatus: "csCalledInPerson" });
    }
    if (caseStatus == "showcause") {
      setOutsideParams({ caseStatus: "showCause" });
    }
  }, [court, caseStatus, subjectOfApplication]);

useEffect(() => {
  if (court === 'supremecourt') {

    const countsMap: Record<string, number> = {};
    courtCounts.forEach((item: any) => {
      if (item.registry) {
        const regKey = item.registry;
        countsMap[regKey] = Number(item.count);
      }
    });
    const courts = (courtData[court] || []).map((court: any) => {

      return {
        ...court,
        count: countsMap[court.courtName] || 0
      };
    });
    setMappedCourts(courts);
  } else if (court === 'highcourt') {
    const countsMap: Record<string, number> = {};
    courtCounts.forEach((item: any) => {
      if (item.court) {
        const regKey = item.court;
        countsMap[regKey] = Number(item.count);
      }
    });

    const courts = (courtData[court] || []).map((court: any) => {
      return {
        ...court,
        count: countsMap[court.key] || 0
      };
    });
    setMappedCourts(courts);
  } else if (court === 'districtcourts') {
    const countsMap: Record<string, number> = {};
    courtCounts.forEach((item: any) => {
      if (item.region) {
        const regKey = item.region;
        countsMap[regKey] = Number(item.count);
      }
    });
    const courts = (courtData[court] || []).map((court: any) => {
      return {
        ...court,
        count: countsMap[court.key] || 0
      };
    });
    setMappedCourts(courts);
  } else if (court === 'othercourts') {
    const countsMap: Record<string, number> = {};
    courtCounts.forEach((item: any) => {
      if (item.court) {
        const regKey = item.court;
        countsMap[regKey] = Number(item.count);
      }
    });
    const courts = (courtData[court] || []).map((court: any) => {
      return {
        ...court,
        count: countsMap[court.key] || 0
      };
    });
    setMappedCourts(courts);
  } else {
    setMappedCourts(courtCounts);
  }
}, [courtCounts, court]);

if ((court == 'supremecourt' || court == 'highcourt' || court == 'districtcourts' || court == 'othercourts') && !showTable) {
  const courts = mappedCourts;
  console.log("Mapped Courts:", courts);
  return (
    <DashboardLayout>
      <div className="content ">
        <div className="row ">
          {courts.map((crt: any, idx: any) => (
            <div className="col-md-6 mb-3" key={crt.courtName + idx} onClick={() => {
              setShowTable(true);
              setPageName(crt.courtName);
              if (court === 'supremecourt') {
                setOutsideParams({ court: 'supremeCourtOfPakistan', registry: crt.courtName });
              } else if (court === 'districtcourts') {
                setOutsideParams({ court: 'districtCourts', region: crt.key });
              } else {
                setOutsideParams({ court: crt.key });
              }
            }}>
              <div className="court-card cursor-pointer">
                <CourtsCards
                  showbadgeCount={false}
                  courtName={crt.courtName}
                  courtNumber={crt.count}
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
    <SubmittedCaseContainer pageName={pageName} outsideParams={outsideParams} />
  </DashboardLayout>
);
}

export default function SubmittedCase() {
  return (
    <Suspense>
      <SubmittedCaseInner />
    </Suspense>
  );
}