import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUpdateUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usergroup, setUsergroup] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const { user } = useParams();
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  useEffect(() => {
    getUserByUsername();
    refreshToken();
  }, []);

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

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async config => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:3001/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setUsername(decoded.name);
        setExpire(decoded.exp);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // const getUserByUsername = async () => {
  //   const response = await axios.get(`http://localhost:3001/users/${user}`);
  //   setUsername(response.data.username);
  //   setEmail(response.data.email);
  //   setPassword(response.data.password);
  //   setUsergroup(response.data.usergroup);
  //   setStatus(response.data.status);
  // };

  const getUserByUsername = async e => {
    e.preventDefault();
    try {
      await axios.get(`http://localhost:3001/users/${user}`, {
        username: user
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        setMsg(error.response.data.msg);
      }
    }
  };

  const updateUser = async e => {
    e.preventDefault();
    const form = document.getElementById("form");
    form.reset();
    try {
      await axios.post(`http://localhost:3001/adminupdateUser/${user}`, {
        username: user,
        password: password,
        email: email,
        usergroup: usergroup,
        status: status
      });
      // setMsg("User information updated.");
      toast.success("User information updated.");

      navigate("");
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        // setMsg(error.response.data.msg);
        toast.error(error.response.data.msg);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="title is-3">Update User Information for: {user}</h2>
      <form onSubmit={updateUser} id="form">
        <div className="has-text-danger">
          {msg}
          <label className="label">Password</label>
          <div className="control">
            <input type="password" className="input" onChange={e => setPassword(e.target.value)} placeholder="********" />
          </div>
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input type="text" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          </div>
        </div>

        <div className="field">
          <label className="label">User Group</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select onChange={e => setUsergroup(e.target.value)}>
                <option value="-">-</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Status</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select onChange={e => setStatus(e.target.value)}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button type="submit" className="button is-success">
              Update
            </button>
          </div>
        </div>
      </form>
      <ToastContainer draggable="true" position="top-center" autoClose={3000} />
    </div>
  );
};

export default AdminUpdateUser;
