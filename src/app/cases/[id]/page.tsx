"use client";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import CasesContainer from "@/containers/cases";
import { useParams } from "next/navigation";

const CaseTypePage = () => {
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  return (
    <DashboardLayout>
      <CasesContainer caseType={id} />
    </DashboardLayout>
  );
}

export default CaseTypePage;