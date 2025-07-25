"use client";
import { Button, Table } from 'antd';
import TablePagination from './TablePagination';
import { FC } from 'react';

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
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
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
}) => {
  const handleFilterClick = (filter: string) => {
    if (onFilterChange) onFilterChange(filter);
  } 

  // Pagination props are now destructured from the function argument above

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  console.log("DataTable Rendered with data:", data);
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