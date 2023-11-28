import {
  Col,
  Row,
  Card,
  Dropdown,
  Space,
  MenuProps,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import useLoadData from "../../hooks/useLoadData";
import { Case } from "../../models/Case";
import map from "lodash/map";
import { getCases } from "../../api/case";
import moment from "moment";
import { useUser } from "../../hooks/UserContext";

const CaseList = () => {
  const { data, loading, error } = useLoadData<Case[]>(getCases);
  const { user } = useUser();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          编辑
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          复制
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          分享
        </a>
      ),
      disabled: false,
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          删除
        </a>
      ),
      disabled: false,
    },
  ];

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
      <Row gutter={16}>
        {user.isTeacher && (
          <Col style={{ marginTop: 20 }} span={6}>
            <Link to={`/case-edit`}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt={"添加"}
                    style={{ height: "94", width: 88, margin: "40px auto" }}
                    src={
                      "https://cdn.gwall2.findsoft.com.cn/prisi/3.7.4/static/img/addCase.113fd14f.png"
                    }
                  />
                }
              >
                添加案例
              </Card>
            </Link>
          </Col>
        )}
        {map(data, (d) => (
          <Col key={d.title} style={{ marginTop: 20 }} span={6}>
            {user.isTeacher && (
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt={d.title} src={d.pic} />}
              >
                <Card.Meta title={d.title} description={d.description} />
                <div style={{ borderTop: "1px solid gray", marginTop: 10 }}>
                  <Row>
                    <Col span={20}>
                      {moment(d.createdAt).format("YYYY-MM-DD HH:mm")}
                    </Col>
                    {user.isTeacher && (
                      <Col span={4}>
                        <Dropdown menu={{ items }}>
                          <a onClick={(e) => e.preventDefault()}>
                            <Space>操作</Space>
                          </a>
                        </Dropdown>
                      </Col>
                    )}
                  </Row>
                </div>
              </Card>
            )}
            {!user.isTeacher && (
              <Link to={`/case/${d.id}`}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img alt={d.title} src={d.pic} />}
                >
                  <Card.Meta title={d.title} description={d.description} />
                  <div style={{ borderTop: "1px solid gray", marginTop: 10 }}>
                    <Row>
                      <Col span={20}>
                        {moment(d.createdAt).format("YYYY-MM-DD HH:mm")}
                      </Col>
                      {user.isTeacher && (
                        <Col span={4}>
                          <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>
                              <Space>操作</Space>
                            </a>
                          </Dropdown>
                        </Col>
                      )}
                    </Row>
                  </div>
                </Card>
              </Link>
            )}
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default CaseList;
