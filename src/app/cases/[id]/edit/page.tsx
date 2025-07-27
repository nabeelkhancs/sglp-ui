"use client";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import NewCaseContainer from "@/containers/cases/new";
import { useParams } from "next/navigation";

const EditCase = () => {
    const params = useParams();
    const idParam = params?.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    return (
        <DashboardLayout>
          <NewCaseContainer id={id} />
        </DashboardLayout>
    );
}

export default EditCase;