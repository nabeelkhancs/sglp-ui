import { Button, Table } from 'antd';
import TablePagination from '../TablePagination';
import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';

interface DataTable2Props {
  data?: any[];
}

const DataTable2: FC<DataTable2Props> = ({ data = [] }) => {
  const columns = [
    {
      title: 'Submitted Cases',
      dataIndex: 'cases',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (val: string) => <span className={`status ${val}`}>{val}</span>
    },
    {
      title: 'Activity Log',
      dataIndex: 'dateTime',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: () => (
        <Link href="/submitted-cases/edit" className='table-action d-flex align-items-center gap-2 text-dark'>
          <Image src="/icons/edit-icon.svg" width={18} height={18} alt="Edit" />Edit
        </Link>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  return (
    <div className="table-wrapper">
      <div className="card-content">
        <Table
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
      {/* <TablePagination /> */}
    </div>
  );
};

export default DataTable2;