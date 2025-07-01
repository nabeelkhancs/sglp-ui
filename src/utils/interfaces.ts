export interface CaseFormProps {
  caseNumber?: string;
}

export interface CaseFormValues {
  id?: number;
  caseNumber: string;
  caseTitle: string;
  court: string;
  region: string;
  relativeDepartment: string;
  subjectOfApplication: string;
  dateReceived: import("dayjs").Dayjs | null;
  dateOfHearing: import("dayjs").Dayjs | null;
  caseStatus: string;
  caseRemarks: string;
  isUrgent?: boolean;
  isCallToAttention?: boolean;
  isCsCalledInPerson?: boolean;
}

export interface SignupPayload {
  name: string;
  cnic: string;
  email: string;
  govtID: string;
  designation: string;
  roleType: string;
  deptID: string;
  dptIdDoc: string[];
  password: string;
  confirmPassword: string;
}