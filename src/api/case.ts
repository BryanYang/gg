import axios from "../utils/axios";

import { CaseStudy } from "../models/Case";
import { UserAnswer } from "../models/userAnswer";
import { ClassList } from "../models/Class";
import { User } from "../models/User";

export const getCases = () => axios.get("/cases");

export const getCase = (id: number) => axios.get(`/cases/${id}`);

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

// Users
export const getTeachers = () => axios.get('users/teachers');


// ClassList
export const classList = () => axios.get('class-list');
export const createClassList = (data: Partial<ClassList>) => axios.put('class-list', data);
export const deleteClassList = (id: number| string) => axios.delete(`class-list/${id}`);
export const updateClassList = (id: number | string, data: Partial<ClassList>) => axios.post(`class-list/${id}`, data);

export const listUsers = (id: number | string) => axios.get(`class-list/${id}/users`);
export const createUser = (id: number | string, data: Partial<User>) => axios.put(`class-list/${id}/user`, data);
export const updateUser = (id: number | string, data: Partial<User>) => axios.post(`class-list/${id}/user`, data);
export const deleteUser = (id: number | string, userID: number) => axios.delete(`class-list/${id}/user/${userID}`);





