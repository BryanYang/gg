import { Table, Space, Button, Modal, Form, Input, Select } from "antd";
import { Content } from "antd/es/layout/layout";
import useLoadData from "../../hooks/useLoadData";
import {
  classList,
  createClassList,
  createUser,
  deleteClassList,
  deleteUser,
  getTeachers,
  listUsers,
  updateClassList,
  updateUser,
} from "../../api/case";
import { ClassList as Classes } from "../../models/Class";
import { ColumnsType } from "antd/es/table";
import { useCallback, useMemo, useState } from "react";
import { User } from "../../models/User";
import map from "lodash/map";
import { useMessage } from "../../hooks/MessageContext";
import { ExclamationCircleFilled, TeamOutlined } from "@ant-design/icons";
import { find } from "lodash";

const DEFAULT_PASSWORD = "123456";

const { Option } = Select;
const { confirm } = Modal;

const formItemLayout = {
  labelCol: {
    span: 6, // 设置 label 的宽度
  },
  wrapperCol: {
    span: 16,
  },
};

const ClassList = () => {
  const { data, loading, error, refresh } = useLoadData<Classes[]>(classList);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleStu, setVisibleStu] = useState<Classes | undefined>(undefined);
  const [editStu, setEditStu] = useState(false);
  const { data: teachers } = useLoadData<User[]>(getTeachers);
  const [students, setStudents] = useState();
  const messageApi = useMessage();

  const edit = useCallback(
    (record: Classes) => {
      form.setFieldsValue(record);
      setVisible(true);
    },
    [form]
  );

  const showStudents = useCallback(async (record: Classes) => {
    setVisibleStu(record);
    const res = await listUsers(record.id);
    if (res) {
      setStudents(res.data);
    }
  }, []);

  const destroy = useCallback(
    (record: Classes) => {
      confirm({
        title: `你确定要删除这个班级 [${record.name}]吗?`,
        icon: <ExclamationCircleFilled />,
        content: "删除后仍然可以联系管理员恢复数据",
        okText: "确定",
        cancelText: "我再想想",
        onOk: async () => {
          await deleteClassList(record.id);
          refresh();
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    [refresh]
  );

  const editStudent = useCallback(
    (record: User) => {
      form2.setFieldsValue(record);
      setEditStu(true);
    },
    [form2]
  );

  const destroyStudent = useCallback(
    (record: User) => {
      confirm({
        title: `你确定要删除学生 [${record.username}]吗?`,
        icon: <ExclamationCircleFilled />,
        okText: "确定",
        cancelText: "我再想想",
        onOk: async () => {
          await deleteUser(visibleStu!.id, record.id);
          const res = await listUsers(visibleStu!.id);
          if (res) {
            setStudents(res.data);
          }
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    [visibleStu]
  );

  const columns: ColumnsType<Classes> = useMemo(
    () => [
      {
        title: "序号",
        dataIndex: "name",
        key: "name",
        render: (v, r, i) => i + 1,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "班级人数",
        dataIndex: "count",
        key: "count",
      },
      {
        title: "所属教师",
        dataIndex: "teacherID",
        key: "teacher",
        render: (v) => find(teachers, (t) => t.id === v)?.username,
      },
      {
        title: "学生明细",
        key: "students",
        dataIndex: "students",
        render: (_, record) => (
          <a onClick={() => showStudents(record)}>
            <TeamOutlined /> 查看
          </a>
        ),
      },
      {
        title: "操作",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <a
              onClick={() => {
                edit(record);
              }}
            >
              编辑
            </a>
            <a
              onClick={() => {
                destroy(record);
              }}
            >
              删除
            </a>
          </Space>
        ),
      },
    ],
    [destroy, edit, showStudents, teachers]
  );

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (form.getFieldValue("id")) {
        await updateClassList(form.getFieldValue("id"), values);
      } else {
        await createClassList(values);
      }
      messageApi.open({
        type: "success",
        content: form.getFieldValue("id") ? "更新成功" : "创建成功",
      });
      refresh();
      setVisible(false);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };

  const handleOkStu = async () => {
    try {
      const values = await form2.validateFields();
      if (form2.getFieldValue("id")) {
        await updateUser(visibleStu!.id, values);
      } else {
        await createUser(visibleStu!.id, {
          ...values,
          password: DEFAULT_PASSWORD,
        });
      }
      messageApi.open({
        type: "success",
        content: form.getFieldValue("id") ? "更新成功" : "创建成功",
      });
      const res = await listUsers(visibleStu!.id);
      if (res) {
        setStudents(res.data);
      }
      setEditStu(false);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const resetPassword = useCallback(async () => {
    await updateUser(visibleStu!.id, {
      id: form2.getFieldValue("id"),
      password: DEFAULT_PASSWORD,
    });
    messageApi.open({
      type: "success",
      content: '重置成功',
    });
  }, [form2, messageApi, visibleStu]);

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
      {error && <span>{error.message}</span>}
      <Table
        loading={loading}
        columns={columns}
        dataSource={data || []}
        rowKey={"id"}
      />
      <Modal
        title="班级信息"
        open={visible}
        onCancel={onCancel}
        onOk={handleOk}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} {...formItemLayout} layout="horizontal">
          <Form.Item label="班级名称" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="班级名称"
            name="name"
            rules={[{ required: true, message: "请输入班级名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="班级描述"
            name="description"
            rules={[{ required: false, message: "请输入班级描述" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="任课老师"
            name="teacherID"
            rules={[{ required: true, message: "请选择班级教师" }]}
          >
            <Select>
              {map(teachers, (t) => (
                <Option key={t.id} value={t.id}>
                  {t.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!!visibleStu}
        title="学生明细"
        onCancel={() => {
          setVisibleStu(undefined);
        }}
        footer={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                form2.resetFields();
                setEditStu(true);
              }}
            >
              添加学生
            </Button>
            <Button
              onClick={() => {
                setVisibleStu(undefined);
              }}
            >
              取消
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={students}
          rowKey={"id"}
          columns={[
            {
              title: "序号",
              dataIndex: "name",
              key: "name",
              render: (v, r, i) => i + 1,
            },
            {
              title: "帐号/邮箱",
              dataIndex: "email",
              key: "email",
            },
            {
              title: "姓名",
              dataIndex: "username",
              key: "username",
            },
            {
              title: "所属教师",
              dataIndex: "teacher",
              key: "teacher",
              render: () =>
                find(teachers, (t) => t.id === visibleStu?.teacherID)?.username,
            },
            {
              title: "操作",
              key: "action",
              render: (_, record) => (
                <Space size="middle">
                  <a
                    onClick={() => {
                      editStudent(record);
                    }}
                  >
                    编辑
                  </a>
                  <a
                    onClick={() => {
                      destroyStudent(record);
                    }}
                  >
                    删除
                  </a>
                </Space>
              ),
            },
          ]}
        ></Table>
      </Modal>

      <Modal
        open={editStu}
        title="编辑学生"
        onCancel={() => {
          setEditStu(false);
        }}
        onOk={handleOkStu}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form2} {...formItemLayout} layout="horizontal">
          <Form.Item label="id" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="学号"
            name="email"
            rules={[{ required: true, message: "请输入学号/邮箱" }]}
          >
            <Input disabled={!!form2.getFieldValue("email")} />
          </Form.Item>

          <Form.Item
            label="姓名"
            name="username"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="密码" name="password">
            <span>初始密码为 {DEFAULT_PASSWORD}</span>
            <a
              onClick={() => {
                resetPassword();
              }}
            >
              &nbsp;&nbsp;&nbsp; 点击重置
            </a>
          </Form.Item>
        </Form>
      </Modal>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          创建
        </Button>
      </div>
    </Content>
  );
};

export default ClassList;
