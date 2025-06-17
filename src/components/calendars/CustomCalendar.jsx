import React, { useState } from 'react';
import { Select, Button, Row, Col } from 'antd';

const { Option } = Select;

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const CustomMonthSelector = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <div className='month-selector p-3 pb-0' >
      <div className='d-flex align-items-center justify-content-between mb-2'  >
        <div style={{ color: '#888', fontWeight: 500 }}>Select Month</div>
        <Select
          defaultValue={currentYear}
          style={{ width: 75, border:'none'  }}
          suffixIcon={<img src='/icons/Dropdown.svg' />}
          onChange={value => setSelectedYear(value)}
          
        >
          {[2024, 2025, 2026].map(year => (
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
              onClick={() => setSelectedMonth(month)}
              style={{
                borderColor: selectedMonth === month ? '#018243' : 'transparent',
                backgroundColor: selectedMonth === month ? '#0182431A' : '#F2F2F2',
                color: selectedMonth === month ? '#018243' : '#000',
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
