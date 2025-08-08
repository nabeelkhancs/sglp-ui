import { Button, Checkbox, Divider, Select } from "antd";
import CustomMonthSelector from "../../components/calendars/CustomCalendar";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { SelectProps } from "antd";
import { getCaseTypeData } from "@/utils/dropdownData";
import { APICalls } from "@/api/api-calls";
import { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import ReportPDF from '../../components/reports/ReportPDF';

const ReportsContainer: React.FC = () => {
  const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isDirectionCase, setIsDirectionCase] = useState<boolean>(false);
  const [isCsCalledInPerson, setIsCsCalledInPerson] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleCaseTypeChange: SelectProps['onChange'] = (value) => {
    console.log(`selected ${value}`);
    setSelectedCaseType(value);
  };

  const handleYearChange = (year: number) => {
    console.log(`selected year ${year}`);
    setSelectedYear(year.toString());
  };

  const handleDirectionChange = (e: CheckboxChangeEvent) => {
    console.log(`direction checked = ${e.target.checked}`);
    setIsDirectionCase(e.target.checked);
  };

  const handleCallToAttentionChange = (e: CheckboxChangeEvent) => {
    console.log(`cs called in person checked = ${e.target.checked}`);
    setIsCsCalledInPerson(e.target.checked);
  };

  const handleMonthsChange = (months: string[]) => {
    setSelectedMonths(months);
  };

  const handleGenerate = async () => {
    const requestData = {
      caseType: selectedCaseType,
      year: selectedYear,
      months: selectedMonths,
      isDirectionCase,
      isCsCalledInPerson,
    };
    
    console.log('Generating report with data:', requestData);
    setLoading(true);
    
    try {
      const response = await APICalls.generateReport(requestData);
      console.log('Report generated successfully:', response);
      setReportData(response);
      
      // Generate PDF and open in new tab
      const pdfDoc = <ReportPDF data={response} />;
      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports">
      <div className="page-title mb-3">
        <h1 className="mb-0">Generate Reports</h1>
      </div>
      <div className="content p-4 bg-white content-wrapper">
        <div className="row align-items-end">
          <div className="col-md-5">
            <CustomMonthSelector onMonthsChange={handleMonthsChange} onYearChange={handleYearChange} />
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="fw-medium text-muted d-block mb-2">Select Case Type</label>
              <Select
                showSearch
                variant="filled"
                placeholder="Select "
                style={{ width: 220 }}
                onChange={handleCaseTypeChange}
                options={getCaseTypeData()}
              />
            </div>
            <Divider />
            <div className="checks mb-4">
              <Checkbox className="w-100 mb-3 fw-medium primary-font" onChange={handleDirectionChange}>
                Select Direction Cases
              </Checkbox>
              <Checkbox className="w-100 fw-medium primary-font" onChange={handleCallToAttentionChange}>
                Select CS Called in Person Cases
              </Checkbox>
            </div>
          </div>

          <div className="col-md-3 text-end">
            <Button 
              className="primary-btn" 
              style={{ height: '40px', width: '170px' }}
              onClick={handleGenerate}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsContainer;