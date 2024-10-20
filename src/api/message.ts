import { Message } from "../models/Message";
import { MessageTemplate } from "../models/MessageTemplate";
import axios from "../utils/axios";

export const getMessages = (): Promise<Message[]> => axios.get("/messages");
export const getMessageTemplates = (): Promise<MessageTemplate[]> =>
  axios.get("/messages/templates");

export const createMessageTemplate = (tem: MessageTemplate) =>
  axios.put("/messages", tem);
export const readMessage = (id: number) => axios.post(`/messages/read/${id}`);
export const pubMessage = (id: number, userIDs: number[]) =>
  axios.post(`/messages/pub`, {
    id,
    userIDs,
  });
export const updateMessageTemplate = (data: Partial<MessageTemplate>) =>
  axios.post(`/messages`, data);
export const deleteMessageTemplate = (id: number) =>
  axios.post(`/messages/templates/${id}/delete`, {
    id,
    isDeleted: true,
  });

export const deleteMessage = (id: number) =>
  axios.post(`/messages/templates/${id}/delete`, {
    id,
    isDeleted: true,
  });
