import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProfile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  let { user } = useParams();

  useEffect(() => {
    response();
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

  const response = async () => {
    try {
      var getUsers = await axios.post("http://localhost:3001/Users", {
        username: user
      });
      console.log(getUsers.data[0].email);
      setEmail(getUsers.data[0].email);
      // for (let i = 0; i < getUsers.data.length; i++) {
      //   console.log(getUsers.data[i]);
      //   if (getUsers.data[i].username == user) {
      //     setEmail(getUsers.data[i].email);
      //     console.log(email);
      //   }
      // }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        setMsg(error.response.data.msg);
      }
    }
  };

  const adminprofile = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/updateUser", {
        username: user,
        email: email,
        password: password
      });
      // setMsg("Account Information Updated.");
      toast.success("User information updated.");
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        // setMsg(error.response.data.msg);
        toast.error(error.response.data.msg);
      }
    }
  };

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form onSubmit={adminprofile} className="box">
                {/* <p className="has-text-danger">{msg}</p> */}
                <div className="field mt-5">
                  <div className="title is-5">Update User Information</div>

                  <div className="field mt-5">
                    <label className="label">Username</label>
                    <div className="controls">
                      <input type="text" className="input" value={user} disabled required onChange={e => setUsername(e.target.value)} />
                    </div>
                  </div>

                  <label className="label"> Email</label>
                  <div className="controls">
                    <input type="text" className="input" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="field mt-5">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input type="password" className="input" placeholder="******" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>

                <div className="field mt-5">
                  <button className="button is-success is-fullwidth">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer draggable="true" position="top-center" autoClose={3000} />
    </section>
  );
};

export default AdminProfile;
