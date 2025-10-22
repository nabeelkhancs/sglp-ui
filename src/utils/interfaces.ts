export interface CaseFormProps {
  id?: string;
}

export interface CaseFormValues {
  id?: number;
  cpNumber: string;
  caseNumber: string;
  caseTitle: string;
  caseType: string;
  court: string;
  region: string;
  relativeDepartment: string[];
  subjectOfApplication: string;
  dateReceived: import("dayjs").Dayjs | null;
  dateOfHearing: import("dayjs").Dayjs | null;
  caseStatus: string[];
  caseRemarks: string;
  uploadedFiles: string[];
  isUrgent?: boolean;
  isCallToAttention?: boolean;
  isCsCalledInPerson?: boolean;
  isContempt?: boolean;
  isShowCause?: boolean;
  committeeApprovalFile: string;
  registry: string;
}

export interface SignupPayload {
  name: string;
  cnic: string;
  email: string;
  designation: string;
  roleType: string;
  dptIdDoc: string[];
  password: string;
  confirmPassword: string;
}