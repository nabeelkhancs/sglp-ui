'use client'
import DashboardLayout from "@/app/layouts/DashboardLayout"
import CommitteeReportForm from "@/containers/committee/new";

const NewCommittee = () => {
  return (
    <>
      <DashboardLayout>
        <CommitteeReportForm />
      </DashboardLayout>
    </>
  )
}

export default NewCommittee;