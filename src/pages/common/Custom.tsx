import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Menu,
  MenuProps,
  Modal,
  Result,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import queryString from "query-string";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import MenuItem from "antd/es/menu/MenuItem";
import map from "lodash/map";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Exercise } from "../../models/Exercise";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Case, CaseStep, CaseStepTitle } from "../../models/Case";
import compact from "lodash/compact";
import { useMessage } from "../../hooks/MessageContext";
import {
  createCase,
  createCaseIns,
  createExercise,
  deleteExercise,
  getCase,
  upload,
} from "../../api/case";
import useLoadData from "../../hooks/useLoadData";
import { useParams } from "react-router-dom";
import { countBy, filter, find, keys } from "lodash";

type MenuItem = Required<MenuProps>["items"][number];
const { TextArea } = Input;

type ExerciseInput = Omit<Exercise, "id"> & {
  optionList?: string[];
};

const { CheckableTag } = Tag;

function getItem(
  label: React.ReactNode,
  key: React.Key,
  disabled?: boolean,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    disabled,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items = [
  getItem("案例基本信息", "base"),
  getItem("大厅部门信息", "department"),
  getItem("调研环节题目设置", "research"),
  getItem("策划环节题目设置", "plan"),
  getItem("执行环节题目设置", "execute"),
  getItem("预览和发布", "previewAndPublish"),
];

const Custom = () => {
  const navigate = useNavigate();
  const onClick: MenuProps["onClick"] = (e) => {
    const index = items.findIndex((it) => it?.key === e.key);
    setStep(index);
  };

  const [fileList, setFileList] = useState<any[]>([]);
  let { id } = useParams();
  const messageApi = useMessage();
  const loadCase = useCallback(() => {
    if (id) {
      return getCase(Number(id));
    } else return Promise.resolve(null);
  }, [id]);
  const parsed = queryString.parse(window.location.search);
  const [step, setStep] = useState(Number(parsed.step) || 0);
  const [exerciseModal, setExerciseModal] = useState(false);
  const [form] = Form.useForm();
  const [caseTypes, setCaseTypes] = useState<string[]>([]);
  const { data, refresh } = useLoadData(loadCase);

  const [form3] = Form.useForm();

  const [form2] = Form.useForm();
  const [answers, setAnswers] = useState<string[]>([]);
  const [type, setType] = useState<string>("singleSelect");

  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);

  const exerciseListColumn = [
    {
      title: "序号",
      dataIndex: "title",
      key: "title",
      width: 60,
      render: (v: string, r: any, i: number) => i + 1,
    },
    {
      title: "题干",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (v: string) =>
        v === "multipleSelect"
          ? "多选题"
          : v === "singleSelect"
          ? "单选题"
          : "问答题",
    },
    {
      title: "权重分值",
      dataIndex: "score",
      key: "score",
      width: 100,
    },
    {
      title: "操作",
      key: "action",
      width: 130,
      dataIndex: "id",
      render: (_: string, record: Exercise) => (
        <Space size="middle">
          <a
            onClick={() => {
              editExercise(record);
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              destroyExercise(record);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (step > 1 && step < 5) {
      const exs = filter(
        data?.exercises,
        (ex: Exercise) => ex.step === step - 1
      );
      setExerciseList(exs);
      console.log(exs);
    }
  }, [data?.exercises, step]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      setCaseTypes(data.types || []);

      const ins = new Array(9).fill(undefined);
      map(data.institutions, (inst) => {
        ins[inst.orderNo] = inst.name;
      });
      form3.setFieldsValue({
        ins,
      });
    }
  }, [data, form, form3]);

  const isReady = useMemo(() => {
    return keys(countBy(data?.exercises, "step")).length === 3;
  }, [data?.exercises]);

  const createBase = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const formData = new FormData();
        const values = form.getFieldsValue();
        for (let k in values) {
          if (k === "types") {
            continue;
          }
          formData.append(k, values[k]);
        }
        formData.append("types", caseTypes.join(","));
        console.log(fileList[0].originFileObj);
        formData.append("file", fileList[0].originFileObj);

        createCase(formData as any).then((res) => {
          messageApi.success(id ? "更新成功" : "创建成功");
          setTimeout(() => {
            if (!id) {
              window.location.replace("/case-edit/" + res.data.id + "?step=1");
            }
          }, 1500);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [caseTypes, fileList, form, id, messageApi]);

  const createInstitutions = useCallback(async () => {
    const ins = compact(
      map(form3.getFieldsValue().ins, (v, index) => {
        if (v) {
          return {
            orderNo: Number(index),
            name: v,
            caseID: Number(id),
            id: data?.institutions?.[Number(index)]?.id,
          };
        } else {
          return null;
        }
      })
    );
    createCaseIns(ins)
      .then(() => {
        messageApi.success("机构设置成功");
        window.location.replace(
          window.location.pathname + "?" + queryString.stringify({ step: 2 })
        );
      })
      .catch((e) => {
        messageApi.error(e);
      });
  }, [data?.institutions, form3, id, messageApi]);

  const editExercise = useCallback(
    (ex: Exercise) => {
      form2.setFieldsValue(ex);
      form2.setFieldValue("optionList", ex.options);
      setType(ex.type);
      setAnswers(new Array(ex.options.length).fill(""));
      setExerciseModal(true);
    },
    [form2]
  );

  const destroyExercise = useCallback(
    async (ex: Exercise) => {
      await deleteExercise(ex.id);
      await refresh();
      messageApi.success("删除成功");
    },
    [messageApi, refresh]
  );

  const openExercise = useCallback(() => {
    form2.setFieldValue("optionList", ["", ""]);
    form2.setFieldValue("type", "singleSelect");
    setType("singleSelect");
    setAnswers(["", ""]);
    setExerciseModal(true);
  }, [form2]);

  const submitExercise = useCallback(() => {
    form2
      .validateFields()
      .then((values) => {
        console.log(values);
        createExercise({
          ...values,
          caseID: id,
          step: step - 1,
          answerNos: type === "statement" ? [0] : values.answerNos,
        }).then(() => {
          messageApi.success(
            form2.getFieldValue("id") ? "更新成功！" : "添加成功！"
          );
          refresh();
          setExerciseModal(false);
          form2.resetFields();
        });
      })
      .catch((e) => {
        messageApi.error("添加失败！");
      });
  }, [form2, id, messageApi, refresh, step, type]);

  const exerciseChange = useCallback((values: ExerciseInput) => {
    if (values.type) {
      setType(values.type);
    }
  }, []);

  const addOption = useCallback(() => {
    setAnswers((pre) => [...pre, ""]);
  }, []);

  const removeOption = useCallback((index: number) => {
    setAnswers((pre) => {
      const s = [...pre];
      s.splice(index, 1);
      return s;
    });
  }, []);

  const baseChange = useCallback((values: any) => {
    if (values.types) {
      setCaseTypes(values.types);
    }
  }, []);

  const toggleTypes = useCallback(
    (v: string) => {
      if (caseTypes.includes(v)) {
        setCaseTypes(caseTypes.filter((s) => s !== v));
      } else {
        setCaseTypes([...caseTypes, v]);
      }
    },
    [caseTypes]
  );

  const handlePaste = useCallback((event: any) => {
    const items = event.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        const newFile = {
          uid: Date.now(),
          name: file.name,
          status: "done",
          url: URL.createObjectURL(file),
          originFileObj: file,
        };
        setFileList([newFile]);
      }
    }
  }, []);

  return (
    <Content
      style={{
        padding: 60,
        width: 1440,
        margin: "0 auto",
        background: "white",
        marginTop: 80,
        color: "#515a6e",
      }}
    >
      <Row>
        <Col span="5">
          <Menu
            onClick={onClick}
            style={{ width: 256, textAlign: "right" }}
            defaultSelectedKeys={["base"]}
            selectedKeys={[items?.[step]?.key?.toString() || "base"]}
            mode="inline"
            items={
              isReady
                ? items
                : [
                    ...items.slice(0, 5),
                    getItem("预览和发布", "previewAndPublish", true),
                  ]
            }
          />
        </Col>
        <Col span="19" style={{ textAlign: "left" }}>
          {step === 0 && (
            <>
              <h2 style={{ lineHeight: "20px" }}>创建案例</h2>
              <Form form={form} onValuesChange={baseChange}>
                <Form.Item label="" name="id" hidden>
                  <Input placeholder="" minLength={5} />
                </Form.Item>
                <h4>标题</h4>
                <Row>
                  <Col span={10}>
                    <Form.Item
                      required
                      rules={[
                        {
                          required: true,
                          message: "请输入标题",
                        },
                      ]}
                      label="案例标题"
                      name="title"
                    >
                      <Input placeholder="" minLength={5} />
                    </Form.Item>
                  </Col>
                  <Col offset={1} span={10}>
                    <Form.Item label="案例类型" name="types">
                      <CheckableTag
                        onChange={() => {
                          toggleTypes("危机公关");
                        }}
                        checked={caseTypes.includes("危机公关")}
                      >
                        危机公关
                      </CheckableTag>
                      <CheckableTag
                        onChange={() => {
                          toggleTypes("关系公关");
                        }}
                        checked={caseTypes.includes("关系公关")}
                      >
                        关系公关
                      </CheckableTag>
                      <CheckableTag
                        onChange={() => {
                          toggleTypes("形象公关");
                        }}
                        checked={caseTypes.includes("形象公关")}
                      >
                        形象公关
                      </CheckableTag>
                    </Form.Item>
                  </Col>
                </Row>

                <h4>资源链接</h4>
                <Row>
                  <span style={{ color: "#999" }}>
                    将图片复制到剪贴板，然后粘贴到下方
                  </span>
                  <Col span={24}>
                    <Form.Item label="上传图片" name="pic">
                      <div
                        onPaste={handlePaste}
                        contentEditable
                        className="image-paste"
                        style={{
                          width: "400px",
                          border: "1px solid #ccc",
                          padding: "10px",
                          marginBottom: "10px",
                          height: "50px",
                          overflow: "hidden",
                        }}
                      >
                        复制图片后，点击这里, 然后ctrl + v 粘贴图片
                      </div>

                      {fileList[0] && (
                        <>
                          <img
                            alt="Preview"
                            style={{ height: "200px" }}
                            src={fileList[0]?.url || fileList[0]?.thumbUrl}
                          />
                        </>
                      )}
                    </Form.Item>
                  </Col>
                  <span style={{ color: "#999" }}>
                    支持搜狐/优酷等视频链接
                    <a target="_blank" href="http://49.235.113.228/2.png">
                      如何得到视频链接?
                    </a>
                  </span>
                  <Col span={24}>
                    <Form.Item label="视频链接" name="videoUrl">
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                </Row>
                <h4>案例描述</h4>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      required
                      rules={[
                        {
                          required: true,
                          message: "请输入案例描述",
                        },
                      ]}
                      label="输入描述"
                      name="description"
                    >
                      <TextArea
                        rows={4}
                        placeholder="案例描述"
                        maxLength={200}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" onClick={createBase}>
                    保存
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
          {step === 1 && (
            <>
              <h2 style={{ lineHeight: "20px" }}>配置机构</h2>
              <Form
                form={form3}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
              >
                <h4>
                  输入需要的机构的名称{" "}
                  <span style={{ color: "#999", marginTop: "-24px" }}>
                    当前最多支持9个机构
                  </span>
                </h4>

                <Row>
                  {map(new Array(9).fill(""), (_, index) => {
                    return (
                      <Col key={index} span={8}>
                        <Form.Item
                          label={`机构${index + 1}`}
                          name={[`ins`, index]}
                        >
                          <Input placeholder={`机构${index + 1}`} />
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
                <Form.Item>
                  <Button type="primary" onClick={createInstitutions}>
                    下一步
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
          {step >= 2 && step < 5 && (
            <>
              <h2 style={{ lineHeight: "20px" }}>
                {CaseStepTitle[(step - 1) as CaseStep]}题目设置
              </h2>
              <Button
                type="primary"
                onClick={openExercise}
                icon={<PlusOutlined />}
              >
                添加习题
              </Button>
              <Table
                rowKey={"id"}
                dataSource={exerciseList}
                columns={exerciseListColumn}
              />
              <Button
                type="primary"
                onClick={() => {
                  setStep((s) => s + 1);
                }}
              >
                下一步
              </Button>
              <Modal
                title="添加题目"
                onCancel={() => setExerciseModal(false)}
                open={exerciseModal}
                width={800}
                okText="提交"
                cancelText="取消"
                onOk={submitExercise}
              >
                <Form
                  form={form2}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 14 }}
                  onValuesChange={exerciseChange}
                >
                  <Form.Item hidden name={"id"}></Form.Item>
                  <Row>
                    <Col span={24}>
                      <Form.Item required name="type" label="选择题型">
                        <Select
                          options={[
                            {
                              value: "singleSelect",
                              label: "单选题",
                            },
                            {
                              value: "multipleSelect",
                              label: "多选题",
                            },
                            {
                              value: "statement",
                              label: "问答题",
                            },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        required
                        name="score"
                        rules={[
                          {
                            required: true,
                            message: "不能为空",
                          },
                        ]}
                        label="分值设置"
                        extra={
                          <span
                            style={{
                              color: "#999",
                            }}
                          >
                            所有习题总分不为100时，将按照该比例设置实际分数
                          </span>
                        }
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Form.Item required name="institutionID" label="选择机构">
                        <Select
                          options={map(data?.institutions, (ins) => ({
                            value: ins.id,
                            label: ins.name,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Form.Item
                        required
                        name="title"
                        rules={[
                          {
                            required: true,
                            message: "不能为空",
                          },
                        ]}
                        label="题目内容"
                      >
                        <Input.TextArea maxLength={400} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {type !== "statement" && (
                    <>
                      <Row>
                        <Form.List name="optionList">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(
                                ({ key, name, ...restField }, index) => (
                                  <Col span={24} key={key}>
                                    <div style={{ position: "relative" }}>
                                      <Form.Item
                                        {...restField}
                                        key={key}
                                        name={[name, "description"]}
                                        label={`选项 ${index + 1}`}
                                        style={{ flex: 1 }}
                                        rules={[
                                          {
                                            required: true,
                                            message: "选项不能为空",
                                          },
                                        ]}
                                      >
                                        <Input placeholder="请输入" />
                                      </Form.Item>
                                      <MinusCircleOutlined
                                        style={{
                                          position: "absolute",
                                          right: 165,
                                          top: 8,
                                          color: "red",
                                        }}
                                        onClick={() => {
                                          if (
                                            form2.getFieldValue("optionList")
                                              ?.length > 2
                                          ) {
                                            remove(name);
                                            removeOption(index);
                                          } else {
                                            messageApi.open({
                                              type: "warning",
                                              content: "选择题至少有2个选项",
                                            });
                                          }
                                        }}
                                      />
                                    </div>
                                  </Col>
                                )
                              )}
                              <Form.Item
                                style={{ position: "relative", left: 125 }}
                              >
                                <Button
                                  type="dashed"
                                  onClick={() => {
                                    add();
                                    addOption();
                                  }}
                                  icon={<PlusOutlined />}
                                >
                                  添加选项
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      </Row>

                      <Row>
                        <Col span={24}>
                          <Form.Item
                            required
                            rules={[
                              {
                                required: true,
                                message: "请选择答案",
                              },
                            ]}
                            name="answerNos"
                            label="正确选项"
                          >
                            <Checkbox.Group
                              options={map(
                                new Array(answers.length).fill(""),
                                (_, index) => {
                                  return {
                                    label: `选项 ${index + 1}`,
                                    value: index,
                                  };
                                }
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}

                  {type === "statement" && (
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          required
                          name={["optionList", 0, "description"]}
                          label="答案"
                        >
                          <Input.TextArea maxLength={400} />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  <Row>
                    <Col span={24}>
                      <Form.Item name="analysis" label="答案解析">
                        <Input.TextArea maxLength={400} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Form.Item name="tip" label="提示">
                        <Input.TextArea maxLength={400} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </>
          )}
          {step === 5 && (
            <>
              <Result
                status="success"
                icon={<SmileOutlined />}
                title="预览和发布"
                subTitle={
                  data?.status === 0
                    ? "当前案例处于预览模式，对学生不可见，点击预览并发布后，将对学生可见。你随时可在案例列表中预览并发布案例。"
                    : "当前已经发布上线"
                }
                extra={[
                  <Button
                    type="primary"
                    key="console"
                    onClick={() => {
                      navigate(`/case/${data?.id}`);
                    }}
                  >
                    去预览
                  </Button>,
                  <Button
                    key="buy"
                    onClick={() => {
                      navigate("/caselist");
                    }}
                  >
                    返回列表
                  </Button>,
                ]}
              />
            </>
          )}
        </Col>
      </Row>
    </Content>
  );
};

export default Custom;
