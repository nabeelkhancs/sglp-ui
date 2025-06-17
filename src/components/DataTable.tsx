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
}

const DataTable: FC<DataTableProps> = ({ columns, filters, data = [], loading = false, onFilterChange, filterValue }) => {
  const handleFilterClick = (filter: string) => {
    if (onFilterChange) onFilterChange(filter);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

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
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="id"
          loading={loading}
        />
      </div>
      <TablePagination 
        currentpageno={1} 
        pagesize={10} 
        totalrecords={data.length} 
        handlepagechange={() => {}} 
        handlepagesizechange={() => {}} 
      />
    </div>
  );
};

export default DataTable;