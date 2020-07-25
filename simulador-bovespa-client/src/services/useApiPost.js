import useSWR from "swr";

import api from "./api";

const useApiPost = (url, params) => {
  const { data, error } = useSWR(url, (url, params) => {
    let data;
    api
      .post(url, params)
      .then((response) => {
        data = response;
        return data;
      })
      .catch((err) => {
        console.error(err);
        return err.code;
      });
  });

  return { data, error };
};

export default useApiPost;
