"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getCourtData } from "@/utils/dropdownData";
import DataTable from "@/components/DataTable";
import HTTPMethods from "@/api";
import { committees } from "@/api/communications";

const CommitteeContainer = () => {
  const [committeeData, setCommitteeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalData, setTotalData] = useState<number>(0);

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
      case 'court':
        options = getCourtData();
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
    { title: "Case #", dataIndex: "cpNumber" },
    { title: "Court", dataIndex: "court", render: (_: any, record: any) => getLabel('court', record.court) },
    { title: "Status", dataIndex: "status" },
    { title: "Headed By", dataIndex: "compositionHeadedBy" },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              className='table-action d-flex align-items-center gap-1 text-dark text-decoration-none'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.location.href = `/committee/${record.id}/edit`;
              }}
            >
              <img src="/icons/edit-icon.svg" width={18} height={18} alt="Edit" />
            </span>
            <span
              className='table-action d-flex align-items-center gap-1 text-dark text-decoration-none'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                // Implement view modal logic here if needed
                alert('View committee details');
              }}
            >
              <img src="/icons/view-icon.svg" width={18} height={18} alt="View" />
            </span>
          </div>
        );
      },
    },
    // Add more columns as needed
  ];

  const fetchCommittee = async () => {
    setLoading(true);
    try {
      const res = await HTTPMethods.get(committees);
      setCommitteeData(res?.data?.result?.rows || []);
      setTotalData(res?.data?.result?.count || 0);
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, []);

  return (
    <div className="committee-page">
      <h1 className="mb-3">Committees Constituted</h1>
      <DataTable
        columns={columns}
        data={committeeData}
        loading={loading}
        totalCases={totalData}
      />
    </div>
  );
};

export default CommitteeContainer;