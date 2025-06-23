import React from 'react';
import { Divider } from "antd";
import CountCards from "../../components/CountCard";
import UsersContainer from "../users";
import Cookies from "js-cookie";
import DataTable2 from "@/components/tables/datatable";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";
import CasesContainer from "../cases";

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
  const userType = Cookies.get("userType");
  // if (userType !== "ADMIN") {
    return (
      <div className="manager dashboard-page">
        <div className="page-title mb-3">
          <h1 className="mb-0">Dashboard</h1>
        </div>
        <div className="content ">
          <div className="row">
            <div className="col-md-8">
              <CountCards isManager={true} />
              <div className="content-wrapper">
                <h4 className="fw-medium fs-5">Cases</h4>
                <Divider className="my-2" />
                <CasesContainer dashboardLayout={true} />
              </div>
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
              <div className="bg-white rounded-4">
                <h3 className="fw-semibold fs-5 py-2 px-4">Matters</h3>
                <Divider className="my-0" />
                <div className="notice py-2 px-4">
                  {/* <p className="mb-1">Matters</p> */}
                  <p className="mb-1 fw-bold text-danger">!CS Summoned in person</p>
                  <p className="mb-1">In 3 Days on - 24/11/2025</p>
                  <p className="mb-1">Cp No - 4567 of 2025</p>
                  <p className="mb-1">Kamran khan vs Gos</p>
                  <p className="mb-1">With order date 6/3/2025</p>
                </div>
                <Divider className="my-0" />
                <div className="notice py-2 px-4">
                  {/* <p className="mb-1">Matters</p> */}
                  <p className="mb-1 fw-bold text-danger">!Secretary GA Summond in person</p>
                  <p className="mb-1">IN 7 DAYS-ON 01/07/2025</p>
                  <p className="mb-1">Suit No 3192 of 2025</p>
                  <p className="mb-1">Abdul Khalid V Government of sindh</p>
                  <p className="mb-1">With vide order dated 6.7.2025</p>
                </div>
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
