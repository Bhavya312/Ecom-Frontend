import axios from "axios";
import store from "../../redux/store";
import { setLoading } from "../../redux/features/loadingSlice";
import { setError } from "../../redux/features/errorSlice";
import { toast } from "react-toastify";

const baseURL = "http://localhost:3003";

const v1 = `${baseURL}/api/v1`;

const instance = axios.create({
  baseURL: v1,
  // timeout: 2000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

//request interceptor
instance.interceptors.request.use(
  (config) => {
    store.dispatch(setLoading(true));
    store.dispatch(setError(null));
    return config;
  },
  (error) => {
    toast.error("Request failed. Please try again.");
    return Promise.reject(error);
  }
);

//response interceptor
instance.interceptors.response.use(
  (response) => {
    store.dispatch(setLoading(false));
    toast.success(response.data.msg);
    return response;
  },
  (error) => {
    store.dispatch(setLoading(false));
    let message = "An unknown error occurred.";
    if (error.response) {
      const { status, data } = error.response;
      if (data.msg) {
        message = data.msg;
      } else {
        if (status === 400) message = "Bad Request. Please check your input.";
        if (status === 401) message = "Unauthorized. Please log in again.";
        if (status === 403) message = "Forbidden. You do not have permission.";
        if (status === 404) message = "Resource not found.";
        if (status === 500) message = "Internal server error. Try again later.";
      }
      store.dispatch(setError(message));
    } else if(error.request){
      store.dispatch(setError("No response from server, Check your Internet."));
    } else {
      store.dispatch(setError(error.message));
    }
    toast.error(message);
    return Promise.reject(error);
  }
);

export default instance;
