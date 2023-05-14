import { Button, Card, Col, Divider, Row } from "antd";
import { useIsMobile } from "../utils";

const cardsContent: React.CSSProperties = {
  margin: "0 auto",
  paddingTop: "30vh",
};

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <div style={cardsContent}>
      <Row gutter={16} justify="center">
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card title="经典案例" bordered={false}>
            <div>
              经典案例模式中你将作为政府或企业的公关人员，处理政府或企业的日常形象公关事务、关系公关事务以及非常时期的危机公关事务。
            </div>
            <Divider />
            <Button type="primary">开始实训</Button>
          </Card>
        </Col>
        {isMobile && <Divider />}
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card title="案例自定义" bordered={false}>
            <div>
              案例自定义模式中，你可以将实事热点、新近案例上传至实训软件中，并根据其发展演变的历程设计实训题目，在社区中进行分享讨论。
            </div>
            <Divider />
            <Button type="primary">上传案例</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
