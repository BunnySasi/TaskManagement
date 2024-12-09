import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [usergroup, setUsergroup] = useState("");
  const [status, setStatus] = useState("1");
  const navigate = useNavigate();

  const Register = async e => {
    e.preventDefault();
    const form = document.getElementById("form");
    form.reset();
    try {
      console.log(status);
      await axios.post("http://localhost:3001/register", {
        username: username,
        email: email,
        password: password,
        usergroup: usergroup,
        status: status
      });
      setMsg("New User Created.");
      navigate("");
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form onSubmit={Register} className="box" id="form">
                <p className="has-text-danger">{msg}</p>
                <div className="field mt-5">
                  <h2 className="title is-6">Please enter info for new user</h2>
                  <label className="label">Username</label>
                  <div className="controls">
                    <input type="text" className="input" placeholder="Username" required onChange={e => setUsername(e.target.value)} />
                  </div>
                </div>

                <div className="field mt-5">
                  <label className="label">Email</label>
                  <div className="controls">
                    <input type="text" className="input" placeholder="Email" required onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="field mt-5">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input type="password" className="input" placeholder="******" required onChange={e => setPassword(e.target.value)} />
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
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field mt-5">
                  <button type="submit" className="button is-success is-fullwidth">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
