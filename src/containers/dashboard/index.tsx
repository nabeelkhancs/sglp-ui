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
import CourtsCards from '@/components/CourtsCard';

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
        
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="court-card">
              <CourtsCards
                badgeCount={4}
                courtName="Supreme Court"
                courtNumber={48}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="court-card">
              <CourtsCards
                badgeCount={2}
                courtName="High Court"
                courtNumber={70}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="court-card">
              <CourtsCards
                badgeCount={8}
                courtName="District  Court"
                courtNumber={32}
              />
            </div>
          </div>
        </div>

        <div className="row mb-4 count-cards g-4">
          <div className="col-md-4">
           <CountCards  
           badgeCount={13}
           title='Total Cases'
           caseCount={150}
            cardColor='linear-gradient(90deg, #0050FF 0%, #7FAEF6 100%)'
           />
          </div>
          <div className="col-md-4">
           <CountCards  
           badgeCount={35}
           title='Directions '
           caseCount={49}
            cardColor='linear-gradient(90deg, #FE0604 0%, #FF937E 100%)'
           />
          </div>
          <div className="col-md-4">
           <CountCards  
           badgeCount={20}
           title='Call for Appearance'
           caseCount={48}
            cardColor='linear-gradient(90deg, #E08303 0%, #E3B94D 100%)'
           />
          </div>
          <div className="col-md-4">
           <CountCards  
           badgeCount={2}
           title='Committee '
           caseCount={34}
            cardColor='linear-gradient(90deg, #3E9069 0%, #35B476 100%)'
           />
          </div>
          <div className="col-md-4">
           <CountCards  
           badgeCount={2}
           title='Contempt '
           caseCount={26}
            cardColor='linear-gradient(270deg, #B89DE0 0%, #9659F3 100%)'
           />
          </div>
          <div className="col-md-4">
           <CountCards  
           badgeCount={2}
           title='Status of Compliance'
           caseCount={13}
            cardColor='linear-gradient(90deg, #00B69E 0%, #5ED5CA 56.5%)'
           />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4"></div>
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
