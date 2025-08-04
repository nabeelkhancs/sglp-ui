import CasesContainer from "../cases";

interface SubmittedCaseContainerProps {
  outsideParams?: any;
  pageName?: string;
}

const SubmittedCaseContainer: React.FC<SubmittedCaseContainerProps> = ({ outsideParams, pageName }) => {
  console.log("Outside Params:", outsideParams);
  console.log("Page Name:", pageName);
  return (
    <div className="submitted-cases">
      <div className="content">
        <CasesContainer outsideParams={outsideParams} pageName={pageName} />
      </div>
    </div>
  );
}

export default SubmittedCaseContainer;