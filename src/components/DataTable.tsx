"use client";
import { Button, Table } from 'antd';
import TablePagination from './TablePagination';
import { FC } from 'react';
import { useRouter } from 'next/navigation';

interface DataTableProps {
  filters?: boolean;
  data?: any[];
  loading?: boolean;
  columns?: any[];
  onFilterChange?: (filter: string) => void;
  filterValue?: string;
  totalCases?: number;
  currentPage?: number;
  pageSize?: number;
  userSelected?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  setSelectedCase?: (record: any) => void;
  setViewModalOpen?: (open: boolean) => void;
  onRow?: (record: any) => any;
}

const DataTable: FC<DataTableProps> = ({
  columns,
  filters,
  data = [],
  loading = false,
  onFilterChange,
  filterValue,
  totalCases,
  currentPage = 1,
  pageSize = 10,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  setSelectedCase,
  setViewModalOpen,
  userSelected = false,
  onRow,
}) => {
  const router = useRouter();
  
  const handleFilterClick = (filter: string) => {
    if (onFilterChange) onFilterChange(filter);
  } 
  
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
 
  const viewHandler = columns?.find(col => col.dataIndex === 'actions')?.render;

  return (
    <div className="table-wrapper">
      <div className="card-content">
        {filters && (
          <div className="filters mb-2">
            <Button className={filterValue === 'All' ? 'active' : ''} onClick={() => handleFilterClick('All')}>User Registration</Button>
            <Button className={filterValue === 'Approved' ? 'active' : ''} onClick={() => handleFilterClick('Approved')}>Approved</Button>
            <Button className={filterValue === 'Rejected' ? 'active' : ''} onClick={() => handleFilterClick('Rejected')}>Rejected</Button>
          </div>
        )}
        <Table
          // rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="id"
          loading={loading}
          onRow={onRow || (record => ({
            onClick: () => {
              if (userSelected) {
                router.push(`/users/${record.id}/view`);
              } else {
                if (setSelectedCase) setSelectedCase(record);
                if (setViewModalOpen) setViewModalOpen(true);
              }
            },
            style: { cursor: 'pointer' },
          }))}
        />
      </div>
      <TablePagination 
        currentpageno={currentPage} 
        pagesize={pageSize} 
        totalrecords={totalCases} 
        handlepagechange={onPageChange} 
        handlepagesizechange={onPageSizeChange} 
      />
    </div>
  );
};

export default DataTable;