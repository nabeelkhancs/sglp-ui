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
  dateReceived: import("dayjs").Dayjs | null;
  dateOfHearing: import("dayjs").Dayjs | null;
  caseStatus: string;
  caseRemarks: string;
  isUrgent?: boolean;
  isCallToAttention?: boolean;
}