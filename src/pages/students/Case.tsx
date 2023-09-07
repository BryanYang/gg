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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
import {
  useSprings,
  animated,
  useSpringRef,
  useChain,
} from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import "./index.less";

import { Case, CaseStep, CaseStepTitle, CaseStudy } from "../../models/Case";
import { useParams } from "react-router-dom";
import useLoadData from "../../hooks/useLoadData";
import {
  createAnswer,
  getAnswer,
  getCase,
  getCaseStudy,
  updateStudy,
} from "../../api/case";
import filter from "lodash/filter";
import { Institution } from "../../models/Institution";
import { Exercise } from "../../models/Exercise";
import map from "lodash/map";
import {
  compact,
  countBy,
  every,
  forEach,
  forIn,
  includes,
  some,
  uniqBy,
} from "lodash";
import { useUser } from "../../hooks/UserContext";
import { useMessage } from "../../hooks/MessageContext";
import TextArea from "antd/es/input/TextArea";
import { UserAnswer } from "../../models/userAnswer";
import { ShareAltOutlined } from "@ant-design/icons";
import ClipboardJS from "clipboard";
import Fireworks from "../../icons/Fireworks";

const CaseStudyScreen = (props: {}) => {
  let { id } = useParams();
  const messageApi = useMessage();
  const navigate = useNavigate();
  const [step, setStep] = useState<number | undefined>(undefined);
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");
  const currentStep = useRef(0);

  const insExercisesMap = useMemo(() => {
    const res: Record<number, Exercise[]> = {};
    forEach(institutions, (ins) => {
      res[ins.id] = filter(
        exercises,
        (ex: Exercise) => ex.institution.id === ins.id
      );
    });
    return res;
  }, [exercises, institutions]);

  const [isModalOpen, setIsModalOpen] = useState(step === CaseStep.Video);

  const [institutionID, setInstitutionID] = useState<number | null>();

  const loadCase = useCallback(() => {
    return getCase(Number(id));
  }, [id]);

  const userContext = useUser();

  const loadStudy = useCallback(() => {
    if (userContext.user.id) {
      return getCaseStudy(Number(id), userContext.user.id);
    } else {
      return Promise.resolve(null);
    }
  }, [id, userContext.user.id]);

  const onStepChange = useCallback((v: number) => {
    setStep(Math.min(v, currentStep.current));
  }, []);

  const { data: caseData } = useLoadData<Case>(loadCase);
  const { data: caseStudy } = useLoadData<CaseStudy>(loadStudy);

  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-btn");
    clipboard.on("success", function (e) {
      alert("分享链接已经复制到您的剪贴板，快去分享吧～");
      e.clearSelection();
    });

    return () => {
      clipboard.destroy();
    };
  }, []);

  useEffect(() => {
    if (caseStudy?.id) {
      getAnswer(caseStudy.id).then((res) => {
        const ans: UserAnswer[] = res.data;
        const answerMap: Record<number, number[]> = {};
        map(ans, (answer) => {
          answerMap[answer.exerciseID] = answer.answers;
        });
        setAnswers(answerMap);
      });
      setSummary(caseStudy.summary || "");
    }
  }, [caseStudy]);

  useEffect(() => {
    if (caseStudy) {
      currentStep.current = caseStudy?.currentStep;
      setStep(caseStudy?.currentStep);
    }
  }, [caseStudy]);

  const exercise = useMemo(() => {
    return institutionID
      ? insExercisesMap[institutionID][exerciseIndex]
      : undefined;
  }, [exerciseIndex, insExercisesMap, institutionID]);

  const springRef = useSpringRef();
  const [springs] = useSprings(
    institutions.length,
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

  const handleCancel = useCallback(() => {
    iframeRef.current?.setAttribute("src", caseData?.videoUrl || "");
    setIsModalOpen(false);
  }, [caseData?.videoUrl]);

  const handleOk = useCallback(() => {
    handleCancel();
    setStep(CaseStep.Survey);
    updateStudy({
      id: caseStudy?.id,
      currentStep: CaseStep.Survey,
    });
  }, [caseStudy?.id, handleCancel]);

  const onContinue = useCallback(async () => {
    if (answers[exercise!.id]) {
      await createAnswer({
        exerciseID: exercise!.id,
        caseStudyID: caseStudy!.id,
        answers: answers[exercise!.id],
      });

      if (exerciseIndex === insExercisesMap[institutionID!].length - 1) {
        setExerciseIndex(0);
        setInstitutionID(undefined);
        // submit
        if (
          every(exercises, (ex) =>
            includes(Object.keys(answers), String(ex.id))
          )
        ) {
          if (step === CaseStep.Report) {
            // 完成内容，跳转去我的实验
          } else {
            // 下一个 Step
            setStep(step! + 1);
            await updateStudy({
              id: caseStudy?.id,
              currentStep: step! + 1,
            });
            currentStep.current = step! + 1;
            messageApi.open({
              type: "success",
              content: `进入${CaseStepTitle[(step! + 1) as CaseStep]}`,
            });
          }
        }
      } else {
        setExerciseIndex(exerciseIndex + 1);
      }
    }
  }, [
    answers,
    caseStudy,
    exercise,
    exerciseIndex,
    exercises,
    insExercisesMap,
    institutionID,
    messageApi,
    step,
  ]);

  const onPrevious = useCallback(() => {
    setExerciseIndex(exerciseIndex - 1);
  }, [exerciseIndex]);

  const onSelectAnswer = useCallback(
    (e: any) => {
      setAnswers({
        ...answers,
        [exercise!.id]: [e.target.value],
      });
    },
    [answers, exercise]
  );

  useEffect(() => {
    if (step === CaseStep.Video) {
      setIsModalOpen(true);
      setInstitutions([]);
      setExercises([]);
    } else {
      const exercises = filter(caseData?.exercises, (ex) => ex.step === step);
      const ins = uniqBy(
        map(exercises, (ex: Exercise) => ex.institution),
        "id"
      );
      setInstitutions(ins);
      setExercises(exercises);
    }
  }, [caseData?.exercises, step]);

  useEffect(() => {
    if (step === CaseStep.Report) {
      setShowSummary(true);
    }
  }, [step]);

  const answeredCount = useMemo(() => {
    return countBy(Object.keys(answers), (exID) => {
      let id = undefined;
      forIn(insExercisesMap, (exs, insID) => {
        if (some(exs, (ex) => ex.id === Number(exID))) {
          id = insID;
        }
      });
      return id;
    });
  }, [answers, insExercisesMap]);

  const stepItems = useMemo(
    () =>
      compact(
        map(Object.values(CaseStep), (ste) => {
          if (typeof ste !== "number") {
            return null;
          }
          return {
            title: (
              <span
                onClick={() => {
                  if (ste === CaseStep.Report && currentStep.current >= 4) {
                    setShowSummary(true);
                  }
                  if (ste === CaseStep.Video) {
                    setIsModalOpen(true);
                  }
                }}
              >
                {CaseStepTitle[ste as CaseStep]}
              </span>
            ),
            description: (
              <>
                {step === ste
                  ? map(institutions, (ins) => (
                      <p key={ins.id}>
                        {ins.name}（{answeredCount[ins.id] || 0}/
                        {insExercisesMap[ins.id]?.length}）
                      </p>
                    ))
                  : undefined}
              </>
            ),
          };
        })
      ),
    [answeredCount, insExercisesMap, institutions, step]
  );

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
          {springs.map((props, index) => {
            const finished =
              answeredCount[institutions[index].id] ===
              insExercisesMap[institutions[index].id].length;
            return (
              <animated.div key={index} style={props}>
                <div
                  className={`buildings building_${index}`}
                  onClick={() => setInstitutionID(institutions[index].id)}
                >
                  <div className="iconfont" style={{}}>
                    <div className="introduction1" style={{}}>
                      <Badge
                        color={finished ? "#52c41a" : undefined}
                        count={
                          finished
                            ? answeredCount[institutions[index].id]
                            : insExercisesMap[institutions[index].id].length -
                              (answeredCount[institutions[index].id] || 0)
                        }
                      >
                        <Tag color="#55acee">{institutions[index].name}</Tag>
                      </Badge>
                    </div>
                  </div>
                </div>
              </animated.div>
            );
          })}
        </div>
      </Draggable>
      <Modal
        title="观看视频"
        open={isModalOpen}
        onOk={handleOk}
        okText="开始调研"
        cancelText="取消"
        onCancel={handleCancel}
        width={1100}
      >
        {caseData?.videoUrl && isModalOpen && (
          <iframe
            ref={iframeRef}
            width={"100%"}
            title={caseData?.title}
            height={800}
            frameBorder={0}
            src={caseData?.videoUrl}
            allowFullScreen
            scrolling="no"
          ></iframe>
        )}
      </Modal>
      <Modal
        title="题目"
        open={!!institutionID}
        onCancel={() => {
          setInstitutionID(undefined);
        }}
        footer={
          <>
            {exerciseIndex > 0 && <Button onClick={onPrevious}>上一题</Button>}
            <Button
              onClick={onContinue}
              type="primary"
              disabled={exercise && !answers[exercise.id]}
            >
              {institutionID &&
              exerciseIndex === insExercisesMap[institutionID].length - 1
                ? "完成"
                : "下一题"}
            </Button>
          </>
        }
      >
        {exercise && (
          <>
            <h3>{exercise.title}</h3>
            <Radio.Group
              onChange={onSelectAnswer}
              value={answers[exercise!.id]?.[0]}
            >
              <Space direction="vertical">
                {exercise.options.map((op: any) => (
                  <Radio key={op.id} value={op.id}>
                    {op.description}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </>
        )}
      </Modal>
      <Modal
        title="开始评估"
        open={showSummary}
        onCancel={() => {
          setShowSummary(false);
        }}
        okText="完成学习"
        onOk={async () => {
          // 完成跳转到我的学习
          await updateStudy({
            id: caseStudy?.id,
            state: 1,
            currentStep: CaseStep.Finish,
            summary,
          });
          setShowSummary(false);
          setStep(CaseStep.Finish);
          // navigate("/exercises");
        }}
      >
        <TextArea
          onChange={(e) => setSummary(e.target.value)}
          defaultValue={summary}
          rows={4}
          placeholder="请输入评估内容"
          maxLength={600}
        />
      </Modal>
      <Modal
        open={step === CaseStep.Finish}
        title="🎉🎉🎉 恭喜你，完成！"
        okText="查看分数"
        cancelButtonProps={{ hidden: true }}
        onOk={() => {
          navigate("/exercises");
        }}
        closable={false}
      >
        <div className="trophy" style={{ fontSize: 100, textAlign: "center" }}>
          🏆
        </div>
        <div className="certificate-content">
          <span>
            优秀的 <strong>{userContext.user.username}</strong>:
          </span>
          <p>
            您已经完成《{caseData?.title}》
            的练习，接下来，你可以去我的实验中心查看分数，或者可以分享更多的小伙伴来PK
            这道题～
          </p>
          <Button
            data-clipboard-text={`我刚在这里完成了一项测试，你也来试试吧！➡️${
              window.location.protocol +
              "//" +
              window.location.host +
              "/case/" +
              caseData?.id
            }`}
            className="copy-btn"
            type="dashed"
            size="large"
          >
            点我分享
            <ShareAltOutlined />
          </Button>
        </div>
        <Fireworks />
      </Modal>
      <div className="task-detail">
        <Card
          title={
            <Progress
              percent={Math.max(caseStudy?.currentStep || 0, Number(step)) * 20}
              steps={stepItems.length}
            />
          }
          bordered={false}
          style={{ width: 200 }}
        >
          <Steps
            direction="vertical"
            size="small"
            current={step}
            onChange={onStepChange}
            items={stepItems}
          />
        </Card>
      </div>
    </div>
  );
};

export default CaseStudyScreen;
