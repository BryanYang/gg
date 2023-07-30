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
import Community from "./pages/students/Community";
import Message from "./pages/students/Message";
import Help from "./pages/students/Help";
import Profile from "./pages/students/Profile";
import CaseList from "./pages/students/CaseList";
import Case from "./pages/students/Case";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  lineHeight: "64px",
  zIndex: 10,
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
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
          {!isMobile && (
            <Col flex="200px">
              <Link to="/">公共关系仿真实验平台</Link>
            </Col>
          )}
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
                <Link to="/community">社区</Link>
              </Menu.Item>
              <Menu.Item
                key="messages"
                style={{ float: "left" }}
                icon={<BellOutlined />}
              >
                <Link to="/messages">通知</Link>
                <Badge count={5}>
                  <span style={{ color: "white" }}>&nbsp;&nbsp;</span>
                </Badge>
              </Menu.Item>
              <Menu.Item
                key="help"
                style={{ float: "left" }}
                icon={<QuestionCircleOutlined />}
              >
                <Link to="/help">帮助中心</Link>
              </Menu.Item>
              <Menu.Item key="account" style={{ float: "right" }}>
                <Link to="/profile">
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                  &nbsp;刘同学
                </Link>
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
      <Content style={contentStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/community" element={<Community />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/caselist" element={<CaseList />} />
          <Route path="/case/:id" element={<Case />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
