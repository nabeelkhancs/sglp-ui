"use client";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import { APICalls } from "@/api/api-calls";
import { Spin } from "antd";
import Link from "next/link";
import Image from "next/image";
import { UserActionButtons } from './UserActionButtons';
import { toast } from "react-toastify";

const UsersContainer = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
        <UserActionButtons
          status={record.status}
          id={record.id}
        />
      ),
    },
  ];
  const fetchUsers = async (status?: string) => {
    setLoading(true);
    try {
      const data = await APICalls.getAllUsers(status, currentPage, pageSize);
      setUsers(data?.records || []);
      setActions(data?.actions || []);
      setTotalRecords(data?.totalRecords || 0);
      setTotalPages(data?.totalPages || 0);
    } catch (error) {
      toast.error("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (selected: string) => {
    setFilter(selected);
  };

  useEffect(() => {
    fetchUsers(filter);
  }, [filter, currentPage, pageSize]);

  useEffect(() => {
    console.log("Users fetched:", users);
    console.log("Actions fetched:", actions);
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
            onFilterChange={handleFilterChange}
            filterValue={filter}
            loading={loading}
            totalCases={totalRecords}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </div>
  );
}

export default UsersContainer;