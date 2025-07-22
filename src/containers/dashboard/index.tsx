import React from 'react';
import { Divider } from "antd";
import CountCards from "../../components/CountCard";
import UsersContainer from "../users";
import Cookies from "js-cookie";
import DataTable2 from "@/components/tables/datatable";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from "react";
import CasesContainer from "../cases";
import CourtsCards from '@/components/CourtsCard';
import AnalyticsChart from '@/components/charts/AnalyticChart';
import DonutChart from '@/components/charts/AnalyticChart2';
import AnalyticsChart2 from '@/components/charts/AnalyticChart2';
import { APICalls } from "@/api/api-calls";
import { Spin, Alert } from "antd";

// Highlighted dates
const redDates = [
  new Date(2025, 5, 24), // June 24, 2025
];
const yellowDates = [
  new Date(2025, 6, 1), // July 1, 2025
  new Date(2025, 5, 1), // July 1, 2025
];
const greenDates = [
  new Date(2025, 6, 7), // July 7, 2025
  new Date(2025, 5, 7), // July 7, 2025
];

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

const DashboardContainer = () => {
  const [value, setValue] = useState<Date | null>(new Date());
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userType = Cookies.get("userType");

  useEffect(() => {
    setLoading(true);
    APICalls.getDashboardData()
      .then((data) => {
        setDashboardData(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => {
        setDashboardData([]);
        setError("Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper functions to count cases by type/status/court/region
  const countByCourt = (court: string) => dashboardData.filter((item) => item.court === court).length;
  const countByStatus = (status: string) => dashboardData.filter((item) => (item.caseStatus || []).includes(status)).length;
  const countBySubject = (subject: string) => dashboardData.filter((item) => item.subjectOfApplication === subject).length;

  // Example court names from your sample data
  const supremeCourtCount = countByCourt("supremeCourtOfPakistan");
  const highCourtCount = countByCourt("sindhHighCourtHyderabad");
  const districtCourtCount = countByCourt("districtCourt");
  const otherCourtsCount = countByCourt("otherCourt");

  // Example status/subject counts
  const totalCases = dashboardData.length;
  const directionsCount = countByStatus("underCompliance");
  const callForAppearanceCount = countByStatus("pending");
  const committeesCount = countBySubject("committee");
  const contemptsCount = countByStatus("contempt");
  const complianceStatusCount = countByStatus("committeConstitution");

  // Prepare chart data for graphs
  const chartData = {
    labels: [
      "Directions",
      "Call for Appearance",
      "Committee",
      "Contempt",
      "Status of Compliance",
    ],
    datasets: [
      {
        label: "Case Count",
        data: [
          directionsCount,
          callForAppearanceCount,
          committeesCount,
          contemptsCount,
          complianceStatusCount,
        ],
        backgroundColor: [
          "#ff5b5b",
          "#f9b233",
          "#3ba55d",
          "#b77cf1",
          "#40c4c1",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Prepare court-wise chart data for AnalyticsChart2
  const courtWiseChartData = {
    labels: [
      "Supreme Court",
      "High Court",
      "District Court",
      "Other Courts/Tribunals",
    ],
    datasets: [
      {
        label: "Cases by Court",
        data: [
          supremeCourtCount,
          highCourtCount,
          districtCourtCount,
          otherCourtsCount,
        ],
        backgroundColor: [
          "#2f74ff",
          "#ff5b5b",
          "#f9b233",
          "#3ba55d",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spin size="large" /></div>;
  }
  if (error) {
    return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Alert message={error} type="error" showIcon /></div>;
  }

  return (
    <div className="manager dashboard-page">
      {/* <div className="page-title mb-3">
        <h1 className="mb-0">Dashboard</h1>
      </div> */}
      <div className="content ">

        <div className="row mb-34">
          <div className="col-md-3">
            <div className="court-card">
              <CourtsCards
                badgeCount={supremeCourtCount}
                courtName="Supreme Court"
                courtNumber={supremeCourtCount}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="court-card">
              <CourtsCards
                badgeCount={highCourtCount}
                courtName="High Court"
                courtNumber={highCourtCount}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="court-card">
              <CourtsCards
                badgeCount={districtCourtCount}
                courtName="District Court"
                courtNumber={districtCourtCount}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="court-card">
              <CourtsCards
                badgeCount={otherCourtsCount}
                courtName="Other Courts/Tribunals"
                courtNumber={otherCourtsCount}
              />
            </div>
          </div>
        </div>

        <div className="row mb-34 count-cards g-4">
          <div className="col-md-4">
            <CountCards
              badgeCount={totalCases}
              title='TOTAL CASES OF CS'
              caseCount={totalCases}
              cardColor='linear-gradient(90deg, #0050FF 0%, #7FAEF6 100%)'
              link={userType === "ADMIN" ? "/cases" : "/cases/submitted"}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={directionsCount}
              title='DIRECTIONS'
              caseCount={directionsCount}
              cardColor='linear-gradient(90deg, #FE0604 0%, #FF937E 100%)'
              link={userType === "ADMIN" ? "/cases" : "/cases/submitted"}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={callForAppearanceCount}
              title='CALL FOR APPEARANCE'
              caseCount={callForAppearanceCount}
              cardColor='linear-gradient(90deg, #E08303 0%, #E3B94D 100%)'
              link={userType === "ADMIN" ? "/cases" : "/cases/submitted"}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={committeesCount}
              title='COMMITTEES'
              caseCount={committeesCount}
              cardColor='linear-gradient(90deg, #3E9069 0%, #35B476 100%)'
              link={userType === "ADMIN" ? "/cases" : "/cases/submitted"}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={contemptsCount}
              title='CONTEMPTS'
              caseCount={contemptsCount}
              cardColor='linear-gradient(270deg, #B89DE0 0%, #9659F3 100%)'
              link={userType === "ADMIN" ? "/cases" : "/cases/submitted"}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={complianceStatusCount}
              title='COMPLIANCE STATUS'
              caseCount={complianceStatusCount}
              cardColor='linear-gradient(90deg, #00B69E 0%, #5ED5CA 56.5%)'
              link={userType === "ADMIN" ? "/cases" : "/cases/submitted"}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <AnalyticsChart chartData={chartData} />
          </div>
          <div className="col-md-4">
            <AnalyticsChart2 chartData={courtWiseChartData} />
          </div>
          <div className="col-md-4">
            <div className="calender mb-3"  >
              <Calendar
                onChange={(val) => setValue(val as Date | null)}
                value={value}
                tileClassName={({ date, view }) => {
                  if (view === 'month') {
                    if (redDates.some(d => isSameDay(d, date))) return 'calendar-red';
                    if (yellowDates.some(d => isSameDay(d, date))) return 'calendar-yellow';
                    if (greenDates.some(d => isSameDay(d, date))) return 'calendar-green';
                  }
                  return '';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{``}</style>
    </div>
  );
  // }
  // return (
  //   <div className="dashboard-page">
  //     <div className="page-title mb-3">
  //       <h1 className="mb-0">Dashboard</h1>
  //     </div>
  //     <div className="content">
  //       <CountCards />
  //       <UsersContainer />
  //     </div>
  //   </div>
  // )
};

export default DashboardContainer;
