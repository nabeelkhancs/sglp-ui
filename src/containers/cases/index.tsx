"use client";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import HTTPMethods from "@/api";
import { cases } from "@/api/communications";
import { Helpers } from "@/utils/helpers";
import Link from "next/link";
import Image from 'next/image';

const CasesContainer = ({dashboardLayout = false}) => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [casesData, setCasesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      render: (_: any, record: any) => (
        <Link href={`/cases/${record.caseNumber}/edit`} className='table-action d-flex align-items-center gap-1 text-dark text-decoration-none'>
          <Image src="/icons/edit-icon.svg" width={18} height={18} alt="Edit" />Edit
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const res = await HTTPMethods.get(cases);
        console.log("Fetched cases:", res);
        setCasesData(res?.data?.result?.rows.map((caseItem: any) => {
          return {
            ...caseItem,
            createdAt: Helpers.formatDateTime(caseItem.createdAt)
          }
        }) || []);
        setPermissions(res?.data?.permissions || []);

      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);
  if(dashboardLayout){
    return (
      <DataTable
          columns={columns}
          filters={false}
          data={casesData}
          loading={loading}
        />
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