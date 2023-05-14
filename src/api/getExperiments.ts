import axios from "axios";

const PAGE_SIZE = 20;
export const getExperiments = (page: number, pageSize = PAGE_SIZE) => {
  if (true) {
    return Promise.resolve({
      data: [
        {
          id: 1,
          name: "hah",
        },
      ],
      total: 1,
    });
  }

  return axios
    .get(`/api/experiments?page=${page}&pageSize=${PAGE_SIZE}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
};
