import { useCallback, useRef, useState } from "react";
import {
  Space,
  TableProps,
  Table,
  Modal,
  Form,
  Input,
  Button,
  Select,
} from "antd";
import { Content } from "antd/es/layout/layout";
import {
  createMessageTemplate,
  deleteMessageTemplate,
  getMessageTemplates,
  pubMessage,
} from "../../api/message";
import useLoadData from "../../hooks/useLoadData";
import { MessageTemplate } from "../../models/MessageTemplate";
import { useMessage } from "../../hooks/MessageContext";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const MessageTemplateCom = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const currentTemplate = useRef<MessageTemplate | undefined>();
  const { data, loading, error, refresh } = useLoadData(getMessageTemplates);
  const messageApi = useMessage();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const onDelete = useCallback(
    async (id: number) => {
      await deleteMessageTemplate(id);
      messageApi.success("删除成功");
    },
    [messageApi]
  );

  const columns: TableProps<MessageTemplate>["columns"] = [
    {
      title: "序号",
      dataIndex: "key",
      rowScope: "row",
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "描述(接收者不可见)",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "发送对象",
      key: "sendNames",
      dataIndex: "sendNames",
      render: (v) => (v || []).join(","),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              currentTemplate.current = record;
              setVisible2(true);
            }}
          >
            发送
          </a>
          <a onClick={() => onDelete(Number(record.id))}>删除</a>
        </Space>
      ),
    },
  ];

  const onSave = useCallback(async () => {
    await createMessageTemplate(form.getFieldsValue());
    messageApi.success("消息创建成功！");
    setVisible(false);
    form.resetFields();
    await refresh();
  }, [form, messageApi, refresh]);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const pub = useCallback(async () => {
    messageApi.success("消息发送成功！");
    if (currentTemplate.current) {
      await pubMessage(
        Number(currentTemplate.current.id),
        form2.getFieldValue("who")
      );
      setVisible2(false);
    }
  }, [form2, messageApi]);
  return (
    <Content style={{ width: 1440, margin: "0 auto" }}>
      <Modal open={visible} onOk={onSave} onCancel={handleCancel}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          // onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={visible2} onOk={pub}>
        <Form
          {...layout}
          form={form2}
          name="control-hooks"
          // onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="who" label="发送给谁" rules={[{ required: true }]}>
            <Select
              showSearch
              mode="multiple"
              placeholder="选择发送对象"
              optionFilterProp="label"
              options={[
                {
                  value: "-1",
                  label: "所有人",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          setVisible(true);
        }}
      >
        创建消息
      </Button>
      <Table columns={columns} dataSource={data || []} />
    </Content>
  );
};

export default MessageTemplateCom;
