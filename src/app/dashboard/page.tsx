"use client";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import DashboardContainer from "@/containers/dashboard";

const dashboard = () => {
  return (
    <DashboardLayout>
        <DashboardContainer />
    </DashboardLayout>
  );
}

export default dashboard;