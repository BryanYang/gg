import axios from "../utils/axios";

import { CaseStudy } from "../models/Case";
import { UserAnswer } from "../models/userAnswer";

export const getCases = () => axios.get("/cases");

export const getCase = (id: number) => axios.get(`/cases/${id}`);

export const getCaseStudy = (caseID: number, userID: number) =>
  axios.get(`/cases/${caseID}/study/${userID}`);

export const updateStudy = (data: Partial<CaseStudy>) =>
  axios.put(`/cases/study`, data);

export const createAnswer = (data: Partial<UserAnswer>) =>
  axios.put(`/cases/study/answer`, data);

export const getAnswer = (studyID: number) =>
  axios.get(`/cases/study/${studyID}/answer`);

export const getCaseStudies = () => axios.get(`/cases/study/list`);
