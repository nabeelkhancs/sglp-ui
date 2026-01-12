import { Modal, DatePicker, Button } from 'antd';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { APICalls } from '@/api/api-calls';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

interface ExportDataModalProps {
  open: boolean;
  onClose: () => void;
}

const ExportDataModal: React.FC<ExportDataModalProps> = ({ open, onClose }) => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      setLoading(true);
      try {
        const result = await APICalls.getCaseReport(startDate, endDate);
        console.log('Case Report Data:', result);
        
        // Column mapping
        const columnMapping: Record<string, string> = {
          'id': 'ID',
          'cpNumber': 'Case Number',
          'fileNumber': 'File Number',
          'caseTitle': 'Case Title',
          'caseType': 'Case type',
          'court': 'Court',
          'region': 'Region',
          'dateReceived': 'Date of Order',
          'dateOfHearing': 'Date of Hearing',
          'caseStatus': 'Status',
          'relativeDepartment': 'Relevant Department',
          'subjectOfApplication': 'Types of Action',
          'caseRemarks': 'Remarks'
        };
        
        // Transform data with new column names
        const transformedData = result?.map((row: any) => {
          const newRow: Record<string, any> = {};
          Object.keys(columnMapping).forEach(key => {
            const value = row[key];
            newRow[columnMapping[key]] = Array.isArray(value) ? value.join(', ') : (value || '');
          });
          return newRow;
        }) || [];
        
        // Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(transformedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Case Report');
        
        // Generate Excel file and download
        const fileName = `Case_Report_${startDate}_to_${endDate}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        
        onClose();
      } catch (error) {
        console.error('Error fetching case report:', error);
        alert('Failed to fetch case report data');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      title="Please select date range to export data"
    >
      <div className="p-3">
        <div className="form-group mb-4">
          <label className="input-label fw-semibold mb-2">Select Date Range</label>
          <RangePicker
            className="w-100"
            style={{ height: 48 }}
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="DD-MM-YYYY"
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <Button onClick={onClose} className="cancel-btn-outline">
            Cancel
          </Button>
          <Button
            type="primary"
            className='primary-btn'
            onClick={handleExport}
            disabled={!dateRange || !dateRange[0] || !dateRange[1]}
            loading={loading}
          >
            Export
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportDataModal;
