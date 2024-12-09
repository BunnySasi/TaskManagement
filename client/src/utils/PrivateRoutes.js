import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoutes = () => {
  // let auth = { token: false };
  // let response = [];
  // let trueFalse = false;

  const response = axios.get("http://localhost:3001/VerifyToken", {});
  // try {
  //   const response = await axios.get("http://localhost:3001/token");
  //   console.log(response);
  //   if (response != null) {
  //     trueFalse = true;
  //   }
  // } catch (error) {
  //   console.log(error);
  //   trueFalse = false;
  // }
  // return trueFalse ? <Outlet /> : <Navigate to="/" />;
  return response ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
