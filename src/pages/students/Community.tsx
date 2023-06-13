import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  List,
  Space,
  Avatar,
  Col,
  Row,
  Card,
  Form,
  Input,
  Radio,
} from "antd";
import { getExperiments } from "../../api"; // 这里使用了一个假的API请求函数getExperiments
import { Content } from "antd/es/layout/layout";
import {
  AntDesignOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
const dataMock = Array.from({ length: 23 }).map((_, i) => ({
  href: "https://ant.design",
  title: `ant design part ${i}`,
  avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
  description: "及时性，大众为先",
  content: "危机**的5S原则如何体现在“小米案例”与“海底捞案例”当中？.",
}));

const Community = () => {
  const [data, setData] = useState<any[]>([]);
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

  const onFinish = useCallback(() => {
    console.log("finish");
  }, []);

  return (
    <Content
      style={{
        padding:60,
        width: 1440,
        margin: "0 auto",
      }}
    >
      <Row>
        <Col span={18}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card>
              <Form onFinish={onFinish}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  <Row justify="space-between" align={"middle"}>
                    <Col flex={1}>
                      <h2 style={{ textAlign: "left" }}>社区</h2>
                    </Col>
                    <Col span="6">
                      <Form.Item name="text">
                        <Input.Search placeholder="搜索内容" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Radio.Group value={"large"}>
                      <Radio.Button value="large">时间</Radio.Button>
                      <Radio.Button value="default">热度</Radio.Button>
                    </Radio.Group>
                  </Row>
                </Space>
              </Form>
            </Card>
            <Card style={{ padding: 0 }}>
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
                    actions={[
                      <IconText
                        icon={StarOutlined}
                        text="156"
                        key="list-vertical-star-o"
                      />,
                      <IconText
                        icon={LikeOutlined}
                        text="156"
                        key="list-vertical-like-o"
                      />,
                      <IconText
                        icon={MessageOutlined}
                        text="2"
                        key="list-vertical-message"
                      />,
                    ]}
                    extra={
                      <img
                        width={272}
                        alt="logo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                      />
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<a href={item.href}>{item.title}</a>}
                      description={item.description}
                    />
                    {item.content}
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>
        <Col span={1}></Col>
        <Col span={4}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card style={{ width: 300 }}>
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  icon={<AntDesignOutlined />}
                />
                <Button type="primary" block>
                  发帖
                </Button>
              </Space>
            </Card>
            <Card style={{ width: 300 }}>
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <a>我的点赞</a>
                <a>我的发帖</a>
                <a>我的收藏</a>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </Content>
  );
};

export default Community;
