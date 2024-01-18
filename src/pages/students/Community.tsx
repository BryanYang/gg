import React, { useState, useEffect, useCallback } from "react";
import {
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
  Modal,
  Tag,
} from "antd";
import { Content } from "antd/es/layout/layout";
import {
  AntDesignOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import useLoadData from "../../hooks/useLoadData";
import { getPosts, star, like, myStarLike, createPost } from "../../api/case";
import { Community as Posts } from "../../models/Community";
import { includes } from "lodash";
import { useMessage } from "../../hooks/MessageContext";

const IconText = ({
  icon,
  text,
  color,
}: {
  icon: React.FC<{ style?: any }>;
  text: string;
  color?: string;
}) => (
  <Space>
    {React.createElement(icon, { style: { color } })}
    {text}
  </Space>
);
const dataMock = Array.from({ length: 23 }).map((_, i) => ({
  href: "http://localhost:3001/case/1",
  title: `案例小助手`,
  avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
  description: `恭喜 熊熊${i} 同学完成了xx案例`,
  content: "选择题得分xx, 用时xx分。",
}));

const Community = () => {
  const [params, setParams] = useState<{
    search?: string;
    page?: number;
    order?: string;
    tag?: string;
  }>({
    search: "",
    page: 1,
    order: "",
    tag: "",
  });
  const { data, loading, error, refresh } = useLoadData(getPosts, params);

  const { data: myStarLikes, refresh: refreshMyStar } = useLoadData(myStarLike);

  const [form] = Form.useForm();

  const onStar = useCallback(
    async (id: number) => {
      await star(id);
      await refreshMyStar();
      await refresh();
    },
    [refresh, refreshMyStar]
  );
  const messageApi = useMessage();

  const onLike = useCallback(
    async (id: number) => {
      await like(id);
      await refreshMyStar();
      await refresh();
    },
    [refresh, refreshMyStar]
  );

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const onFinish = useCallback(() => {
    console.log("finish");
  }, []);

  const [visible, setVisible] = useState(false);

  const submitPost = useCallback(() => {
    form.validateFields().then(async (values) => {
      await createPost(values);
      await refresh();
      setVisible(false);
      messageApi.success("发布成功");
    });
  }, [form, messageApi, refresh]);

  const onSearch = useCallback((v: string) => {
    setParams((pre) => {
      return { ...pre, search: v };
    });
  }, [])

  return (
    <Content
      style={{
        padding: 60,
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
                        <Input.Search onSearch={onSearch} placeholder="搜索内容" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Radio.Group value={"large"}>
                      <Radio.Button value="large">时间</Radio.Button>
                      <Radio.Button value="default">热度</Radio.Button>
                    </Radio.Group>
                  </Row>
                  <Row style={{ height: 20}}>
                    {params.tag && (
                      <Tag
                        color={params.tag === "myLike" ? "magenta" : "orange"}
                        closable
                        onClose={(e) => {
                          e.preventDefault();
                          setParams((pre) => {
                            return { ...pre, tag: "" };
                          });
                        }}
                      >
                        {params.tag === "myLike"
                          ? "我的收藏"
                          : params.tag === "myStar"
                          ? "我的点赞"
                          : "我的发帖"}
                      </Tag>
                    )}
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
                dataSource={data?.rows || []}
                footer={
                  <div>
                    <b>公共关系仿真平台</b>
                  </div>
                }
                renderItem={(item: any) => (
                  <List.Item
                    key={item.title}
                    actions={[
                      <span onClick={() => onStar(item.id)}>
                        <IconText
                          icon={StarOutlined}
                          text={item.star}
                          color={
                            includes(myStarLikes?.star, item.id) ? "red" : ""
                          }
                          key="list-vertical-star-o"
                        />
                      </span>,
                      <span onClick={() => onLike(item.id)}>
                        <IconText
                          icon={LikeOutlined}
                          text={item.like}
                          key="list-vertical-like-o"
                          color={
                            includes(myStarLikes?.like, item.id) ? "red" : ""
                          }
                        />
                      </span>,
                      <span>
                        <IconText
                          icon={MessageOutlined}
                          text={item.comment}
                          key="list-vertical-message"
                        />
                      </span>,
                    ]}
                    extra={
                      <img
                        width={272}
                        alt="logo"
                        src={
                          item.image ||
                          "https://www.pallenz.co.nz/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png"
                        }
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
                <Button type="primary" block onClick={() => setVisible(true)}>
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
                <a
                  onClick={() => {
                    setParams((pre) => {
                      return { ...pre, tag: "myStar" };
                    });
                  }}
                >
                  我的点赞
                </a>
                <a
                  onClick={() => {
                    setParams((pre) => {
                      return { ...pre, tag: "myLike" };
                    });
                  }}
                >
                  我的收藏
                </a>
                <a
                  onClick={() => {
                    setParams((pre) => {
                      return { ...pre, tag: "myPost" };
                    });
                  }}
                >
                  我的发帖
                </a>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
      <Modal
        title="发帖"
        onCancel={() => setVisible(false)}
        open={visible}
        width={800}
        okText="发布"
        cancelText="取消"
        onOk={submitPost}
      >
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="标题" required name="title">
            <Input />
          </Form.Item>
          <Form.Item label="内容" required name="content">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="简要" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="图片链接" name="image">
            <Input.TextArea />
          </Form.Item>
          <Form.Item hidden name={"id"}></Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default Community;
