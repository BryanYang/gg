import { useCallback, useState } from "react";
import { Button, Menu, List, Avatar, Space, Radio } from "antd";
import { Content } from "antd/es/layout/layout";
import { getMessages, deleteMessage } from "../../api/message";
import useLoadData from "../../hooks/useLoadData";
import { PandaSvg } from "../../icons/panda";

const Messages = () => {
  const [unRead, setUnRead] = useState(false);
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 0,
  // });

  const { data, loading, error } = useLoadData(getMessages);

  const onDelete = useCallback((id: number) => {
    deleteMessage(id);
  }, []);

  const handleTableChange = (pagination: any) => {
    // setPagination(pagination);
  };

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
            // pagination={{
            //   onChange: (page) => {
            //     console.log(page);
            //   },
            //   pageSize: 3,
            // }}
            dataSource={data || []}
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
                  <Button
                    onClick={() => {
                      onDelete(item.id);
                    }}
                    danger
                    type="text"
                  >
                    删除
                  </Button>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar || <PandaSvg />} />}
                  title={
                    <a href={item.template.title}>{item.template.title}</a>
                  }
                  description={item.template.content}
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
