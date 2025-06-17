"use client";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import NewCaseContainer from "@/containers/cases/new";

const NewCase = () => {
    return (
        <DashboardLayout>
          <NewCaseContainer />
        </DashboardLayout>
    );
}

export default NewCase;