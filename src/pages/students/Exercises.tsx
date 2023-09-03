import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Tag } from "antd";
import moment from "moment";
import { Content } from "antd/es/layout/layout";
import useLoadData from "../../hooks/useLoadData";
import { CaseStudy } from "../../models/Case";
import { getCaseStudies } from "../../api/case";
import { useNavigate } from "react-router-dom";

const ExperimentTable = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        title: "序号",
        dataIndex: "id",
        key: "id",
        render: (v: any, _: any, index: number) => index + 1,
      },
      {
        title: "实验名称",
        dataIndex: "case",
        key: "name",
        render: (v: any) => v.title,
      },
      {
        title: "开始时间",
        dataIndex: "startDate",
        key: "startDate",
        render: (v: any) => moment(v).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "结束时间",
        dataIndex: "endDate",
        key: "endDate",
        render: (v: any) => moment(v).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "实验班级",
        dataIndex: "class",
        key: "class",
      },
      {
        title: "分配者",
        dataIndex: "distributor",
        key: "distributor",
      },
      {
        title: "实验状态",
        dataIndex: "state",
        key: "state",
        render: (v: any) =>
          v === 1 ? <Tag color="green">完成</Tag> : <Tag>未完成</Tag>,
      },
      {
        title: "审核状态",
        dataIndex: "state",
        key: "state",
        render: (v: any) => (v === 1 ? "已阅" : "未阅"),
      },
      {
        title: "操作",
        key: "action",
        render: (_: any, record: any) => {
          return record.state ===  0 ? (
            <Button
              onClick={() => {
                navigate(`/case/${record.case.id}`);
              }}
              type="primary"
              size="small"
            >
              {record.state === 1 ? "重做" : "继续"}
            </Button>
          ) : null;
        },
      },
    ],
    [navigate]
  );

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const { data, loading, error } = useLoadData<CaseStudy[]>(getCaseStudies);

  return (
    <Content style={{ padding: 60, width: 1440, margin: "0 auto" }}>
      <Table
        columns={columns}
        dataSource={data || []}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Content>
  );
};

export default ExperimentTable;
