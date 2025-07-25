import { Button } from "antd";
import { useRouter } from "next/navigation";
import CaseForm from "@/components/forms/CaseForm";

interface NewCaseContainerProps {
  id?: string;
}

const NewCaseContainer: React.FC<NewCaseContainerProps> = ({ id }) => {
  const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="edit-case">
            <div className="mb-3">
                <Button onClick={handleBack} className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1  text-dark fw-medium">
                    <span><img src="/icons/chevron-left-black.svg" alt="Back" /></span>Back</Button>
            </div>
            <div className="page-title mb-3">
                <h1 className="mb-0">{id ? "Edit Case "+id  : "New Case"}</h1>
            </div>
            <div className="content content-wrapper p-4 bg-white">
                <CaseForm id={id} />
            </div>
            {/* <div className="d-flex justify-content-end mt-4 px-3">
                <Button className="primary-btn" style={{ height: '40px', width: '170px' }}>
                    Submit
                </Button>
            </div> */}
        </div>
    );
}

export default NewCaseContainer;