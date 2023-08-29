import { AntDesignOutlined } from "@ant-design/icons";
import { Col, Row, Avatar, Form, Input, Button, Divider, Alert } from "antd";
import { Content } from "antd/es/layout/layout";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useMessage } from "../../hooks/MessageContext";
import { getProfile } from "../../api/user";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const messageApi = useMessage();

  const [err1, setErr1] = useState("");
  const [err2, setErr2] = useState("");
  const onSave = useCallback(() => {
    axios
      .put("users", form1.getFieldsValue())
      .then(() => {
        setErr1("");
        messageApi.open({
          type: "success",
          content: "操作成功",
        });
      })
      .catch((e) => {
        setErr1(e.message);
      });
  }, [form1]);

  const onFinish = () => {
    axios
      .put("users/up_password", form2.getFieldsValue())
      .then(() => {
        setErr2("");
        messageApi.open({
          type: "success",
          content: "操作成功",
        });
      })
      .catch((e) => {
        setErr2(e.response.data.message);
      });
  };

  useEffect(() => {
    getProfile().then((res) => {
      if (res?.data) {
        console.log(res.data);
        setUser(res.data);
      }
    });
  }, []);

  return (
    <Content
      style={{
        padding: 60,
        width: 1440,
        margin: "0 auto",
        background: "white",
        marginTop: 80,
      }}
    >
      <h2 style={{ color: "black", textAlign: "left" }}>个人资料</h2>
      {user && (
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
              size="large"
              style={{ maxWidth: 600 }}
              initialValues={user}
              form={form1}
            >
              {err1 && (
                <Alert
                  message={err1}
                  style={{ marginBottom: 12 }}
                  type="error"
                />
              )}
              <Form.Item name="email" label="帐号/邮箱">
                <Input disabled />
              </Form.Item>
              <Form.Item name="username" label="姓名">
                <Input />
              </Form.Item>
              <Form.Item name="class" label="班级">
                <Input disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={onSave} htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            {err2 && (
              <Alert message={err2} style={{ marginBottom: 12 }} type="error" />
            )}

            <Form
              labelCol={{ span: 4 }}
              size="large"
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              style={{ maxWidth: 600 }}
              form={form2}
            >
              <Form.Item
                label="原密码"
                name="oldPass"
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
                name="newPass"
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
                dependencies={["newPass"]}
                rules={[
                  {
                    required: true,
                    message: "请确认新密码",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPass") === value) {
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
                <Button type="primary" onClick={onFinish} htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      )}
    </Content>
  );
};

export default Profile;
