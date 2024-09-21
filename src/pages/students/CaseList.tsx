import {
  Col,
  Row,
  Card,
  Dropdown,
  Space,
  MenuProps,
  Badge,
  Popconfirm,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import useLoadData from "../../hooks/useLoadData";
import { Case } from "../../models/Case";
import map from "lodash/map";
import { createCase, getCases } from "../../api/case";
import moment from "moment";
import { useUser } from "../../hooks/UserContext";
import { useCallback } from "react";
import { useMessage } from "../../hooks/MessageContext";
import { useNavigate } from "react-router-dom";
import { compact, filter, sortBy } from "lodash";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const CaseList = () => {
  const { data, loading, error, refresh } = useLoadData(getCases);
  const { user } = useUser();
  const messageApi = useMessage();

  const switchStatus = useCallback(
    async (record: Case) => {
      await createCase({
        ...record,
        status: record.status === 1 ? 0 : 1,
      });
      await refresh();
      messageApi.success("状态切换成功");
    },
    [messageApi, refresh]
  );

  const remove = useCallback(
    async (record: Case) => {
      await createCase({
        ...record,
        isDeleted: true,
      });
      await refresh();
      messageApi.success("已经删除，你也可以联系管理员恢复");
    },
    [messageApi, refresh]
  );

  const navigate = useNavigate();

  const renderCase = (d: Case) => (
    <Link to={`/case/${d.id}`}>
      <Card
        hoverable
        cover={
          <img
            alt={d.title}
            src={d.pic}
            height={170}
            style={{ objectFit: "contain" }}
          />
        }
        actions={compact([
          <span
            onClick={(e) => {
              navigate(`/case-detail/${d.id}`);
              e.preventDefault();
            }}
          >
            <EyeOutlined key="eye" /> 查看详情
          </span>,
          d.userID === user.id ? (
            <span
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <EditOutlined key="edit" />
              <Popconfirm
                title="编辑案例"
                description={
                  d.status === 1
                    ? "案例已上线，请联系教师下线后编辑"
                    : "如果案例已上线，请联系教师先下线后再编辑"
                }
                onConfirm={() => {
                  if (d.status !== 1) {
                    navigate(`/case-edit/${d.id}`);
                  }
                }}
                okText="知道了"
                cancelText="算了"
              >
                <span
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  编辑
                </span>
              </Popconfirm>
            </span>
          ) : undefined,
          d.userID === user.id ? (
            <span
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <DeleteOutlined key="ellipsis" />
              <Popconfirm
                title="删除案例"
                description={
                  d.status === 1
                    ? "案例已上线，请联系教师下线或者删除"
                    : "确定要删除案例吗，删除后可以联系管理员恢复"
                }
                onConfirm={() => {
                  if (d.status !== 1) {
                    remove(d);
                  }
                }}
                okText="删除"
                cancelText="我再想想"
              >
                <span
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  删除
                </span>
              </Popconfirm>
            </span>
          ) : undefined,
        ])}
      >
        <Card.Meta
          description={
            d.description.substring(0, 70) +
            (d.description.length > 70 ? "..." : "")
          }
          style={{ textAlign: "left", height: 120 }}
          title={d.title}
        />
        <div style={{ borderTop: "1px solid gray", marginTop: 10 }}>
          <Row>
            <Col span={20}>
              {moment(d.createdAt).format("YYYY-MM-DD HH:mm")}
            </Col>
          </Row>
        </div>
      </Card>
    </Link>
  );

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
      <Row gutter={40}>
        <Col style={{ marginTop: 20 }} span={6}>
          <Link to={`/case-edit`}>
            <Card
              hoverable
              style={{ height: 380 }}
              cover={
                <FileAddOutlined style={{ fontSize: 46, marginTop: 150 }} />
              }
            >
              添加案例
            </Card>
          </Link>
        </Col>

        {map(
          sortBy(
            filter(data, (d) =>
              !user.isTeacher
                ? d.userID === user.id
                  ? !d.isDeleted
                  : d.status === 1
                : !d.isDeleted
            ),
            "id"
          ),
          (d) => (
            <Col key={d.title} style={{ marginTop: 20 }} span={6}>
              {user.isTeacher && (
                <Badge.Ribbon
                  color={d.status === 1 ? "green" : "pink"}
                  text={d.status === 1 ? "上线中" : "预览中"}
                >
                  <Link to={`/case/${d.id}`}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={d.title}
                          src={d.pic}
                          height={170}
                          style={{ objectFit: "contain" }}
                        />
                      }
                      actions={[
                        <span
                          onClick={(e) => {
                            navigate(`/case-detail/${d.id}`);
                            e.preventDefault();
                          }}
                        >
                          <EyeOutlined key="eye" /> 查看详情
                        </span>,
                        <span
                          onClick={(e) => {
                            switchStatus(d);
                            e.preventDefault();
                          }}
                        >
                          {d.status === 0 ? (
                            <>
                              <UploadOutlined key="setting" /> 发布线上
                            </>
                          ) : (
                            <>
                              <DownloadOutlined key="setting" /> 置为预览
                            </>
                          )}
                        </span>,
                        <span
                          onClick={(e) => {
                            navigate(`/case-edit/${d.id}`);
                            e.preventDefault();
                          }}
                        >
                          <EditOutlined key="edit" />
                        </span>,
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <DeleteOutlined key="ellipsis" />
                          <Popconfirm
                            title="删除案例"
                            description="确定要删除案例吗，删除后可以联系管理员恢复"
                            onConfirm={() => {
                              remove(d);
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              删除
                            </span>
                          </Popconfirm>
                        </span>,
                      ]}
                    >
                      <Card.Meta
                        title={d.title}
                        description={
                          d.description.substring(0, 70) +
                          (d.description.length > 70 ? "..." : "")
                        }
                        style={{ textAlign: "left", height: 120 }}
                      />
                    </Card>
                  </Link>
                </Badge.Ribbon>
              )}
              {!user.isTeacher && (
                <>
                  {d.userID === user.id ? (
                    <Badge.Ribbon
                      color={d.status === 1 ? "green" : "pink"}
                      text={d.status === 1 ? "上线中" : "预览中"}
                    >
                      {renderCase(d)}
                    </Badge.Ribbon>
                  ) : (
                    renderCase(d)
                  )}
                </>
              )}
            </Col>
          )
        )}
      </Row>
    </Content>
  );
};

export default CaseList;
