import React, { useState, useEffect } from "react";
import { Table, Button, Menu, List, Avatar, Space, Radio } from "antd";
import { getExperiments } from "../../api"; // 这里使用了一个假的API请求函数getExperiments
import { Content } from "antd/es/layout/layout";

const dataMock = Array.from({ length: 23 }).map((_, i) => ({
  href: "https://ant.design",
  title: `您有一个实验未完成`,
  avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
  description: "开始时间 2023/05/29 11:11:00",
  content: "实验名称",
}));

const Messages = () => {
  const [data, setData] = useState<any>([]);
  const [unRead, setUnRead] = useState(false);
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
    getExperiments(1, 20)
      .then((response: any) => {
        setData(dataMock);
        setPagination((pre) => ({
          ...pre,
          total: response.total,
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Content style={{ width: 1440, margin: "0 auto" }}>
      <Space style={{ background: "white" }} align="start">
        <Menu
          onClick={handleTableChange}
          style={{ width: 256, height: 300 }}
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={[
            { title: "个人信息", key: "1", label: "个人信息" },
            { title: "系统信息", key: "2", label: "系统信息" },
          ]}
        />

        <div style={{ width: 1000 }}>
          <div style={{ textAlign: "left", marginLeft: 70 }}>
            <Radio.Group onChange={(e) => setUnRead(e.target.value)}>
              <Radio.Button value={false}>全部</Radio.Button>
              <Radio.Button value={true}>未读</Radio.Button>
            </Radio.Group>
          </div>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={data}
            footer={
              <div>
                <b>公共关系仿真平台</b>
              </div>
            }
            renderItem={(item: any) => (
              <List.Item
                key={item.title}
                actions={[]}
                extra={
                  <Button danger type="text">
                    删除
                  </Button>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.description}
                />
                <div style={{ marginLeft: 50 }}> {item.content}</div>
              </List.Item>
            )}
          />
        </div>
      </Space>
    </Content>
  );
};

export default Messages;
