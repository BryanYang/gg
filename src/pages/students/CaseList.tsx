import { AntDesignOutlined } from "@ant-design/icons";
import { Col, Row, Avatar, Form, Input, Button, Card } from "antd";
import { Content } from "antd/es/layout/layout";
import { useCallback } from "react";
import { Link } from "react-router-dom";

const CaseList = () => {
  const data = new Array(10).fill({
    id: 1,
    image:
      "http://case.findsoft.com.cn/prisi/upload/carouselFigure/admin/b78596ef-e56a-4b85-9ac3-9eaf08b47813/img_210709132618672%E3%80%90%E5%A4%8D%E5%88%B6%E3%80%91.jpg",
    title: "农夫山泉大战京华时报事件",
    subTitle: "关系公共",
    createdAt: "2021-10-07 18:09:21",
  });

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
        {data.map((d) => (
          <Col key={d.title} style={{ marginTop: 20 }} span={6}>
            <Link to={`/case/${d.id}`}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt={d.title} src={d.image} />}
              >
                <Card.Meta title={d.title} description={d.subTitle} />
                <div style={{ borderTop: "1px solid gray", marginTop: 10 }}>
                  {d.createdAt}
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default CaseList;
