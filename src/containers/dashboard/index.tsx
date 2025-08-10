import React, { use } from 'react';
import Link from 'next/link';
import { Divider } from "antd";
import CountCards from "../../components/CountCard";
import UsersContainer from "../users";
import Cookies from "js-cookie";
import DataTable2 from "@/components/tables/datatable";
import Calendar from 'react-calendar';
import { useRef } from 'react';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from "react";
import CasesContainer from "../cases";
import CourtsCards from '@/components/CourtsCard';
import AnalyticsChart from '@/components/charts/AnalyticChart';
import DonutChart from '@/components/charts/AnalyticChart2';
import AnalyticsChart2 from '@/components/charts/AnalyticChart2';
import { APICalls } from "@/api/api-calls";
import { Spin, Alert } from "antd";
import { useNotifications } from "@/contexts/NotificationContext";



function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

const DashboardContainer = () => {
  const { notifications, unreadCount, loading: notificationLoading, getDashboardNotifications, markMultipleAsRead } = useNotifications();
  
  const [value, setValue] = useState<Date | null>(new Date());
  useEffect(() => {
    if (value) {
      const formatted = value.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      let attempts = 0;
      const setLabelDate = () => {
        const label = document.querySelector('.react-calendar__navigation__label__labelText--from');
        if (label) {
          label.setAttribute('data-date', formatted);
        } else if (attempts < 10) {
          attempts++;
          setTimeout(setLabelDate, 100);
        }
      };
      setLabelDate();
    }
  }, [value]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardNotificationsCount, setDashboardNotificationsCount] = useState<any>(null);
  const userType = Cookies.get("userType");

  const [redDates, setRedDates] = useState<Date[]>([]);
  const [yellowDates, setYellowDates] = useState<Date[]>([]);
  const [greenDates, setGreenDates] = useState<Date[]>([]);

  useEffect(() => {
    console.log("Dashboard Notifications:", notifications);
    console.log("Unread Count:", unreadCount);
    console.log("Notification Loading:", notificationLoading);
  }, [notifications, unreadCount, notificationLoading]);

  useEffect(() => {
    // Call dashboard notifications count API
    const fetchDashboardNotificationsCount = async () => {
      try {
        const dashboardNotificationsData = await getDashboardNotifications();
        console.log("Dashboard Container - Dashboard Notifications Count:", dashboardNotificationsData);
        setDashboardNotificationsCount(dashboardNotificationsData);
      } catch (error) {
        console.error("Dashboard Container - Failed to fetch dashboard notifications:", error);
      }
    };

    fetchDashboardNotificationsCount();
  }, [getDashboardNotifications]);

  useEffect(() => {
    const reds: Date[] = [];
    const yellows: Date[] = [];
    const greens: Date[] = [];
    if (dashboardData?.cases) {
      dashboardData.cases.forEach((item: any) => {
        if (item.dateOfHearing) {
          const hearingDate = new Date(item.dateOfHearing);
          if (Array.isArray(item.caseStatus) && item.caseStatus.includes('urgent')) {
            reds.push(hearingDate);
          } else if (Array.isArray(item.caseStatus) && item.caseStatus.includes('direction')) {
            yellows.push(hearingDate);
          } else if (Array.isArray(item.caseStatus) && item.caseStatus.includes('csCalledInPerson')) {
            greens.push(hearingDate);
          }
        }
      });
    }
    setRedDates(reds);
    setYellowDates(yellows);
    setGreenDates(greens);
  }, [dashboardData]);

  useEffect(() => {
    setLoading(true);
    APICalls.getDashboardData()
      .then((data) => {
        setDashboardData(data);
        setError(null);
      })
      .catch(() => {
        setDashboardData([]);
        setError("Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);


  const countByCourt = (court: string) => dashboardData?.cases?.filter((item: any) => item.court.includes(court)).length;
  const countBySubject = (subject: string) => dashboardData?.cases?.filter((item: any) => (item.subjectOfApplication || '').includes(subject)).length;

  const countByStatus = (status: string) => dashboardData?.cases?.filter((item: any) => Array.isArray(item.caseStatus) && item.caseStatus.includes(status)).length;

  const supremeCourtCount = countByCourt("supremeCourtOfPakistan");
  const highCourtCount = countByCourt("HighCourt");
  const districtCourtCount = countByCourt("districtCourt");
  const otherCourtsCount = dashboardData?.cases?.filter((item: any) => !item.court.includes("supremeCourtOfPakistan") && !item.court.includes("HighCourt") && !item.court.includes("districtCourt")).length;

  const totalCases = dashboardData?.cases?.length;
  const directionsCount = countByStatus("direction");
  const callForAppearanceCount = countByStatus("csCalledInPerson");
  const committeesCount = dashboardData?.committees?.length || 0;
  const contemptsCount = countBySubject("contemptApplication");
  const complianceStatusCount = countBySubject("compliance");

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

  console.log("dashboardNotificationsCount",dashboardNotificationsCount)

  // Function to handle marking notifications as read when count card is clicked
  const handleCountCardClick = async (category: string) => {
    if (!dashboardNotificationsCount?.categories?.[category]?.unreadIds?.length) {
      return; // No unread notifications to mark
    }

    const unreadIds = dashboardNotificationsCount.categories[category].unreadIds;
    console.log(`Marking ${category} notifications as read:`, unreadIds);
    
    try {
      await markMultipleAsRead(unreadIds);
      console.log(`Successfully marked ${category} notifications as read`);
      
      // Refresh dashboard notifications to update counts
      const updatedData = await getDashboardNotifications();
      setDashboardNotificationsCount(updatedData);
    } catch (error) {
      console.error(`Failed to mark ${category} notifications as read:`, error);
    }
  };

  return (
    <div className="manager dashboard-page">
      {/* <div className="page-title mb-3">
        <h1 className="mb-0">Dashboard</h1>
      </div> */}
      <div className="content ">

        <div className="row mb-34">
          <div className="col-md-3">
            <Link href={`${userType == "ADMIN" ? "/cases/supremecourt" : "/cases/submitted?court=supremecourt"}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="court-card">
                <CourtsCards
                  badgeCount={dashboardNotificationsCount?.supremeCourtCount || 0}
                  courtName="Supreme Courts"
                  courtNumber={supremeCourtCount}
                />
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link href={`${userType == "ADMIN" ? "/cases/highcourt" : "/cases/submitted?court=highcourt"}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="court-card">
                <CourtsCards
                  badgeCount={dashboardNotificationsCount?.highCourtCount || 0}
                  courtName="High Courts"
                  courtNumber={highCourtCount}
                />
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link href={`${userType == "ADMIN" ? "/cases/districtcourts" : "/cases/submitted?court=districtcourts"}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="court-card">
                <CourtsCards
                  badgeCount={dashboardNotificationsCount?.districtCourtCount || 0}
                  courtName="District Courts"
                  courtNumber={districtCourtCount}
                />
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link href={`${userType == "ADMIN" ? "/cases/othercourts" : "/cases/submitted?court=othercourts"}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="court-card">
                <CourtsCards
                  badgeCount={dashboardNotificationsCount?.otherCourtsCount || 0}
                  courtName="Other Courts/Tribunals"
                  courtNumber={otherCourtsCount}
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="row mb-34 count-cards g-4">
          <div className="col-md-4">
            <CountCards
              badgeCount={dashboardNotificationsCount?.totalUnread || 0}
              title='Total Cases of CS'
              // title='TOTAL CASES OF CS'
              caseCount={totalCases}
              cardColor='linear-gradient(90deg, #0050FF 0%, #7FAEF6 100%)'
              link={userType === "ADMIN" ? "/cases" : "/cases/submitted"}
              onClick={() => handleCountCardClick('allCases')}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={dashboardNotificationsCount?.categories?.direction?.unreadCount || 0}
              title='Directions'
              caseCount={directionsCount}
              cardColor='linear-gradient(90deg, #FE0604 0%, #FF937E 100%)'
              link={userType === "ADMIN" ? "/cases/directions" : "/cases/submitted?caseStatus=directions"}
              onClick={() => handleCountCardClick('direction')}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={dashboardNotificationsCount?.categories?.csCalledInPerson?.unreadCount || 0}
              title='Call for Appearance / Urgency'
              caseCount={callForAppearanceCount}
              cardColor='linear-gradient(90deg, #E08303 0%, #E3B94D 100%)'
              link={userType === "ADMIN" ? "/cases/csCalledInPerson" : "/cases/submitted?caseStatus=csCalledInPerson"}
              onClick={() => handleCountCardClick('csCalledInPerson')}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={dashboardNotificationsCount?.categories?.committee?.unreadCount || 0}
              title='Committees / Inquiries'
              caseCount={committeesCount}
              cardColor='linear-gradient(90deg, #3E9069 0%, #35B476 100%)'
              link={userType === "ADMIN" ? "/committee" : "/committee"}
              onClick={() => handleCountCardClick('committee')}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={dashboardNotificationsCount?.categories?.contempt?.unreadCount || 0}
              title='Contempts'
              caseCount={contemptsCount}
              cardColor='linear-gradient(270deg, #B89DE0 0%, #9659F3 100%)'
              link={userType === "ADMIN" ? "/cases/contemptApplication" : "/cases/submitted?subjectOfApplication=contemptApplication"}
              onClick={() => handleCountCardClick('contempt')}
            />
          </div>
          <div className="col-md-4">
            <CountCards
              badgeCount={dashboardNotificationsCount?.categories?.underCompliance?.unreadCount || 0}
              title='Compliance Status'
              caseCount={complianceStatusCount}
              cardColor='linear-gradient(90deg, #00B69E 0%, #5ED5CA 56.5%)'
              link={userType === "ADMIN" ? "/cases/compliance" : "/cases/submitted?subjectOfApplication=compliance"}
              onClick={() => handleCountCardClick('underCompliance')}
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
          <div className="col-md-3" style={{ width: '33%' }}>
            <div className="calendar"  >
              <Calendar
                next2Label={false}
                prev2Label={false}
                onChange={(val) => setValue(val as Date | null)}
                value={value}
                tileClassName={({ date, view }) => {
                  // console.log("redDates", redDates,"yellowDates", yellowDates, "greenDates", greenDates);
                  if (view === 'month') {
                    if (yellowDates.some(d => isSameDay(d, date))) return 'calendar-yellow';
                    if (greenDates.some(d => isSameDay(d, date))) return 'calendar-green';
                    if (redDates.some(d => isSameDay(d, date))) return 'calendar-red';
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
