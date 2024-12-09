import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { user } = useParams();

  useEffect(() => {
    refreshToken();
  }, []);
  // refreshToken();
  const refreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:3001/token", {
        username: user
      });
      //console.log(response);
      if (response.data == true) {
        console.log("refreshtoken complete");
      } else {
        await axios.post("http://localhost:3001/logout");
        navigate("/");
        sessionStorage.clear();
      }
    } catch (error) {
      // setToken(response.data.accessToken);
      // const decoded = jwt_decode(response.data.accessToken);
      // setUsername(decoded.name);
      // setExpire(decoded.exp);
      if (error.response) {
        navigate("/");
      }
    }
  };

  // const axiosJWT = axios.create();

  // axiosJWT.interceptors.request.use(
  //   async config => {
  //     const currentDate = new Date();
  //     if (expire * 1000 < currentDate.getTime()) {
  //       const response = await axios.get("http://localhost:3001/token");
  //       config.headers.Authorization = `Bearer ${response.data.accessToken}`;
  //       setToken(response.data.accessToken);
  //       const decoded = jwt_decode(response.data.accessToken);
  //       setUsername(decoded.name);
  //       setExpire(decoded.exp);
  //     }
  //     return config;
  //   },
  //   error => {
  //     return Promise.reject(error);
  //   }
  // );

  // const getUsers = async () => {
  //   const response = await axiosJWT.get("http://localhost:3001/users", {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  //   setUsers(response.data);
  function Verify() {
    var UserSession = sessionStorage.getItem("Username");
    if (user == UserSession) {
      return (
        <div className="container mt-5">
          <h1>Hey {user}, welcome back to the task management app!</h1>
        </div>
      );
    } else {
      try {
        axios.post("http://localhost:3001/logout");
        navigate("/");
        sessionStorage.clear();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return Verify();
};

export default Home;
