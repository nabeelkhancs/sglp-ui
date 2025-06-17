import dayjs from "dayjs";

export class Validations {
    static validateLogin(email: string, password: string): { emailError: string | null, passwordError: string | null, valid: boolean } {
        let valid = true;
        let emailError: string | null = null;
        let passwordError: string | null = null;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailError = "Email is required";
            valid = false;
        } else if (!emailRegex.test(email)) {
            emailError = "Please enter a valid email address";
            valid = false;
        }

        if (!password) {
            passwordError = "Password is required";
            valid = false;
        } else if (password.length < 6) {
            passwordError = "Password must be at least 6 characters";
            valid = false;
        }

        return { emailError, passwordError, valid };
    }

    static validatePersonalDetails(name: string, cnic: string, email: string) {
        let valid = true;
        let errors: { name?: string; cnic?: string; email?: string } = {};

        if (!name) {
            errors.name = "Name is required";
            valid = false;
        }
        if (!cnic || !/^\d{13}$/.test(cnic)) {
            errors.cnic = "Valid 13-digit CNIC is required";
            valid = false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Valid email is required";
            valid = false;
        }
        return { valid, errors };
    }

    static validateEmployerDetails(govtID: string, designation: string, deptID: string, dptIdDoc: string) {
        let valid = true;
        let errors: { govtID?: string; designation?: string; deptID?: string; dptIdDoc?: string } = {};

        if (!govtID) {
            errors.govtID = "Government ID is required";
            valid = false;
        }
        if (!designation) {
            errors.designation = "Designation is required";
            valid = false;
        }
        if (!deptID) {
            errors.deptID = "Department ID is required";
            valid = false;
        }
        // if (!dptIdDoc) {
        //     errors.dptIdDoc = "Document is required";
        //     valid = false;
        // }
        return { valid, errors };
    }

    static validatePassword(password: string) {
        let valid = true;
        let errors: { password?: string } = {};
        if (!password || password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            valid = false;
        }
        return { valid, errors };
    }

    static validateCaseForm(form: {
        caseTitle: string;
        court: string;
        region: string;
        relativeDepartment: string;
        dateReceived: any;
        dateOfHearing: any;
        caseStatus: string;
        caseRemarks: string;
    }) {
        let valid = true;
        let errors: Partial<Record<string, string>> = {};
        if (!form.caseTitle) { errors.caseTitle = "Case Title is required"; valid = false; }
        if (!form.court) { errors.court = "Court is required"; valid = false; }
        if (!form.region) { errors.region = "Region is required"; valid = false; }
        if (!form.relativeDepartment) { errors.relativeDepartment = "Department is required"; valid = false; }
        if (!form.dateReceived) { errors.dateReceived = "Date Received is required"; valid = false; }
        if (!form.dateOfHearing) { errors.dateOfHearing = "Date of Hearing is required"; valid = false; }
        if (!form.caseStatus) { errors.caseStatus = "Status is required"; valid = false; }
        if (!form.caseRemarks) { errors.caseRemarks = "Remarks are required"; valid = false; }
        return { valid, errors };
    }
}