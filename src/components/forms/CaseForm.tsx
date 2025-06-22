import { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Input, Select, message } from "antd";
import { getCourtData, getDepartmentData, getRegionData, getSubjectData } from "@/utils/dropdownData";
import HTTPMethods from "@/api";
import { cases } from "@/api/communications";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Dragger from "antd/es/upload/Dragger";
import dayjs, { Dayjs } from "dayjs";
import { Validations } from "@/utils/validations";
import { toast } from "react-toastify";
import { CaseFormProps, CaseFormValues } from "@/utils/interfaces";

const initialForm: CaseFormValues = {
  id: undefined,
  caseNumber: "",
  caseTitle: "",
  court: "",
  region: "",
  relativeDepartment: "",
  subjectOfApplication: "",
  dateReceived: null,
  dateOfHearing: null,
  caseStatus: "",
  caseRemarks: "",
  isUrgent: false,
  isCallToAttention: false,
};

const CaseForm: React.FC<CaseFormProps> = ({ caseNumber }) => {
  const router = useRouter();
  const [form, setForm] = useState<CaseFormValues>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormValues, string>>>({});
  const [loading, setLoading] = useState(false);

  const userType = Cookies.get("userType");
  const isReviewer = userType === "REVIEWER";

  const validate = (): boolean => {
    const { valid, errors } = Validations.validateCaseForm(form);
    setErrors(errors);
    return valid;
  };

  const handleChange = (field: keyof CaseFormValues, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = {
      ...form,
      dateReceived: form.dateReceived ? form.dateReceived.toISOString() : null,
      dateOfHearing: form.dateOfHearing ? form.dateOfHearing.toISOString() : null,
    };
    
    if (!isReviewer) {
      delete payload.isUrgent;
      delete payload.isCallToAttention;
    }
    try {
      if (form.caseNumber) {
        await HTTPMethods.put(`${cases}/${form.id}`, payload);
        toast.success("Case updated successfully");
      } else {
        await HTTPMethods.post(cases, payload);
        toast.success("Case added successfully");
      }
      setForm(initialForm);
      const userType = Cookies.get("userType");
      if (userType === "OPERATOR") {
        router.push("/cases/submitted");
      } else if (userType === "REVIEWER") {
        router.push("/cases");
      }
    } catch (error: any) {
      toast.error(error?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseNumber) {
      setLoading(true);
      let id = Number(caseNumber.split("-")[2]);
      HTTPMethods.get(`${cases}/${id}`)
        .then((res) => {
          if (res && res.data) {
            const data = res.data;
            setForm({
              id: data.id || "",
              caseNumber: data.caseNumber || "",
              caseTitle: data.caseTitle || "",
              court: data.court || "",
              region: data.region || "",
              relativeDepartment: data.relativeDepartment || "",
              subjectOfApplication: data.subjectOfApplication || "",
              dateReceived: data.dateReceived ? dayjs(data.dateReceived) : null,
              dateOfHearing: data.dateOfHearing ? dayjs(data.dateOfHearing) : null,
              caseStatus: data.caseStatus || "",
              caseRemarks: data.caseRemarks || "",
              isUrgent: data.isUrgent || false,
              isCallToAttention: data.isCallToAttention || false,
            });
          }
        })
        .catch(() => {
          toast.error("Failed to fetch case data");
        })
        .finally(() => setLoading(false));
    }
  }, [caseNumber]);

  return (
    <>
      <div>
        <div className="row g-2">
          {caseNumber && (
            <div className="col-md-3">
              <div className="form-group">
                <label className="input-label">Case Number</label>
                <Input
                  placeholder="Case Number"
                  value={form.caseNumber}
                  disabled={!!caseNumber}
                />
              </div>
            </div>
          )}
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Case Title</label>
              <Input
                placeholder="Case Title"
                value={form.caseTitle}
                onChange={e => handleChange("caseTitle", e.target.value)}
                status={errors.caseTitle ? "error" : undefined}
                disabled={userType === "REVIEWER"}
              />
              {errors.caseTitle && <div className="text-danger fs-12">{errors.caseTitle}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Court</label>
              <Select
                className="w-100"
                placeholder="Select"
                options={getCourtData()}
                value={form.court || undefined}
                onChange={val => handleChange("court", val)}
                status={errors.court ? "error" : undefined}
              />
              {errors.court && <div className="text-danger fs-12">{errors.court}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Region</label>
              <Select
                className="w-100"
                placeholder="Select"
                options={getRegionData()}
                value={form.region || undefined}
                onChange={val => handleChange("region", val)}
                status={errors.region ? "error" : undefined}
              />
              {errors.region && <div className="text-danger fs-12">{errors.region}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Relevant Department</label>
              <Select
                className="w-100"
                placeholder="Select"
                options={getDepartmentData()}
                value={form.relativeDepartment || undefined}
                onChange={val => handleChange("relativeDepartment", val)}
                status={errors.relativeDepartment ? "error" : undefined}
              />
              {errors.relativeDepartment && <div className="text-danger fs-12">{errors.relativeDepartment}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Subject/Type of Application</label>
              <Select
                className="w-100"
                placeholder="Select"
                options={getSubjectData()}
                value={form.subjectOfApplication || undefined}
                onChange={val => handleChange("subjectOfApplication", val)}
                status={errors.subjectOfApplication ? "error" : undefined}
              />
              {errors.subjectOfApplication && <div className="text-danger fs-12">{errors.subjectOfApplication}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Date Received</label>
              <DatePicker
                className="w-100"
                value={form.dateReceived}
                onChange={val => handleChange("dateReceived", val)}
                status={errors.dateReceived ? "error" : undefined}
                disabled={userType === "REVIEWER"}
              />
              {errors.dateReceived && <div className="text-danger fs-12">{errors.dateReceived}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Date of Hearing</label>
              <DatePicker
                className="w-100"
                value={form.dateOfHearing}
                onChange={val => handleChange("dateOfHearing", val)}
                status={errors.dateOfHearing ? "error" : undefined}
                disabled={userType === "REVIEWER"}
              />
              {errors.dateOfHearing && <div className="text-danger fs-12">{errors.dateOfHearing}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Status</label>
              <Select
                className="w-100"
                placeholder="Select"
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'underreview', label: 'Under Review' },
                  { value: 'resolved', label: 'Resolved' },
                ]}
                value={form.caseStatus || undefined}
                onChange={val => handleChange("caseStatus", val)}
                status={errors.caseStatus ? "error" : undefined}
              />
              {errors.caseStatus && <div className="text-danger fs-12">{errors.caseStatus}</div>}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="input-label">Remarks</label>
              <Input
                value={form.caseRemarks}
                onChange={e => handleChange("caseRemarks", e.target.value)}
                status={errors.caseRemarks ? "error" : undefined}
                disabled={userType === "REVIEWER"}
              />
              {errors.caseRemarks && <div className="text-danger fs-12">{errors.caseRemarks}</div>}
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group " style={{ height: '140px' }}>
              <label className="input-label  ">Documents</label>
              <Dragger>
                <p className="ant-upload-text text-dark d-flex align-items-center justify-content-center gap-2  fs-14 fw-medium">
                  <span className="primary-color">Choose file</span> or drop here
                </p>
              </Dragger>
            </div>
          </div>
        </div>
            
        <div className="d-flex align-items-center mt-5 px-3 gap-3" style={{ justifyContent: 'space-between' }}>
          <div className="d-flex align-items-center gap-3">
            {isReviewer && (
            <>
              <Checkbox
                checked={form.isUrgent}
                onChange={e => handleChange("isUrgent", e.target.checked)}
              >Mark as urgent</Checkbox>
              <Checkbox
                checked={form.isCallToAttention}
                onChange={e => handleChange("isCallToAttention", e.target.checked)}
              >Mark call to attention</Checkbox>
            </>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            className="primary-btn"
            style={{ height: '40px', width: '170px' }}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default CaseForm;