"use client";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import HTTPMethods from "@/api";
import { cases } from "@/api/communications";
import { Helpers } from "@/utils/helpers";
import Link from "next/link";
import Image from 'next/image';
import { DatePicker, Select, Input, Button } from "antd";
import dayjs from "dayjs";
import { getDepartmentData } from "@/utils/dropdownData";

const CasesContainer = ({ dashboardLayout = false }) => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [casesData, setCasesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateReceived, setDateReceived] = useState<any>(null);
  const [caseStatus, setCaseStatus] = useState<string>("");
  const [court, setCourt] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [relativeDepartment, setRelativeDepartment] = useState<string>("");
  const [partyName, setPartyName] = useState<string>("");
  const [buttonType, setButtonType] = useState<string>("");

  const columns = [
    {
      title: 'Case #',
      dataIndex: 'caseNumber',
    },
    {
      title: 'Case Title',
      dataIndex: 'caseTitle',
    },
    {
      title: 'Case Status',
      dataIndex: 'caseStatus',
    },
    {
      title: 'Activity Log',
      dataIndex: 'createdAt',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: any) => {
        let link = '';
        let label = '';
        let icon = null;
        if (permissions.includes('Edit')) {
          link = `/cases/${record.caseNumber}/edit`;
          label = 'Edit';
          icon = <Image src="/icons/edit-icon.svg" width={18} height={18} alt="Edit" />;
        } else if (permissions.includes('View')) {
          link = `/cases/${record.caseNumber}/view`;
          label = 'View';
          icon = <Image src="/icons/view-icon.svg" width={18} height={18} alt="View" />;
        }
        if (!link) return null;
        return (
          <Link href={link} className='table-action d-flex align-items-center gap-1 text-dark text-decoration-none'>
            {icon}{label}
          </Link>
        );
      },
    },
  ];

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (dateReceived) params.dateReceived = dayjs(dateReceived).format("YYYY-MM-DD");
      if (caseStatus) params.caseStatus = caseStatus;
      if (court) params.court = court;
      if (region) params.region = region;
      if (relativeDepartment) params.relativeDepartment = relativeDepartment;
      if (partyName) params.partyName = partyName;
      if (buttonType) params.buttonType = buttonType;
      const res = await HTTPMethods.get(cases, params);
      setCasesData(res?.data?.result?.rows.map((caseItem: any) => {
        return {
          ...caseItem,
          createdAt: Helpers.formatDateTime(caseItem.createdAt)
        }
      }) || []);
      setPermissions(res?.data?.actions || []);

    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line
  }, [dateReceived, caseStatus, court, region, relativeDepartment, partyName, buttonType]);

  const handleChange = (field: string, value: any) => {
    if (field === "dateReceived") setDateReceived(value);
    if (field === "caseStatus") setCaseStatus(value);
    if (field === "court") setCourt(value);
    if (field === "region") setRegion(value);
    if (field === "relativeDepartment") setRelativeDepartment(value);
    if (field === "partyName") setPartyName(value);
  };

  const handleButtonTypeChange = (type: string) => {
    setButtonType(type === buttonType ? "" : type);
  };

  if (dashboardLayout) {
    return (
      <>
        <div className="table-wrapper mb-3">
          <div className="card-content">
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="form-group">
                  <label className="input-label">By Date</label>
                  <DatePicker
                    className="w-100"
                    style={{ height: 48 }}
                    value={dateReceived}
                    onChange={val => handleChange("dateReceived", val)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="input-label">Relevant Department</label>
                  <Select
                    className="w-100"
                    style={{ height: 32 }}
                    placeholder="Select"
                    options={getDepartmentData()}
                    value={relativeDepartment || undefined}
                    onChange={val => handleChange("relativeDepartment", val)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="input-label">By Party Name</label>
                  <Input
                    className="w-100"
                    style={{ height: 32 }}
                    placeholder="Enter party name"
                    value={partyName}
                    onChange={e => handleChange("partyName", e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="input-label">CS Called in Person</label>
                  <div className="d-flex gap-2">
                    <Button
                      type={buttonType === 'TypeA' ? 'primary' : 'default'}
                      style={buttonType === 'TypeA'
                        ? { background: '#3c763d', color: '#fff', borderColor: '#3c763d', width: 180, height: 48, padding: 0 }
                        : { background: '#fff', color: '#adadad', borderColor: '#D9D9D9', width: 180, height: 48, padding: 0 }}
                      onClick={() => handleButtonTypeChange('TypeA')}
                      tabIndex={-1}
                    >
                      CS Called in Person
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          // filters={false}
          data={casesData}
          loading={loading}
        />
      </>
    )
  }
  return (
    <div className="cases-page">
      <div className="page-title mb-3">
        <h1 className="mb-0">Cases</h1>
      </div>
      <div className="content">
        <DataTable
          columns={columns}
          filters={false}
          data={casesData}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default CasesContainer;