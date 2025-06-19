import DashboardLayout from "@/app/layouts/DashboardLayout";
import CaseViewContainer from "@/containers/cases/view";

const CaseView = () => {
  return (
    <DashboardLayout>
      <CaseViewContainer />
    </DashboardLayout>
  );
}

export default CaseView;