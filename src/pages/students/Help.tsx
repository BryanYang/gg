import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  List,
  Space,
  Col,
  Row,
  Card,
  Form,
  Radio,
} from "antd";
import { getExperiments } from "../../api"; // 这里使用了一个假的API请求函数getExperiments
import { Content } from "antd/es/layout/layout";
import {
  AntDesignOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
const dataMock = Array.from({ length: 23 }).map((_, i) => ({
  href: "https://ant.design",
  title: `ant design part ${i}`,
  avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
  description: "及时性，大众为先",
  content: "危机**的5S原则如何体现在“小米案例”与“海底捞案例”当中？.",
}));

const Help = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  useEffect(() => {
    setLoading(true);
    getExperiments(1, 20)
      .then((response: any) => {
        setData(dataMock);
        setPagination((pre) => ({
          ...pre,
          total: response.total,
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const onFinish = useCallback(() => {
    console.log("finish");
  }, []);

  return (
    <Content
      style={{
        padding: 60,
        width: 1440,
        margin: "0 auto",
      }}
    >
      <Card>
        <Space direction="vertical" size="middle">
          <h3>公共关系仿真实训平台</h3>
          <div>
            <h4>重要功能介绍</h4>
            <p>
              自定义功能支持学生自主设计案例；搜索功能支持外链网页信息与实训大厅内信息检索；记事本功能支持各项信息的实时录入；社区功能支持浏览、发帖、点赞、评论等。
            </p>
          </div>
          <Row style={{ width: 800, marginLeft: 160 }} gutter={[48, 48]}>
            <Col span={12}>
              <p>1.案例自定义</p>
              <p>
                教师可向学生端开放“自定义案例“板块。学生可以自行在开放的自定义端口中创建感兴趣的新近案例，搜集资料、设计题目、设计支线、设置关键词等。
              </p>
            </Col>
            <Col span={12}>
              <p>2.信息检索</p>
              <p>
                在实训所有环节中，在填写实训题目时对案例信息把握不牢，或希望查看某人物角色的信息是否更新时，可随时使用搜索功能，输入角色名称／编号即可。
              </p>
            </Col>

            <Col span={12}>
              <p>3.记事本</p>
              <p>
                实训各个环节（主要时调研环节），可将大厅中人物信息的关键部分、通过侧边导航栏搜索的外联网页内容等录入记事本中，方便随时查看做题。
              </p>
            </Col>
            <Col span={12}>
              <p>4.社区</p>
              <p>
                可在实训中随时分享自己进行答题的疑问，分享该问题截图至社区内部的讨论区；也可在实训后将报告分享至社区内部，共同探讨。
              </p>
            </Col>
          </Row>
        </Space>

        <img
          alt="example"
          src="http://case.findsoft.com.cn/prisi/static/img/u63.5cc058b7.png"
        />
        <h2>联系我们</h2>
        <p>
          哲寻科技一直在成长，不忘初心，希望你能在平台上创造出有价值的内容。无论是内容编写者还是设计师，哲寻希望尽最大的努力，让知识变得更加有价值。
        </p>
      </Card>
    </Content>
  );
};

export default Help;
