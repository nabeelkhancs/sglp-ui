import { Flex, Pagination, Select, Space } from 'antd';
import { useState } from "react";

interface TablePaginationProps {
  currentpageno?: number;
  pagesize?: number;
  totalrecords?: number;
  handlepagechange: (page: number) => void;
  handlepagesizechange: (size: number) => void;
}

const TablePagination = ({
  currentpageno,
  pagesize,
  totalrecords,
  handlepagechange,
  handlepagesizechange
}: TablePaginationProps) => {
  const [pageSize, setPageSize] = useState<number>(pagesize || 10);
  const [currentPage, setCurrentPage] = useState<number>(currentpageno || 1);
  const totalItems = totalrecords || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handlepagechange(page);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
    handlepagesizechange(value);
    handlepagechange(1);
  };

  return (
    <div className='table-pagination mt-4'>
      <Flex justify='space-between' align='center'>
        <div className='total'>
          <span>Total Records:</span>  {totalItems}
        </div>
        <Space className='right-side'>
          <span className='results'>  Show Results</span>
          <Select
            onChange={handlePageSizeChange}
            value={pageSize}
            suffixIcon={<img src='/icons/Dropdown.svg' />}
            className="table-select-dropdown"
            defaultValue={10}
            style={{ width: 66 }}
            options={[
              { value: 10, label: "10" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </Space>
      </Flex>
    </div>
  );
};

export default TablePagination;