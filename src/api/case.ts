import axios from "../utils/axios";

import { Case, CaseStudy } from "../models/Case";
import { UserAnswer } from "../models/userAnswer";
import { ClassList } from "../models/Class";
import { User } from "../models/User";
import { Institution } from "../models/Institution";
import { Exercise, ExerciseOption } from "../models/Exercise";

// Case
export const getCases = () => axios.get("/cases");
export const getCase = (id: number) => axios.get(`/cases/${id}`);
// case study
export const getCaseStudy = (caseID: number, userID: number) =>
  axios.get(`/cases/${caseID}/study/${userID}`);
export const updateStudy = (data: Partial<CaseStudy>) =>
  axios.put(`/cases/study`, data);
export const createAnswer = (data: Partial<UserAnswer>) =>
  axios.put(`/cases/study/answer`, data);
export const removeAnswer = (studyId: number) =>
  axios.delete(`/cases/study/${studyId}`);
export const getAnswer = (studyID: number) =>
  axios.get(`/cases/study/${studyID}/answer`);
export const getCaseStudies = () => axios.get(`/cases/study/list`);
// case
export const createCase = (data: Partial<Case>) => axios.put(`/cases`, data);
export const createCaseIns = (data: Partial<Institution>[]) => axios.put(`/cases/institutions`, data);
export const createExercise = (data: Partial<Exercise>) => axios.put(`/cases/exercise`, data);
export const createExerciseOption = (data: Partial<ExerciseOption>) => axios.put(`/cases/exercise-option`, data);

// Users
export const getTeachers = () => axios.get("users/teachers");

// ClassList
export const classList = () => axios.get("class-list");
export const createClassList = (data: Partial<ClassList>) =>
  axios.put("class-list", data);
export const deleteClassList = (id: number | string) =>
  axios.delete(`class-list/${id}`);
export const updateClassList = (
  id: number | string,
  data: Partial<ClassList>
) => axios.post(`class-list/${id}`, data);

export const listUsers = (id: number | string) =>
  axios.get(`class-list/${id}/users`);
export const createUser = (id: number | string, data: Partial<User>) =>
  axios.put(`class-list/${id}/user`, data);
export const updateUser = (id: number | string, data: Partial<User>) =>
  axios.post(`class-list/${id}/user`, data);
export const deleteUser = (id: number | string, userID: number) =>
  axios.delete(`class-list/${id}/user/${userID}`);
