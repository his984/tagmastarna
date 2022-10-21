import Swal from "sweetalert2";

function ajaxRequest(
  url,
  rdata,
  onSuccess = () => {},
  headers = {},
  onFailed = () => {},
  method = "POST",
  popAfterReq = true
) {
  let init = {};
  if (method.toLowerCase() === "post") {
    init["body"] = JSON.stringify(rdata);
  }
  return fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...init,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject(response.json());
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((resPromise) => {
      console.log(resPromise);
      resPromise.then((res) => {
        let message = "unknown error ";
        if (res.errors) {
          res.errors.forEach((error) => {
            message += error.param + " : " + error.msg + ";";
          });
        } else if (res.message) {
          message = res.message;
        }
        if (popAfterReq)
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
          });
        onFailed(res);
      });
    });
}

export default {
  ajaxRequest,
};
