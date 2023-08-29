import { Form, Input, Button, Alert } from "antd";
import axios from '../utils/axios';

import "./Login.css";
import { useCallback, useState } from "react";

const Login = () => {
  const [err, setErr] = useState("");
  const onFinish = useCallback(async (values: any) => {
    try {
      const res = await axios.post("/auth/login", {
        username: values.email,
        password: values.password,
      });
      if (res?.data?.access_token) {
        sessionStorage.setItem("access_token", res.data.access_token);
        window.location.replace("/");
      }
    } catch (e) {
      setErr("登陆失败，请正确填用户名密码");
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>欢迎来到 公共关系系统</h1>
        <Form onFinish={onFinish}>
          {!!err && (
            <Alert style={{ marginBottom: 24 }} message={err} type="error" />
          )}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              登陆
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
