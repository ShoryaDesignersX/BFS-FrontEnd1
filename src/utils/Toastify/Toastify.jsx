import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Toastify.css";

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 2000,
  });
};
export const handleError = (msg) => {
  toast.error(msg, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "colored",
    className: "Toastify-css",
  });
};
