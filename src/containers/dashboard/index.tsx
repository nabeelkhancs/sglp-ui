import { Divider } from "antd";
import CountCards from "../../components/CountCard";
import UsersContainer from "../users";
import Cookies from "js-cookie";
import DataTable2 from "@/components/tables/datatable";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";
import CasesContainer from "../cases";

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
                <Calendar onChange={(val) => setValue(val as Date | null)} value={value} />
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
