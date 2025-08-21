'use client';

import DashboardLayout from "@/app/layouts/DashboardLayout";
import CommitteeReportForm from "@/components/forms/CommitteeForm";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommitteeEditPageProps {
  params: { id: string };
}

const CommitteeEditPage = ({ params }: CommitteeEditPageProps) => {
  const [committeeId, setCommitteeId] = useState<string>('');
  const router = useRouter();
  
  useEffect(() => {
    // Get the committee ID from URL parameters
    if (params?.id) {
      setCommitteeId(params.id);
      console.log('Committee ID:', params.id);
    }
  }, [params]);

  const handleSuccess = () => {
    // Navigate back to committee list or show success message
    router.push('/committee');
  };

  return (
    <div>
     
     <DashboardLayout>
        <div className="content">
          <h1>Edit Committee</h1>
          {committeeId && (
            <CommitteeReportForm 
              committeeId={committeeId}
              onSuccess={handleSuccess}
            />
          )}
          {!committeeId && (
            <div>Loading committee data...</div>
          )}
        </div>
      </DashboardLayout>
    </div>
  );
};
export default CommitteeEditPage;