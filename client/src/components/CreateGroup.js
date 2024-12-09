import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const CreateGroup = () => {
  const [usergroup, setUsergroup] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const CreateGroup = async e => {
    e.preventDefault();
    const form = document.getElementById("form");
    form.reset();
    try {
      await axios.post("http://localhost:3001/createGroup", {
        usergroup: usergroup
      });
      // toast("success", {
      //   className: "custom-toast",
      //   draggable: true,
      //   position: toast.POSITION.BOTTOM_CENTER
      // });
      setMsg("New User Group Created.");
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
              <form onSubmit={CreateGroup} className="box" id="form">
                <p className="has-text-danger">{msg}</p>
                <div className="field mt-5">
                  <h2 className="title is-6">Please enter a new user group</h2>
                  <div className="controls">
                    <input type="text" className="input" placeholder="User Group" required onChange={e => setUsergroup(e.target.value)} />
                  </div>
                </div>
                <div className="field mt-5">
                  <button type="submit" className="button is-success is-fullwidth">
                    Update
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

export default CreateGroup;
