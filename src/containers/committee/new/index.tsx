import { useRouter } from "next/navigation";
import CommitteeReportForm from "@/components/forms/CommitteeForm";
import { Button } from "antd";

const NewCommitteeContainer = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <>
            <div className="edit-case">
                <div className="mb-3">
                    <Button onClick={handleBack} className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1  text-dark fw-medium">
                        <span><img src="/icons/chevron-left-black.svg" alt="Back" /></span>Back</Button>
                </div>
                <div className="page-title mb-3">
                    <h1 className="mb-0">{"New Committee"}</h1>
                </div>
                <div className="content p-4 bg-white">
                    <CommitteeReportForm />
                </div>
            </div>
        </>
    )
}

export default NewCommitteeContainer;