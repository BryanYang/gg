import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { getExperiments } from '../../api'; // 这里使用了一个假的API请求函数getExperiments

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '实验名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '实验班级',
    dataIndex: 'class',
    key: 'class',
  },
  {
    title: '分配者',
    dataIndex: 'distributor',
    key: 'distributor',
  },
  {
    title: '实验状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    key: 'auditStatus',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Button type="primary" size="small">
        编辑
      </Button>
    ),
  },
];

const ExperimentTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  useEffect(() => {
    setLoading(true);
    getExperiments(pagination.current, pagination.pageSize)
      .then((response: any) => {
        setData(response.data);
        setPagination({
          ...pagination,
          total: response.total,
        });
      })
      .finally(() => setLoading(false));
  }, [pagination]);

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default ExperimentTable;