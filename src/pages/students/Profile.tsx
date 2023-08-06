import { AntDesignOutlined } from "@ant-design/icons";
import { Col, Row, Avatar, Form, Input, Button, Divider } from "antd";
import { Content } from "antd/es/layout/layout";
import { useCallback } from "react";

const Profile = () => {
  const onSave = useCallback(() => {
    console.log(1212);
  }, []);

  const onFinish = (values: any) => {
    // 处理表单提交逻辑，包括验证密码和发送更改密码的请求
    console.log("Form values:", values);
  };

  return (
    <Content
      style={{
        padding: 60,
        width: 1440,
        margin: "0 auto",
        background: 'white',
        marginTop: 80,
      }}
    >
      <h2 style={{ color: "black", textAlign: "left" }}>个人资料</h2>
      <Row>
        <Col span={8}>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<AntDesignOutlined />}
          />
        </Col>
        <Col span={16}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onValuesChange={onSave}
            size="large"
            style={{ maxWidth: 600 }}
          >
            <Form.Item name="account" label="帐号">
              <Input disabled />
            </Form.Item>
            <Form.Item name="name" label="姓名">
              <Input />
            </Form.Item>
            <Form.Item name="class" label="班级">
              <Input disabled />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Form
            labelCol={{ span: 4 }}
            size="large"
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="原密码"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: "请输入原密码",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "请确认新密码",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
};

export default Profile;
