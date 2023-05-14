import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Layout,
  Menu,
  Row,
} from "antd";
import {
  MailOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Exercises from "./pages/students/Exercises";
import { useIsMobile } from "./utils";
import Home from "./pages/Home";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  lineHeight: "64px",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#108ee9",
  height: "100vh",
  background:
    "url(https://cdn.gwall2.findsoft.com.cn/prisi/3.7.4/static/img/Bitmap@2x.99db866b.png)",
  backgroundSize: "100%",
};



const App = (): JSX.Element => {
  const isMobile = useIsMobile();
  const [current, setCurrent] = useState("");

  const handleClick = (e: any) => {
    console.log("click ", e);
  };

  return (
    <Layout className="layout">
      <Header style={headerStyle}>
        <Row>
          {!isMobile && <Col flex="200px">公共关系仿真实验平台</Col>}

          <Col flex="auto">
            <Menu
              theme="dark"
              onClick={handleClick}
              selectedKeys={[current]}
              mode="horizontal"
              style={{ float: "right" }}
            >
              <Menu.Item
                key="mail"
                style={{ float: "right" }}
                icon={<MailOutlined />}
              >
                <Link to="/exercises">我的实验</Link>
              </Menu.Item>
              <Menu.Item
                key="social"
                style={{ float: "left" }}
                icon={<TeamOutlined />}
              >
                社区
              </Menu.Item>
              <Menu.Item
                key="messages"
                style={{ float: "left" }}
                icon={<BellOutlined />}
              >
                通知
                <Badge count={5}>
                  <span style={{ color: "white" }}>&nbsp;&nbsp;</span>
                </Badge>
              </Menu.Item>
              <Menu.Item
                key="help"
                style={{ float: "left" }}
                icon={<QuestionCircleOutlined />}
              >
                帮助中心
              </Menu.Item>
              <Menu.Item key="account" style={{ float: "right" }}>
                <Avatar
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                />
                &nbsp;刘同学
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
      <Content style={contentStyle}>
        <Routes>
          <Route path="exercises" element={<Exercises />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Content>
    </Layout>
  );
};


export default App;
