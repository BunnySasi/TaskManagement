import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usergroup, setUsergroup] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  let user = username;

  const Auth = async e => {
    e.preventDefault();
    //console.log(username);
    try {
      let res4 = await axios.post("http://localhost:3001/login", {
        username: username,
        password: password
      });
      console.log(res4);
      var groupname = "Admin";
      //console.log("reached pass login");
      var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
      console.log(checkgroup);
      if (checkgroup.data === true) {
        //   // navigate(`Home/${user}`);
        navigate(`Apps/${user}`);
        sessionStorage.setItem("Usergroup", "Admin");
      } else {
        //   // navigate(`/Home_UserProfile/${user}`);
        navigate(`/Apps_User/${user}`);
      }

      var response1 = await axios.post("http://localhost:3001/Users", {
        username
      });

      // console.log("hello", response1.data[0].usergroup);

      sessionStorage.setItem("Username", username);
      sessionStorage.setItem("Usergroup_App", response1.data[0].usergroup);
    } catch (error) {
      if (error.response) {
        //setMsg(error.response.data.msg);
        toast.error("Invalid Username or Password");
      }
    }
  };

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form onSubmit={Auth} className="box">
                <center className="title is-4">Login</center>
                {/* <center className="has-text-danger">{msg}</center> */}
                <div className="field mt-5">
                  <label className="label"> Username</label>
                  <div className="controls">
                    <input type="text" className="input" placeholder="Username" value={username} required onChange={e => setUsername(e.target.value)} />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input type="password" className="input" placeholder="******" value={password} required onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>
                <div className="field mt-5">
                  <button className="button is-success is-fullwidth">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer className="error-toast" draggable="true" position="top-center" autoClose={2000} />
    </section>
  );
};

export default Login;
