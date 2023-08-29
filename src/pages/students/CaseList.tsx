import { Col, Row, Card } from "antd";
import { Content } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import useLoadData from "../../hooks/useLoadData";
import { Case } from "../../models/Case";
import map from "lodash/map";
import { getCases } from "../../api/case";

const CaseList = () => {

  const { data, loading, error } = useLoadData<Case[]>(getCases);

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
        {map(data, (d) => (
          <Col key={d.title} style={{ marginTop: 20 }} span={6}>
            <Link to={`/case/${d.id}`}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt={d.title} src={d.pic} />}
              >
                <Card.Meta title={d.title} description={d.description} />
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
