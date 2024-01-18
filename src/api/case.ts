import axios from "../utils/axios";

import { Case, CaseStudy } from "../models/Case";
import { UserAnswer } from "../models/userAnswer";
import { ClassList } from "../models/Class";
import { User } from "../models/User";
import { Institution } from "../models/Institution";
import { Exercise, ExerciseOption } from "../models/Exercise";
import { Community } from "../models/Community";
import { Comment } from "../models/Comment";
import { AxiosResponse } from "axios";

// Case
export const getCases = (): Promise<AxiosResponse<Case[]>> => axios.get("/cases");
export const getCase = (id: number): Promise<AxiosResponse<Case>> => axios.get(`/cases/${id}`);

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
export const getCaseStudies = (): Promise<AxiosResponse<CaseStudy[]>> => axios.get(`/cases/study/list`);

// case
export const createCase = (data: Partial<Case>) => axios.put(`/cases`, data);
export const createCaseIns = (data: Partial<Institution>[]) =>
  axios.put(`/cases/institutions`, data);
export const createExercise = (data: Partial<Exercise>) =>
  axios.put(`/cases/exercise`, data);
export const deleteExercise = (id: number) =>
  axios.delete(`/cases/exercise/${id}`);
export const createExerciseOption = (data: Partial<ExerciseOption>) =>
  axios.put(`/cases/exercise-option`, data);

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

// community
export const getPosts = (params?: {
  search?: string;
  page?: number;
  order?: string;
  tag?: string;
}): Promise<AxiosResponse<{
  rows: Community[],
  count: number,
}>> => axios.get(`community/posts`, { params });
export const createPost = (data: Partial<Community>) =>
  axios.put("community/posts", data);
export const deletePost = (id: number) => axios.delete(`community/posts/${id}`);
export const star = (id: number) => axios.post(`community/star/${id}`);
export const like = (id: number) => axios.post(`community/like/${id}`);
export const myStarLike = () => axios.get(`community/starLike`);
export const comment = (id: number, body: Partial<Comment>) =>
  axios.put(`community/comment/${id}`, body);
export const delComment = (id: number) =>
  axios.delete(`community/comment/${id}`);
