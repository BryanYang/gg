import {
  Badge,
  Button,
  Card,
  Modal,
  Progress,
  Radio,
  Space,
  Steps,
  Tag,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import Draggable from "react-draggable";
import {
  useSprings,
  animated,
  useSpringRef,
  useChain,
} from "@react-spring/web";

import "./index.less";
import { Exercise } from "../../models/Exercise";

import { CaseStep, TestCaseStudy } from "../../models/Case";
import { useParams } from "react-router-dom";

const CaseStudy = (props: {}) => {
  let { id } = useParams();

  const caseStudy = TestCaseStudy;

  const [step, setStep] = useState(caseStudy.currentStep);
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [institution, setInstitution] = useState<string | undefined>();

  const [answer, setAnswer] = useState<string>();

  const [index, setIndex] = useState(0);
  const length = 3;

  const exercise = useMemo(() => {
    return institution
      ? caseStudy.case?.exercises?.[step]?.[institution]?.[exerciseIndex]
      : undefined;
  }, [caseStudy.case?.exercises, exerciseIndex, institution, step]);

  const springRef = useSpringRef();
  const [springs] = useSprings(
    13,
    (i) => ({
      ref: springRef,
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay: i * 400,
      config: {
        mass: 2,
        tension: 220,
      },
    }),
    []
  );

  useChain([springRef], [], 1500);

  const handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onContinue = useCallback(() => {
    if (index === length - 1) {
      // submit
    } else {
      setIndex(index + 1);
    }
  }, [index]);

  const onPrevious = useCallback(() => {
    setIndex(index - 1);
  }, [index]);

  const onChange = useCallback((e: any) => {
    setAnswer(e.target.value);
  }, []);

  useEffect(() => {
    if (step === CaseStep.Survey) {
      setIsModalOpen(true);
    }
  }, [step]);

  return (
    <div className="case-home">
      <Draggable
        bounds={{
          left: window.innerWidth - 2049 > 0 ? 0 : window.innerWidth - 2049,
          right: 0,
          top:
            window.innerHeight - 1052 - 64 > 0
              ? 0
              : window.innerHeight - 1052 - 64,
          bottom: 0,
        }}
      >
        <div id="map">
          <img
            className="mapImage"
            alt="bg"
            src="https://cdn.gwall2.findsoft.com.cn/prisi/3.7.4/static/img/map.jpg"
          />
          {springs.map((props, index) => (
            <animated.div key={index} style={props}>
              <div
                className={`buildings building_${index}`}
                onClick={() => setInstitution(String(index))}
              >
                <div className="iconfont" style={{}}>
                  <div className="introduction1" style={{}}>
                    <Badge count={0} showZero>
                      <Tag color="#55acee">机构{index}</Tag>
                    </Badge>
                  </div>
                </div>
              </div>
            </animated.div>
          ))}
        </div>
      </Draggable>
      <Modal
        title="观看视频"
        open={isModalOpen}
        onOk={handleOk}
        okText="开始调研"
        cancelText="取消"
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Modal
        title="题目"
        open={!!institution}
        onCancel={() => {
          setInstitution(undefined);
        }}
        footer={
          <>
            {index > 0 && <Button onClick={onPrevious}>上一题</Button>}
            <Button onClick={onContinue} type="primary">
              {index === length - 1 ? "提交" : "下一题"}
            </Button>
          </>
        }
      >
        {exercise && (
          <>
            <h3>{exercise.title}</h3>
            <Radio.Group onChange={onChange} value={answer}>
              <Space direction="vertical">
                {exercise.options.map((op) => (
                  <Radio key={op.id} value={op.id}>
                    {op.description}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </>
        )}
      </Modal>
      <div className="task-detail">
        <Card
          title={<Progress percent={30} steps={5} />}
          bordered={false}
          style={{ width: 200 }}
        >
          <Steps
            direction="vertical"
            size="small"
            current={1}
            items={[
              {
                title: "观看案例",
                description: (
                  <>
                    <p>机构（1/3）</p>
                  </>
                ),
              },
              {
                title: "调研环节",
                description: (
                  <>
                    <p>机构（1/3）</p>
                  </>
                ),
              },
              {
                title: "策划环节",
                description: (
                  <>
                    <p>机构1（1/3）</p>
                  </>
                ),
              },
              {
                title: "执行环节",
                description: (
                  <>
                    <p>机构1（1/3）</p>
                  </>
                ),
              },
              {
                title: "评估环节",
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default CaseStudy;
