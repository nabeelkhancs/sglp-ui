import React, { useState } from 'react';
import { Select, Button, Row, Col } from 'antd';

const { Option } = Select;

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const generateYears = () => {
  const years = [];
  for (let year = 2001; year <= 2050; year++) {
    years.push(year);
  }
  return years;
};

const CustomMonthSelector = ({ onMonthsChange, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonths, setSelectedMonths] = useState([]);

  const handleYearChange = (value) => {
    setSelectedYear(value);
    if (onYearChange) {
      onYearChange(value);
    }
  };

  return (
    <div className='month-selector p-3 pb-0' >
      <div className='d-flex align-items-center justify-content-between mb-2'  >
        <div style={{ color: '#888', fontWeight: 500 }}>Select Year</div>
        <Select
          style={{ width: 75, border: 'none' }}
          value={selectedYear}
          onChange={handleYearChange}
        >
          {generateYears().map(year => (
            <Option style={{ fontWeight: 500}} key={year} value={year}>{year}</Option>
          ))}
        </Select>
      </div>

      <Row gutter={[8, 8]}>
        {months.map(month => (
          <Col span={8} key={month}>
            <Button
            className='fw-medium'
              block
              onClick={() => {
                let newSelectedMonths;
                if (selectedMonths.includes(month)) {
                  newSelectedMonths = selectedMonths.filter(m => m !== month);
                } else {
                  newSelectedMonths = [...selectedMonths, month];
                }
                setSelectedMonths(newSelectedMonths);
                if (onMonthsChange) {
                  onMonthsChange(newSelectedMonths);
                }
              }}
              style={{
                borderColor: selectedMonths.includes(month) ? '#018243' : 'transparent',
                backgroundColor: selectedMonths.includes(month) ? '#0182431A' : '#F2F2F2',
                color: selectedMonths.includes(month) ? '#018243' : '#000',
                height: '40px'
              }}
            >
              {month}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CustomMonthSelector;
