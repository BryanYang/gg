import axios from "../utils/axios";

export const getMessages = () => axios.get("/messages");
export const deleteMessage = (id: number) =>
  axios.post("/messages", {
    id,
    isDeleted: true,
  });

export const readMessage = (id: number) =>
  axios.post("/messages", {
    id,
    state: 1,
  });
