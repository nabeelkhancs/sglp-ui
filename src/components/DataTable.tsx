"use client";
import { Button, Table } from 'antd';
import TablePagination from './TablePagination';
import { FC } from 'react';

interface DataTableProps {
  filters?: boolean;
  data?: any[];
  loading?: boolean;
  columns?: any[];
}

const DataTable: FC<DataTableProps> = ({ columns, filters, data = [], loading = false }) => {
  

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
            <Button className='active'>User Registration</Button>
            <Button>Approved</Button>
            <Button>Rejected</Button>
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