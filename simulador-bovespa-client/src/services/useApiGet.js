import useSWR from "swr";

import api from "./api";

const useApiGet = (url, params) => {
  const { data, error } = useSWR(url, (url) => {
    let data;
    api
      .get(url, params)
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

export default useApiGet;
