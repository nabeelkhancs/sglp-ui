"use client";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import { APICalls } from "@/api/api-calls";
import { Spin } from "antd";
import Link from "next/link";
import Image from "next/image";

const UsersContainer = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "Users",
      dataIndex: "name"
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt"
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
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await APICalls.getAllUsers();
        setUsers(data?.records || []);
      } catch (error) {
        // handle error, e.g., show message
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Users fetched:", users);
  }, [users]);
  return (
    <div className="user-registration">
      <div className="page-title mb-3">
        <h1 className="mb-0">User Registration</h1>
      </div>
      <div className="content">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <Spin size="large" />
          </div>
        ) : (
          <DataTable
            data={users?.map(user => {
              return {
                ...user,
                createdAt: new Date(user.createdAt).toLocaleString(),
              }
            })}
            columns={columns}
            filters={true}
          />
        )}
      </div>
    </div>
  );
}

export default UsersContainer;