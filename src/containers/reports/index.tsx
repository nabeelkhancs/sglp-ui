import { Button, Checkbox, Divider, Select } from "antd";
import CustomMonthSelector from "../../components/calendars/CustomCalendar";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { SelectProps } from "antd";
import { getCaseTypeData, getCourtData, getRegionData, getDepartmentData, getCaseStatusData, getSubjectData } from "@/utils/dropdownData";
import { APICalls } from "@/api/api-calls";
import { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import ReportPDF from '../../components/reports/ReportPDF';

const ReportsContainer: React.FC = () => {
  const [selectedCaseTypes, setSelectedCaseTypes] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [reportSections, setReportSections] = useState({
    contemptApplication: false,
    committee: false,
    inquiry: false,
    compliance: false,
    callForAppearanceUrgency: false,
    directions: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleCaseTypeChange: SelectProps['onChange'] = (value) => {
    console.log(`selected ${value}`);
    setSelectedCaseTypes(Array.isArray(value) ? value : [value]);
  };

  const handleYearChange = (year: number) => {
    console.log(`selected year ${year}`);
    setSelectedYear(year.toString());
  };

  const handleReportSectionChange = (section: keyof typeof reportSections) => (e: CheckboxChangeEvent) => {
    console.log(`${section} checked = ${e.target.checked}`);
    setReportSections(prev => ({
      ...prev,
      [section]: e.target.checked
    }));
  };

  const handleMonthsChange = (months: string[]) => {
    setSelectedMonths(months);
  };

  const handleGenerate = async () => {
    // Validation checks
    if (selectedMonths.length === 0) {
      alert('Please select at least one month');
      return;
    }

    // Use the old API format that was working before
    const requestData = {
      caseType: selectedCaseTypes.length > 0 ? selectedCaseTypes[0] : null, // Take first case type for backward compatibility
      year: selectedYear,
      months: selectedMonths,
      isDirectionCase: reportSections.contemptApplication,
      isCsCalledInPerson: reportSections.callForAppearanceUrgency,
      // Add new fields for extended functionality
      reportSections,
      selectedCaseTypes,
      reportTitle: "Legal Case Management Report",
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
      
      // Create fallback data for testing PDF generation
      const fallbackData = {
        totalCases: 0,
        reportTitle: "Legal Case Management Report",
        filters: {
          caseType: selectedCaseTypes[0] || 'All Types',
          caseTypes: selectedCaseTypes,
          year: selectedYear,
          months: selectedMonths,
          isDirectionCase: reportSections.contemptApplication,
          isCsCalledInPerson: reportSections.callForAppearanceUrgency,
          reportSections: reportSections
        },
        cases: []
      };
      
      console.log('Using fallback data for PDF generation:', fallbackData);
      
      try {
        // Generate PDF with fallback data
        const pdfDoc = <ReportPDF data={fallbackData} />;
        const blob = await pdf(pdfDoc).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        alert('Report generated with limited data due to API error.');
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        alert('Failed to generate report. Please check console for errors.');
      }
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
        <div className="row">
          <div className="col-md-5">
            <CustomMonthSelector onMonthsChange={handleMonthsChange} onYearChange={handleYearChange} />
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="fw-medium text-muted d-block mb-2">Select Case Types</label>
              <Select
                mode="multiple"
                showSearch
                variant="filled"
                placeholder="Select case types"
                style={{ width: '100%' }}
                onChange={handleCaseTypeChange}
                options={getCaseTypeData()}
              />
            </div>
            <Divider />
            <div className="checks mb-4">
              <label className="fw-medium text-muted d-block mb-2">Generate Report Sections</label>
              <Checkbox 
                className="w-100 mb-2 fw-medium report-checkbox" 
                onChange={handleReportSectionChange('contemptApplication')}
              >
                Contempt Application
              </Checkbox>
              <Checkbox 
                className="w-100 mb-2 fw-medium report-checkbox" 
                onChange={handleReportSectionChange('committee')}
              >
                Committee
              </Checkbox>
              <Checkbox 
                className="w-100 mb-2 fw-medium report-checkbox" 
                onChange={handleReportSectionChange('inquiry')}
              >
                Inquiry
              </Checkbox>
              <Checkbox 
                className="w-100 mb-2 fw-medium report-checkbox" 
                onChange={handleReportSectionChange('compliance')}
              >
                Compliance
              </Checkbox>
              <Checkbox 
                className="w-100 mb-2 fw-medium report-checkbox" 
                onChange={handleReportSectionChange('callForAppearanceUrgency')}
              >
                Call for Appearance and Urgency Cases
              </Checkbox>
              <Checkbox 
                className="w-100 fw-medium report-checkbox" 
                onChange={handleReportSectionChange('directions')}
              >
                Directions
              </Checkbox>
            </div>
          </div>

          <div className="col-md-3 text-end">
            <Button 
              className="primary-btn" 
              style={{ height: '40px', width: '170px', marginBottom: '10px' }}
              onClick={handleGenerate}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </Button>
            <br />
            <Button 
              className="secondary-btn" 
              style={{ height: '40px', width: '170px' }}
              onClick={() => {
                const testData = {
                  totalCases: 5,
                  reportTitle: "Test Report",
                  filters: {
                    caseTypes: selectedCaseTypes,
                    year: selectedYear,
                    months: selectedMonths.length > 0 ? selectedMonths : ['October'],
                    reportSections: reportSections
                  },
                  cases: [
                    {
                      id: 1,
                      caseTitle: 'Test Case',
                      court: getCourtData()[0]?.value || 'Test Court',
                      region: getRegionData()[0]?.value || 'Test Region',
                      relativeDepartment: [getDepartmentData()[0]?.value || 'Test Department'],
                      subjectOfApplication: getSubjectData()[0]?.value || 'Test Subject',
                      dateReceived: new Date().toISOString(),
                      dateOfHearing: null,
                      caseStatus: [getCaseStatusData()[0]?.value || 'Active'],
                      applicant: 'Test Applicant',
                      respondent: 'Test Respondent',
                      remarks: 'Test Remarks',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      caseType: getCaseTypeData()[0]?.value || 'Test Type',
                      cpNumber: 'TEST001',
                      caseRemarks: 'Test Case Remarks',
                      isUrgent: false,
                      isCallToAttention: false,
                      isCsCalledInPerson: false
                    }
                  ]
                };
                
                pdf(<ReportPDF data={testData} />).toBlob().then(blob => {
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                });
              }}
            >
              Test PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsContainer;