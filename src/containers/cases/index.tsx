"use client";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import HTTPMethods from "@/api";
import { cases } from "@/api/communications";
import { Helpers } from "@/utils/helpers";
import Image from 'next/image';
import { DatePicker, Select, Input, Button } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import {
  getDepartmentData,
  getCourtData,
  getRegionData,
  getCaseTypeData,
  getCaseStatusData,
  getSubjectData
} from "@/utils/dropdownData";
// ...existing code...
import dayjs from "dayjs";

import React from 'react';
import { useSearchParams } from "next/navigation";

const CasesContainer = ({ pageName = "", dashboardLayout = false, caseType = "", outsideParams= {} }: { pageName?: string, dashboardLayout?: boolean, caseType?: string, outsideParams?: any }) => {
  const [permissions, setPermissions] = useState<any[]>(["Edit"]);
  const [casesData, setCasesData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [dateReceived, setDateReceived] = useState<any>(null);
  const [caseStatus, setCaseStatus] = useState<string>("");
  const [court, setCourt] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [relativeDepartment, setRelativeDepartment] = useState<string>("");
  const [partyName, setPartyName] = useState<string>("");
  const [buttonType, setButtonType] = useState<string>("");
  const [secretaryCalled, setSecretaryCalled] = useState<boolean>(false);
  const [courtFilter, setCourtFilter] = useState<string>("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const searchParams = useSearchParams();
  console.log("searchParams:", searchParams.toString());
  // Helper to get label for dropdown value
  const getLabel = (key: string, value: any) => {
    // Format date fields
    if (key.toLowerCase().includes('date') && value) {
      const d = dayjs(value);
      if (d.isValid()) {
        return d.format('DD-MMM-YYYY');
      }
    }
    let options;
    switch (key) {
      case 'relativeDepartment':
        options = getDepartmentData();
        break;
      case 'court':
        options = getCourtData();
        break;
      case 'region':
        options = getRegionData();
        break;
      case 'caseType':
        options = getCaseTypeData();
        break;
      case 'caseStatus':
        options = getCaseStatusData();
        break;
      case 'subject':
        options = getSubjectData();
        break;
      default:
        return Array.isArray(value) ? value.join(', ') : String(value);
    }
    if (Array.isArray(value)) {
      return value.map((v: string) => {
        const found = options.find(opt => opt.value === v);
        return found ? found.label : v;
      }).join(', ');
    } else {
      const found = options.find(opt => opt.value === value);
      return found ? found.label : value;
    }
  };

  const columns = [
    {
      title: 'Case #',
      dataIndex: 'cpNumber',
    },
    {
      title: 'Case Title',
      dataIndex: 'caseTitle',
    },
    {
      title: 'Case Status',
      dataIndex: 'caseStatus',
      render: (_: any, record: any) => getLabel('caseStatus', record.caseStatus),
    },
    {
      title: 'Activity Log',
      dataIndex: 'createdAt',
      render: (_: any, record: any) => getLabel('createdAt', record.createdAt),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: any) => {
        if (permissions.includes('Edit')) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span
                className='table-action d-flex align-items-center gap-1 text-dark text-decoration-none'
                style={{ cursor: 'pointer', zIndex: '2147483976 !important' }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.location.href = `/cases/${record.id}/edit`;
                }}
              >
                <Image src="/icons/edit-icon.svg" width={18} height={18} alt="Edit" />
              </span>
              <span
                className='table-action d-flex align-items-center gap-1 text-dark text-decoration-none'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedCase(record);
                  setViewModalOpen(true);
                }}
              >
                <Image src="/icons/view-icon.svg" width={18} height={18} alt="View" />
              </span>
            </div>
          );
        } else if (permissions.includes('View')) {
          return (
            <span
              className='table-action d-flex align-items-center gap-1 text-dark text-decoration-none'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedCase(record);
                setViewModalOpen(true);
              }}
            >
              <Image src="/icons/view-icon.svg" width={18} height={18} alt="View" />
            </span>
          );
        }
        return null;
      },
    },
  ];

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params: any = {};
      // Pagination params
      params.pageNumber = currentPage;
      params.pageSize = pageSize;
      params.cpNumber = searchParams.get('cpNumber') || undefined;
      params.dateOfHearing = searchParams.get('dateOfHearing') || undefined;
      // if (caseType && caseType.includes("court")) {
      //   params.court = caseType;
      // } else if (caseType) {
      //   params.subjectOfApplication = caseType;
      // }
      // if (dateReceived) params.dateReceived = dayjs(dateReceived).format("YYYY-MM-DD");
      // if (caseStatus) params.caseStatus = caseStatus;
      // if (court) params.court = court;
      // if (region) params.region = region;
      // if (relativeDepartment) params.relativeDepartment = relativeDepartment;
      // if (partyName) params.partyName = partyName;
      // if (buttonType) params.buttonType = buttonType;
      // if (secretaryCalled) params.secretaryCalled = secretaryCalled;
      // if (courtFilter) params.courtFilter = courtFilter;
      const res = await HTTPMethods.get(cases, {...params, ...outsideParams});
      setCasesData(res?.data?.result?.rows.map((caseItem: any) => {
        return {
          ...caseItem,
          createdAt: Helpers.formatDateTime(caseItem.createdAt)
        }
      }) || []);
      setTotalData(res?.data?.result?.count);
      setPermissions(["Edit"]);

    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line
  }, [dateReceived, caseStatus, court, region, relativeDepartment, partyName, buttonType, secretaryCalled, courtFilter, currentPage, pageSize]);

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
                  <label className="input-label fw-semibold">By Date</label>
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
                  <label className="input-label fw-semibold">Relevant Department</label>
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
                  <label className="input-label fw-semibold">By Party Name</label>
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
                  <label className="input-label fw-semibold">By Court</label>
                  <Select
                    className="w-100"
                    style={{ height: 32 }}
                    placeholder="Select Court"
                    options={getCourtData()}
                    value={courtFilter || undefined}
                    onChange={val => setCourtFilter(val)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="input-label fw-semibold">CS Called in Person</label>
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
              <div className="col-md-3">
                <div className="form-group">
                  <label className="input-label fw-semibold">Secretary Called in Person</label>
                  <Button
                    type={secretaryCalled ? 'primary' : 'default'}
                    style={secretaryCalled
                      ? { background: '#3c763d', color: '#fff', borderColor: '#3c763d', width: 180, height: 48, padding: 0 }
                      : { background: '#fff', color: '#adadad', borderColor: '#D9D9D9', width: 180, height: 48, padding: 0 }}
                    onClick={() => setSecretaryCalled(!secretaryCalled)}
                    tabIndex={-1}
                  >
                    Secretary Called in Person
                  </Button>
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
          totalCases={totalData}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          setSelectedCase={setSelectedCase}
          setViewModalOpen={setViewModalOpen}
        />
      </>
    )
  }
  return (
    <div className="cases-page">
      <div className="page-title mb-3 d-flex justify-content-between">
        <h1 className="mb-0">{pageName || "Cases"}</h1>
        <button 
          className="caseview-file-preview-viewall caseview-details-btn-abs" 
          onClick={() => setExportModalOpen(true)}
          title="Export Data to Excel"
        >
          <FileExcelOutlined style={{ fontSize: 16, color: '#1D6F42' }} />
          <span className="fw-semibold">Export</span>
        </button>
      </div>
      <div className="content">
        <DataTable
          columns={columns}
          filters={false}
          data={casesData}
          loading={loading}
          totalCases={totalData}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          setSelectedCase={setSelectedCase}
          setViewModalOpen={setViewModalOpen}
        />
      </div>
      {/* Modal for viewing case data */}
      <React.Suspense fallback={null}>
        {viewModalOpen && (
          <>
            {(() => {
              const CaseViewModal = require('@/components/modal/CaseViewModal').default;
              return (
                <CaseViewModal
                  open={viewModalOpen}
                  onClose={() => setViewModalOpen(false)}
                  caseData={selectedCase}
                />
              );
            })()}
          </>
        )}
      </React.Suspense>
      {/* Modal for exporting data */}
      <React.Suspense fallback={null}>
        {exportModalOpen && (
          <>
            {(() => {
              const ExportDataModal = require('@/components/modal/ExportDataModal').default;
              return (
                <ExportDataModal
                  open={exportModalOpen}
                  onClose={() => setExportModalOpen(false)}
                />
              );
            })()}
          </>
        )}
      </React.Suspense>
    </div>
  );
}

export default CasesContainer;