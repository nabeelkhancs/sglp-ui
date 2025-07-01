import { Button, message } from "antd";
import Link from "next/link";
import PersonalDetails from "./PersonalDetails";
import EmployerDetails from "./EmlpoyerDetails";
import PasswordScreen from "./PasswordScreen";
import { useState } from "react";
import { register, uploads } from "@/api/communications";
import HTTPMethods from "@/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Validations } from "@/utils/validations";
import { SignupPayload } from "@/utils/interfaces";

const SignupContainer = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [docFiles, setDocFiles] = useState<File[]>([]);

  const [form, setForm] = useState<SignupPayload>({
    name: "",
    cnic: "",
    email: "",
    govtID: "",
    designation: "",
    deptID: "",
    dptIdDoc: [],
    password: "",
    roleType: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handlePersonalDetails = (data: {
    name: string;
    cnic: string;
    email: string;
  }) => {
    setForm((prev) => ({ ...prev, ...data }));
  };

  const handleEmployerDetails = (data: {
    govtID: string;
    designation: string;
    deptID: string;
    dptIdDoc: string[];
  }) => {
    setForm((prev) => ({ ...prev, ...data }));
  };

  const handlePassword = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step === 1) {
      const { valid, errors } = Validations.validatePersonalDetails(
        form.name,
        form.cnic,
        form.email
      );
      setErrors(errors);
      if (!valid) return;
      setStep(2);
    } else if (step === 2) {
      const { valid, errors } = Validations.validateEmployerDetails(
        form.govtID,
        form.designation,
        form.deptID,
        form.dptIdDoc
      );
      setErrors(errors);
      if (!valid) return;

      if (docFiles.length) {
        const formData = new FormData();
        docFiles.forEach((file) => formData.append("file", file));

        try {
          const uploadRes = await HTTPMethods.post(uploads, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const uploadedFilenames = uploadRes?.files?.map((f: any) => f.filename) || [];

          if (uploadedFilenames.length) {
            setForm((prev) => ({
              ...prev,
              dptIdDoc: uploadedFilenames,
            }));
          } else {
            toast.error("No files uploaded");
            return;
          }
        } catch (e) {
          toast.error("Document upload failed");
          return;
        }
      }

      setStep(3);
    }
  };

  const handleSubmit = async () => {
    const { valid, errors } = Validations.validatePassword(form.password, form.confirmPassword);
    setErrors(errors);
    if (!valid) return;
    setLoading(true);
    try {
      await HTTPMethods.post(register, form);
      toast.success("Signup successful!");
      router.push("/verification");
    } catch (err: any) {
      toast.error(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      window.location.href = "/";
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="auth-page signup">
      <div className="mb-5">
        <Button
          onClick={handleBack}
          className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1 text-white"
        >
          <span>
            <img src="/icons/chevron-left.svg" alt="Back" />
          </span>
          Back
        </Button>
      </div>
      <div>
        <h2>Create an account</h2>
        <p className="mb-4 fs-6">Enter Following Details to continue</p>
        <div className="steps mb-4 d-flex gap-3">
          <div className="w-50">
            <div className="fw-medium d-flex align-items-center mb-2 ">
              <img src="/icons/personal-detail.svg" alt="" />
              <p className="ms-1 mb-0"> Personal Details</p>
            </div>
            <div className="bar primary-bg"></div>
          </div>
          <div className="w-50">
            <div className="fw-medium d-flex align-items-center mb-2 ">
              <img src="/icons/personal-detail.svg" alt="" />
              <p className="ms-1 mb-0"> Employer Details</p>
            </div>
            <div className={`bar ${step !== 1 ? "primary-bg" : ""}`}></div>
          </div>
        </div>
        <div className="form-area">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 3) handleSubmit();
              else handleNext();
            }}
          >
            {step === 1 && (
              <PersonalDetails
                values={form}
                errors={errors}
                onChange={handlePersonalDetails}
              />
            )}
            {step === 2 && (
              <EmployerDetails
                values={form}
                errors={errors}
                onChange={handleEmployerDetails}
                onFileChange={(files: File[]) => setDocFiles(files)}
              />
            )}
            {step === 3 && (
              <PasswordScreen
                values={{
                  password: form.password,
                  confirmPassword: form.confirmPassword,
                }}
                errors={{
                  password: errors.password,
                  confirmPassword: errors.confirmPassword,
                }}
                onChange={handlePassword}
              />
            )}

            <div className="action mb-4">
              {step !== 3 ? (
                <Button
                  onClick={handleNext}
                  className="primary-bg"
                  htmlType="button"
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="primary-bg"
                  htmlType="submit"
                  loading={loading}
                >
                  Continue
                </Button>
              )}
            </div>
            <p className="fs-6 fw-medium">
              Already have an account?
              <Link href="/login" className="ms-1 primary-color">
                Let’s Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupContainer;
