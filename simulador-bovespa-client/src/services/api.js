import axios from "axios";

const api = axios.create({
  baseURL:
    "https://us-central1-simulador-bovespa-293b3.cloudfunctions.net/api/",
});

export default api;
