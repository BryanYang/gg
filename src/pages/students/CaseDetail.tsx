import { Card, Col, Divider, Rate, Row, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import useLoadData from "../../hooks/useLoadData";
import Meta from "antd/es/card/Meta";
import { useNavigate, useParams } from "react-router";
import { getCase, rateCase } from "../../api/case";
import moment from "moment";
import { filter, find, map, mean, sum } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProfile } from "../../api/user";

const CaseDetail = () => {
  let { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const { data, refresh } = useLoadData(getCase, Number(id));
  useEffect(() => {
    getProfile().then((res) => {
      if (res?.data) {
        setUser(res.data);
      }
    });
  }, []);

  const score = sum(map(data?.exercises, (ex) => ex.score));
  // const { data } = useLoadData(getCase, Number(id));
  const navigate = useNavigate();

  const rate = useCallback(
    async (score: number) => {
      await rateCase(Number(id), score);
      refresh();
    },
    [id, refresh]
  );

  const caseRate = mean(
    map(
      filter(data?.caseStudies, (stu) => !!stu.caseRate),
      (stu) => stu.caseRate
    )
  );

  const myStudy = useMemo(
    () => find(data?.caseStudies, (stu) => stu.userID === user?.id),
    [data?.caseStudies, user?.id]
  );

  return (
    <Content style={{ width: 800, margin: "0 auto" }}>
      <Card
        style={{ width: 800, marginTop: 50 }}
        cover={
          <img
            alt="example"
            height={200}
            width={"auto"}
            style={{ width: "auto", margin: "0 auto" }}
            src={data?.pic}
          />
        }
      >
        <Meta title="案例详情" description={data?.description} />
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <div className="summary">
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Row>
                <Col span={11} style={{ textAlign: "right" }}>
                  <strong>上传人:</strong>
                </Col>
                <Col offset={1} span={12} style={{ textAlign: "left" }}>
                  {" "}
                  {data?.user?.username}
                </Col>
              </Row>

              <Row>
                <Col span={11} style={{ textAlign: "right" }}>
                  <strong>创建日期:</strong>{" "}
                </Col>
                <Col offset={1} span={12} style={{ textAlign: "left" }}>
                  {" "}
                  {moment(data?.createdAt).format("YYYY-MM-DD hh:mm")}
                </Col>
              </Row>

              <Row>
                <Col span={11} style={{ textAlign: "right" }}>
                  <strong>总分:</strong>
                </Col>
                <Col offset={1} span={12} style={{ textAlign: "left" }}>
                  {score}
                </Col>
              </Row>

              <Row>
                <Col span={11} style={{ textAlign: "right" }}>
                  <strong>答题时间(预估):</strong>
                </Col>
                <Col offset={1} span={12} style={{ textAlign: "left" }}>
                  {(data?.exercises?.length || 0) * 1 + 5} 分钟
                </Col>
              </Row>

              <Row>
                <Col span={11} style={{ textAlign: "right" }}>
                  <strong>完成用户数:</strong>
                </Col>
                <Col offset={1} span={12} style={{ textAlign: "left" }}>
                  {data?.caseStudies?.length}{" "}
                  <a
                    onClick={() => {
                      navigate(`/studies/${data?.id}`);
                    }}
                  >
                    查看报告
                  </a>
                </Col>
              </Row>

              <Row>
                <Col span={11} style={{ textAlign: "right" }}>
                  <strong style={{ position: "relative", top: 8 }}>
                    总评分
                  </strong>
                </Col>
                <Col offset={1} span={12} style={{ textAlign: "left" }}>
                  <Rate disabled value={caseRate} />
                </Col>
              </Row>

              <Divider />
              <Row>
                <Col span={11} style={{ textAlign: "right" }}>
                  <strong style={{ position: "relative", top: 8 }}>
                    我的评分
                  </strong>
                </Col>
                <Col offset={1} span={12} style={{ textAlign: "left" }}>
                  <Rate
                    onChange={rate}
                    disabled={!myStudy}
                    value={myStudy?.caseRate}
                  />{" "}
                  (学习案例后方可进行打分)
                </Col>
              </Row>
            </Space>
          </div>
        </div>
      </Card>
    </Content>
  );
};

export default CaseDetail;
