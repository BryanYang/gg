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
import { sortBy } from "lodash";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const CaseList = () => {
  const { data, loading, error, refresh } = useLoadData(getCases);
  const { user } = useUser();
  const messageApi = useMessage();
  const navigate = useNavigate();

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

  const renderItems = useCallback(
    (record: Case) => {
      const id = record.id;
      return [
        {
          key: "1",
          label: (
            <a
              rel="noopener noreferrer"
              onClick={(e) => {
                navigate(`/case-edit/${id}`);
                e.preventDefault();
              }}
            >
              编辑
            </a>
          ),
        },
        {
          key: "2",
          label: (
            <a
              rel="noopener noreferrer"
              onClick={(e) => {
                switchStatus(record);
                e.preventDefault();
              }}
            >
              {record.status === 1 ? "置为预览" : "发布线上"}
            </a>
          ),
        },
        {
          key: "3",
          label: (
            <div
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Popconfirm
                title="删除案例"
                description="确定要删除案例吗，删除后可以联系管理员恢复"
                onConfirm={() => {
                  remove(record);
                }}
                okText="Yes"
                cancelText="No"
              >
                <a
                  style={{ color: "red" }}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  删除
                </a>
              </Popconfirm>
            </div>
          ),
          disabled: false,
        },
      ];
    },
    [remove, switchStatus]
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
        {user.isTeacher && (
          <Col style={{ marginTop: 20 }} span={6}>
            <Link to={`/case-edit`}>
              <Card
                hoverable
                style={{ height: 380 }}
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
        {map(sortBy(data, "id"), (d) => (
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
                        <EditOutlined key="edit" /> 编辑
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
                    <div>
                      <Row>
                        {/* <Col span={24}>
                          <span style={{ color: "rgba(0, 0, 0, 0.3)" }}>
                            {moment(d.createdAt).format("YYYY-MM-DD HH:mm")}
                          </span>
                        </Col> */}
                        {/* {user.isTeacher && (
                          <Col span={4}>
                            <Dropdown menu={{ items: renderItems(d) }}>
                              <a onClick={(e) => e.preventDefault()}>
                                <Space>操作</Space>
                              </a>
                            </Dropdown>
                          </Col>
                        )} */}
                      </Row>
                    </div>
                  </Card>
                </Link>
              </Badge.Ribbon>
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
