import { Button, Checkbox, Divider, Select } from "antd";
import CustomMonthSelector from "../../components/calendars/CustomCalendar";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { SelectProps } from "antd";

const ReportsContainer: React.FC = () => {
  const handleChange: SelectProps['onChange'] = (value) => {
    console.log(`selected ${value}`);
  };

  const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <div className="reports">
      <div className="page-title mb-3">
        <h1 className="mb-0">Generate Reports</h1>
      </div>
      <div className="content p-4 bg-white">
        <div className="row align-items-end">
          <div className="col-md-5">
            <CustomMonthSelector />
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="fw-medium text-muted d-block mb-2">Select Case Type</label>
              <Select
                variant="filled"
                placeholder="Select "
                style={{ width: 220 }}
                onChange={handleChange}
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'Yiminghe', label: 'yiminghe' },
                ]}
              />
            </div>
            <Divider />
            <div className="checks mb-4">
              <Checkbox className="w-100 mb-3 fw-medium primary-font" onChange={onChange}>
                Select Urgent Case
              </Checkbox>
              <Checkbox className="w-100 fw-medium primary-font" onChange={onChange}>
                Select Call to Attention Case
              </Checkbox>
            </div>
          </div>

          <div className="col-md-3 text-end">
            <Button className="primary-btn" style={{ height: '40px', width: '170px' }}>
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsContainer;